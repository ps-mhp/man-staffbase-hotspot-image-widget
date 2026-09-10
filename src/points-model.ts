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
 * Was das Widget speichert, und wie es in die Attribute kommt.
 *
 * Frei von DOM und React: die Regeln — was ein gültiger Punkt ist, was beim
 * Lesen verworfen wird — sollen ohne Renderer prüfbar bleiben.
 *
 * Drei Attribute statt eines: `image` und `display-mode` bleiben so im
 * normalen Staffbase-Dialog bedienbar, auch wenn der injizierte Editor
 * einmal nicht greift.
 */

import { decodePayload, encodePayload, isPayload } from "@shared/payload";

export interface HotspotImage {
  url: string;
  alt: string;
  /** Nur bekannt, wenn das Bild aus der Mediathek kam; steuert `aspect-ratio`. */
  width?: number;
  height?: number;
}

/**
 * Woher das Ziel kommt — und damit, wie es geöffnet wird.
 *
 * `page` stammt aus der Seitenliste des Systems und wird im iFrame gezeigt;
 * `url` hat jemand selbst eingetragen und geht in einem neuen Tab auf. Ein
 * fremdes Ziel im iFrame wäre eine Wette auf dessen `X-Frame-Options`, und
 * verloren sähe sie aus wie ein Fehler des Widgets.
 */
export type HotspotLinkKind = "page" | "url";

export interface HotspotLink {
  kind: HotspotLinkKind;
  href: string;
  /** Der Titel der Seite; steht im Kopf des Modals. */
  title?: string;
  /** Die Beschriftung des Buttons; leer heißt {@link DEFAULT_LINK_LABEL}. */
  label?: string;
}

export interface HotspotPoint {
  /** Stabil über das Umsortieren hinweg — React-Key und Ziel der Verweise. */
  id: string;
  /** Prozent der Bildbreite bzw. -höhe, 0 bis 100. Pixel skalieren nicht mit. */
  x: number;
  y: number;
  title: string;
  description?: string;
  link?: HotspotLink;
  /**
   * Alles, was eine spätere Version geschrieben hat und diese nicht kennt.
   * Ohne diesen Beutel löschte eine Redaktion mit älterem Bundle beim ersten
   * Speichern fremde Felder.
   */
  unknown?: Record<string, unknown>;
}

export type DisplayMode = "numbered" | "dots";

const DISPLAY_MODES: readonly DisplayMode[] = ["numbered", "dots"];

/** Die Beschriftung des Buttons, solange niemand eine eigene setzt. */
export const DEFAULT_LINK_LABEL = "Seite öffnen";

/**
 * Mehr Punkte trägt ein Bild nicht: darüber hinaus überdecken die Marker
 * einander, und die Liste wird länger als das Bild hoch ist.
 */
export const MAX_POINTS = 20;

/** Die Felder, die ein Punkt selbst belegt — alles andere ist `unknown`. */
const KNOWN_POINT_KEYS = new Set(["id", "x", "y", "title", "description", "link"]);

/**
 * Erzeugt eine Kennung, die auch dann eindeutig ist, wenn `crypto.randomUUID`
 * fehlt — der Konfigurationsdialog läuft in fremden Seiten, und in einem
 * unsicheren Kontext (http) stellt der Browser die Web-Crypto-API nicht.
 */
export function newPointId(): string {
  const uuid = globalThis.crypto?.randomUUID;
  if (typeof uuid === "function") return uuid.call(globalThis.crypto);
  return `h-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Hält einen Prozentwert im Bild und auf zwei Nachkommastellen. */
export function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(Math.min(100, Math.max(0, value)) * 100) / 100;
}

/** Ein leerer Punkt, wie ihn der Editor beim Klick ins Bild einsetzt. */
export function emptyPoint(x: number, y: number): HotspotPoint {
  return { id: newPointId(), x: clampPercent(x), y: clampPercent(y), title: "" };
}

/** Die Beschriftung, die am Button wirklich erscheint. */
export function linkLabel(link: HotspotLink): string {
  const label = link.label?.trim() ?? "";
  return label === "" ? DEFAULT_LINK_LABEL : label;
}

const asText = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() !== "" ? value : undefined;

/** Der Rohtext eines Attributs, kodiert oder nicht. */
function readRaw(raw: string): unknown {
  if (raw.trim() === "") return null;
  const json = isPayload(raw) ? decodePayload(raw) : raw;
  if (json === null) return null;
  try {
    return JSON.parse(json) as unknown;
  } catch {
    // Ein kaputtes Attribut ist kein Grund, die Seite scheitern zu lassen:
    // die Leseansicht zeigt dann nichts, der Editor beginnt bei null.
    return null;
  }
}

function readLink(value: unknown): HotspotLink | undefined {
  if (typeof value !== "object" || value === null) return undefined;
  const raw = value as Record<string, unknown>;
  const href = asText(raw.href);
  const kind = raw.kind;
  if (href === undefined) return undefined;
  if (kind !== "page" && kind !== "url") return undefined;
  const link: HotspotLink = { kind, href };
  const title = asText(raw.title);
  const label = asText(raw.label);
  if (title !== undefined) link.title = title;
  if (label !== undefined) link.label = label;
  return link;
}

function readPoint(value: unknown): HotspotPoint | null {
  if (typeof value !== "object" || value === null) return null;
  const raw = value as Record<string, unknown>;

  const title = asText(raw.title);
  // Ein Punkt ohne Titel hätte im Popover und in der Liste nichts zu sagen.
  if (title === undefined) return null;

  const { x, y } = raw;
  if (typeof x !== "number" || typeof y !== "number") return null;
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  if (x < 0 || x > 100 || y < 0 || y > 100) return null;

  const point: HotspotPoint = { id: asText(raw.id) ?? newPointId(), x, y, title };

  const description = asText(raw.description);
  if (description !== undefined) point.description = description;

  const link = readLink(raw.link);
  if (link !== undefined) point.link = link;

  const unknown = Object.fromEntries(
    Object.entries(raw).filter(([key]) => !KNOWN_POINT_KEYS.has(key)),
  );
  if (Object.keys(unknown).length > 0) point.unknown = unknown;

  return point;
}

/** Liest das Attribut `points`; unbrauchbare Einträge fallen still weg. */
export function parsePoints(raw: string): HotspotPoint[] {
  const value = readRaw(raw);
  if (!Array.isArray(value)) return [];
  return value
    .map(readPoint)
    .filter((point): point is HotspotPoint => point !== null)
    .slice(0, MAX_POINTS);
}

/** Schreibt das Attribut `points`; `unknown` wird wieder flach eingemischt. */
export function encodePointsAttribute(points: HotspotPoint[]): string {
  const plain = points.map(({ unknown, ...rest }) => ({ ...unknown, ...rest }));
  return encodePayload(JSON.stringify(plain));
}

/** Liest das Attribut `image`; ohne URL gibt es kein Bild. */
export function parseImage(raw: string): HotspotImage | null {
  const value = readRaw(raw);
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const image = value as Record<string, unknown>;
  const url = asText(image.url);
  if (url === undefined) return null;
  const result: HotspotImage = { url, alt: typeof image.alt === "string" ? image.alt : "" };
  if (typeof image.width === "number") result.width = image.width;
  if (typeof image.height === "number") result.height = image.height;
  return result;
}

/** Schreibt das Attribut `image`; ohne Bild bleibt es leer. */
export function encodeImageAttribute(image: HotspotImage | null): string {
  if (image === null) return "";
  return encodePayload(JSON.stringify(image));
}

/** Alles außer den bekannten Modi bedeutet die Vorgabe. */
export function readDisplayMode(raw: unknown): DisplayMode {
  return typeof raw === "string" && (DISPLAY_MODES as readonly string[]).includes(raw)
    ? (raw as DisplayMode)
    : "numbered";
}
