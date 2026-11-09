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
 * Ein Menüpunkt auf dem Bild ist nur Menü-ID und Position. Titel und Ziel
 * kommen bei jedem Aufruf frisch aus dem Menü: umbenannt heißt er sofort
 * anders, und wer den Eintrag nicht sehen darf, sieht auch seinen Punkt nicht.
 *
 * Eigenes Attribut statt `points`: ältere Bundles verwerfen dort jeden Punkt
 * ohne Titel, und ein Wechsel zwischen den Modi soll keine Punkte kosten.
 */

import { encodePayload } from "@shared/payload";
import { isStaffbaseId } from "@shared/staffbase/ids";

import { MAX_POINTS, newPointId, readRaw } from "./points-model";

/** Woher die Punkte kommen: von Hand gesetzt oder aus dem Menü. */
export type PointSource = "manual" | "menu";

/** Was ein Klick auf einen Menüpunkt tut: Seite öffnen oder Eintrag im Menü zeigen. */
export type MenuClickMode = "open" | "reveal";

export interface MenuHotspotPoint {
  /** Stabil über das Verschieben hinweg — React-Key. */
  id: string;
  /** Der Menüeintrag, kleingeschrieben. Je Eintrag höchstens ein Punkt. */
  menuId: string;
  /** Prozent der Bildbreite bzw. -höhe, 0 bis 100. */
  x: number;
  y: number;
  /** Felder einer späteren Version, die diese nicht kennt — siehe `HotspotPoint`. */
  unknown?: Record<string, unknown>;
}

/** Drei Ebenen, den Startknoten mitgezählt: Knoten, Unterpunkte, deren Unterpunkte. */
export const DEFAULT_MENU_DEPTH = 3;

/** Eine Ebene allein wäre nur der Startknoten, ohne Menü daneben. */
export const MIN_MENU_DEPTH = 2;

/** Tiefer blättert niemand, und jede Ebene kostet Anfragen beim Laden der Seite. */
export const MAX_MENU_DEPTH = 6;

const KNOWN_KEYS = new Set(["id", "menuId", "x", "y"]);

/** Alles außer `menu` bedeutet den bisherigen Modus. */
export function readSource(raw: unknown): PointSource {
  return raw === "menu" ? "menu" : "manual";
}

/** Alles außer `reveal` bedeutet „Seite öffnen“. */
export function readMenuClick(raw: unknown): MenuClickMode {
  return raw === "reveal" ? "reveal" : "open";
}

/** Eine ganze Zahl im erlaubten Bereich, sonst die Vorgabe. */
export function readMenuDepth(raw: unknown): number {
  const value = typeof raw === "string" && /^\d+$/.test(raw.trim()) ? Number(raw) : NaN;
  return value >= MIN_MENU_DEPTH && value <= MAX_MENU_DEPTH ? value : DEFAULT_MENU_DEPTH;
}

const inImage = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100;

function readMenuPoint(value: unknown): MenuHotspotPoint | null {
  if (typeof value !== "object" || value === null) return null;
  const raw = value as Record<string, unknown>;
  if (!isStaffbaseId(raw.menuId) || !inImage(raw.x) || !inImage(raw.y)) return null;

  const id = typeof raw.id === "string" && raw.id.trim() !== "" ? raw.id : newPointId();
  const point: MenuHotspotPoint = { id, menuId: raw.menuId.toLowerCase(), x: raw.x, y: raw.y };
  const unknown = Object.fromEntries(Object.entries(raw).filter(([key]) => !KNOWN_KEYS.has(key)));
  return Object.keys(unknown).length > 0 ? { ...point, unknown } : point;
}

/** Liest das Attribut `menu-points`; unbrauchbare und doppelte Einträge fallen still weg. */
export function parseMenuPoints(raw: string): MenuHotspotPoint[] {
  const value = readRaw(raw);
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value
    .map(readMenuPoint)
    .filter((point): point is MenuHotspotPoint => {
      if (point === null || seen.has(point.menuId)) return false;
      seen.add(point.menuId);
      return true;
    })
    .slice(0, MAX_POINTS);
}

/** Schreibt das Attribut `menu-points`; `unknown` wird wieder flach eingemischt. */
export function encodeMenuPointsAttribute(points: readonly MenuHotspotPoint[]): string {
  const plain = points.map(({ unknown, ...rest }) => ({ ...unknown, ...rest }));
  return encodePayload(JSON.stringify(plain));
}
