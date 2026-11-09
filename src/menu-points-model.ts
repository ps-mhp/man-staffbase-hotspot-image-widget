/*!
 * Copyright 2026, MHP Management und IT-Beratung GmbH and contributors.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Was der Modus „Menü“ speichert, und wie es in die Attribute kommt.
 *
 * Gespeichert wird je Menüebene — einem Eintrag mit Unterpunkten — ein Bild
 * und die Punkte seiner direkten Unterpunkte. Ein Punkt ist nur Menü-ID und
 * Position; Titel und Ziel kommen bei jedem Aufruf frisch aus dem Menü.
 *
 * Das Bild der Startebene steht nicht hier, sondern im Attribut `image`: im
 * Content Designer wählt es dessen eigener Bild-Upload. Die Bilder tieferer
 * Ebenen kommen aus der Mediathek und stehen hier.
 *
 * Eigenes Attribut statt `points`: ältere Bundles verwerfen dort jeden Punkt
 * ohne Titel, und ein Wechsel zwischen den Modi soll keine Punkte kosten.
 */

import { encodePayload } from "@shared/payload";
import { isStaffbaseId } from "@shared/staffbase/ids";

import { HotspotImage, MAX_POINTS, newPointId, readRaw } from "./points-model";

/** Woher die Punkte kommen: von Hand gesetzt oder aus dem Menü. */
export type PointSource = "manual" | "menu";

/** Was ein Klick auf einen Punkt mit Unterpunkten tut: ins Untermenü wechseln oder die Seite öffnen. */
export type MenuClickMode = "enter" | "open";

export interface MenuHotspotPoint {
  /** Stabil über das Verschieben hinweg — React-Key. */
  id: string;
  /** Der Menüeintrag, kleingeschrieben. Je Ebene und Eintrag höchstens ein Punkt. */
  menuId: string;
  /** Prozent der Bildbreite bzw. -höhe, 0 bis 100. */
  x: number;
  y: number;
  /** Felder einer späteren Version, die diese nicht kennt — siehe `HotspotPoint`. */
  unknown?: Record<string, unknown>;
}

/** Eine Menüebene: ihr Bild (nicht für die Startebene) und die Punkte ihrer Unterpunkte. */
export interface MenuLevelLayout {
  image?: HotspotImage;
  points: MenuHotspotPoint[];
}

/** Alle Ebenen nach der ID ihres Menüeintrags, kleingeschrieben. */
export type MenuLayout = Readonly<Record<string, MenuLevelLayout>>;

/** Drei Ebenen, den Startknoten mitgezählt: Knoten, Unterpunkte, deren Unterpunkte. */
export const DEFAULT_MENU_DEPTH = 3;

/** Eine Ebene allein wäre nur der Startknoten, ohne Menü daneben. */
export const MIN_MENU_DEPTH = 2;

/** Tiefer blättert niemand, und jede Ebene kostet Anfragen beim Laden der Seite. */
export const MAX_MENU_DEPTH = 6;

const KNOWN_POINT_KEYS = new Set(["id", "menuId", "x", "y"]);

/** Nur http(s) und Pfade der eigenen Instanz — eine `javascript:`-Adresse soll nicht als `src` enden. */
const IMAGE_URL = /^(https?:\/\/|\/)\S+$/i;

const EMPTY_LEVEL: MenuLevelLayout = { points: [] };

/** Alles außer `menu` bedeutet den bisherigen Modus. */
export function readSource(raw: unknown): PointSource {
  return raw === "menu" ? "menu" : "manual";
}

/** Alles außer `open` bedeutet „ins Untermenü wechseln“ — auch `reveal` aus 0.2.0-rc.1. */
export function readMenuClick(raw: unknown): MenuClickMode {
  return raw === "open" ? "open" : "enter";
}

/** Eine ganze Zahl im erlaubten Bereich, sonst die Vorgabe. */
export function readMenuDepth(raw: unknown): number {
  const value = typeof raw === "string" && /^\d+$/.test(raw.trim()) ? Number(raw) : NaN;
  return value >= MIN_MENU_DEPTH && value <= MAX_MENU_DEPTH ? value : DEFAULT_MENU_DEPTH;
}

const inImage = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function readMenuPoint(value: unknown): MenuHotspotPoint | null {
  if (!isRecord(value)) return null;
  if (!isStaffbaseId(value.menuId) || !inImage(value.x) || !inImage(value.y)) return null;

  const id = typeof value.id === "string" && value.id.trim() !== "" ? value.id : newPointId();
  const point: MenuHotspotPoint = { id, menuId: value.menuId.toLowerCase(), x: value.x, y: value.y };
  const unknown = Object.fromEntries(Object.entries(value).filter(([key]) => !KNOWN_POINT_KEYS.has(key)));
  return Object.keys(unknown).length > 0 ? { ...point, unknown } : point;
}

function readLevelImage(value: unknown): HotspotImage | undefined {
  if (!isRecord(value) || typeof value.url !== "string" || !IMAGE_URL.test(value.url.trim())) return undefined;
  return {
    url: value.url.trim(),
    alt: typeof value.alt === "string" ? value.alt : "",
    ...(typeof value.width === "number" ? { width: value.width } : {}),
    ...(typeof value.height === "number" ? { height: value.height } : {}),
  };
}

function readLevel(value: unknown): MenuLevelLayout | null {
  if (!isRecord(value)) return null;
  const seen = new Set<string>();
  const points = (Array.isArray(value.points) ? value.points : [])
    .map(readMenuPoint)
    .filter((point): point is MenuHotspotPoint => {
      if (point === null || seen.has(point.menuId)) return false;
      seen.add(point.menuId);
      return true;
    })
    .slice(0, MAX_POINTS);
  const image = readLevelImage(value.image);
  // Eine Ebene ohne Bild und ohne Punkte trägt nichts — wie beim Schreiben.
  if (image === undefined) return points.length === 0 ? null : { points };
  return { image, points };
}

/** Liest das Attribut `menu-points`; unbrauchbare Ebenen und Punkte fallen still weg. */
export function parseMenuLayout(raw: string): MenuLayout {
  const value = readRaw(raw);
  if (!isRecord(value) || !isRecord(value.levels)) return {};
  return Object.fromEntries(
    Object.entries(value.levels).flatMap(([levelId, levelValue]) => {
      if (!isStaffbaseId(levelId)) return [];
      const level = readLevel(levelValue);
      return level === null ? [] : [[levelId.toLowerCase(), level]];
    }),
  );
}

/** Schreibt das Attribut `menu-points`; leere Ebenen fallen weg, `unknown` wird wieder flach eingemischt. */
export function encodeMenuLayout(layout: MenuLayout): string {
  const levels = Object.fromEntries(
    Object.entries(layout)
      .filter(([, level]) => level.image !== undefined || level.points.length > 0)
      .map(([levelId, level]) => [
        levelId,
        {
          ...(level.image === undefined ? {} : { image: level.image }),
          points: level.points.map(({ unknown, ...rest }) => ({ ...unknown, ...rest })),
        },
      ]),
  );
  return encodePayload(JSON.stringify({ levels }));
}

/** Die Ebene mit dieser ID; leer, wenn für sie nichts gespeichert ist. */
export function levelLayout(layout: MenuLayout, levelId: string): MenuLevelLayout {
  return layout[levelId] ?? EMPTY_LEVEL;
}

/** Eine neue Fassung mit ersetzter Ebene; die Vorlage bleibt unverändert. */
export function withLevel(layout: MenuLayout, levelId: string, level: MenuLevelLayout): MenuLayout {
  return { ...layout, [levelId]: level };
}
