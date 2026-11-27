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
 * Die ganze Konfiguration des Widgets in einem Attribut: `config`.
 *
 * Bis 0.2.0-rc.2 lag sie verteilt auf neun Felder des Staffbase-Dialogs. Im
 * Content Designer liess sich das nicht bedienen: seine Auswahlfelder sind
 * keine echten `<select>`, ihr Wert war von aussen nicht zu lesen, und das
 * Bildfeld ist ein eigener Upload ohne Eingabefeld (live gesehen 09.11.2026).
 * Seither pflegt ein einziges Fenster alles und schreibt es hierher.
 *
 * Gemischt wird je Schlüssel ({@link CONFIG_KEYS}): was in `config` steht,
 * gilt; was dort fehlt, kommt aus dem alten Feld; fehlt auch das, gilt die
 * Vorgabe. Ältere Inhalte tragen nur die einzelnen Felder und erscheinen
 * deshalb unverändert. Das Fenster lässt einen Schlüssel weg, solange es den
 * alten Wert nicht lesen konnte und niemand ihn geändert hat
 * (`hotspot-draft.ts`) – dann gilt dafür weiter das alte Feld.
 *
 * „Steht in `config`“ heisst: der Schlüssel ist da, auch mit `null`. Ein
 * entferntes Bild ist `"image": null` und darf nicht vom alten Feld
 * überstimmt werden.
 */

import { encodePayload } from "@shared/payload";
import { readMenuId } from "@shared/staffbase/menu";

import {
  MenuClickMode,
  MenuLayout,
  PointSource,
  parseMenuLayout,
  readMenuClick,
  readMenuDepth,
  readSource,
} from "./menu-points-model";
import { readMarkerColor } from "./marker-color";
import {
  DisplayMode,
  HotspotImage,
  HotspotPoint,
  parsePoints,
  readDisplayMode,
  readImage,
  readRaw,
} from "./points-model";

export interface HotspotConfig {
  source: PointSource;
  /** Das Bild im manuellen Modus und das der Startebene im Menü-Modus, mit Alternativtext. */
  image: HotspotImage | null;
  manual: { mode: DisplayMode; points: HotspotPoint[] };
  menu: { rootId: string | null; depth: number; click: MenuClickMode; layout: MenuLayout };
  /** Die Farbe aller Punkte (`#rrggbb`); `null` heisst MAN-Rot. Ein Punkt kann sie überstimmen. */
  color: string | null;
}

/** Die einzelnen Attribute bis 0.2.0-rc.2, so wie sie am Element ankommen. */
export interface LegacyAttributes {
  image?: string;
  "image-alt"?: string;
  points?: string;
  "display-mode"?: string;
  source?: string;
  "menu-id"?: string;
  "menu-depth"?: string;
  "menu-click"?: string;
  "menu-points"?: string;
}

/**
 * Die Schlüssel, nach denen gemischt wird – je einer pro altem Feld (das Bild
 * nimmt `image` und `image-alt` zusammen).
 */
export const CONFIG_KEYS = [
  "source",
  "image",
  "manual.mode",
  "manual.points",
  "menu.rootId",
  "menu.depth",
  "menu.click",
  "menu.layout",
  "color",
] as const;

export type ConfigKey = (typeof CONFIG_KEYS)[number];

/** Das alte Feld (oder die Felder) hinter jedem Schlüssel. */
export const LEGACY_FIELDS_OF: Readonly<Record<ConfigKey, readonly (keyof LegacyAttributes)[]>> = {
  source: ["source"],
  image: ["image", "image-alt"],
  "manual.mode": ["display-mode"],
  "manual.points": ["points"],
  "menu.rootId": ["menu-id"],
  "menu.depth": ["menu-depth"],
  "menu.click": ["menu-click"],
  "menu.layout": ["menu-points"],
  // Neu am 27.11.2026, ohne Feld im alten Dialog.
  color: [],
};

/** Die Werte, die `config` trägt – nur die Schlüssel, die dort stehen. */
export interface ConfigParts {
  source?: PointSource;
  image?: HotspotImage | null;
  "manual.mode"?: DisplayMode;
  "manual.points"?: HotspotPoint[];
  "menu.rootId"?: string | null;
  "menu.depth"?: number;
  "menu.click"?: MenuClickMode;
  "menu.layout"?: MenuLayout;
  color?: string | null;
}

export const DEFAULT_CONFIG: HotspotConfig = {
  source: "manual",
  image: null,
  manual: { mode: "numbered", points: [] },
  menu: { rootId: null, depth: 3, click: "enter", layout: {} },
  color: null,
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Nur http(s) und Pfade der eigenen Instanz — eine `javascript:`-Adresse soll nicht als `src` enden. */
const SAFE_IMAGE_URL = /^(https?:\/\/|\/)\S+$/i;

function readConfigImage(value: unknown): HotspotImage | null {
  if (!isRecord(value)) return null;
  const image = readImage(asRaw(value), undefined);
  return image !== null && SAFE_IMAGE_URL.test(image.url.trim()) ? image : null;
}

/** Ein Teil des JSON als Zeichenkette, damit die Leser der einzelnen Felder ihn nehmen. */
const asRaw = (value: unknown): string => (value === undefined ? "" : JSON.stringify(value));

const has = (record: Record<string, unknown>, key: string): boolean => Object.prototype.hasOwnProperty.call(record, key);

/** Liest einen Teil nur, wenn sein Schlüssel im JSON steht. */
function part<T>(record: Record<string, unknown>, key: string, read: (value: unknown) => T): T | undefined {
  return has(record, key) ? read(record[key]) : undefined;
}

/** Ohne `undefined`-Einträge: „steht nicht da“ soll auch im Objekt nicht dastehen. */
function compact(parts: ConfigParts): ConfigParts {
  return Object.fromEntries(Object.entries(parts).filter(([, value]) => value !== undefined)) as ConfigParts;
}

/**
 * Liest `config` je Schlüssel; `null`, wenn dort nichts Brauchbares steht.
 * Ein Schlüssel mit unbrauchbarem Wert steht da und gilt mit seiner Vorgabe –
 * wie bisher, als `config` immer ganz galt.
 */
export function parseConfigParts(raw: string): ConfigParts | null {
  const value = readRaw(raw);
  if (!isRecord(value)) return null;
  const manual = isRecord(value.manual) ? value.manual : {};
  const menu = isRecord(value.menu) ? value.menu : {};
  return compact({
    source: part(value, "source", readSource),
    image: part(value, "image", readConfigImage),
    "manual.mode": part(manual, "mode", readDisplayMode),
    "manual.points": part(manual, "points", (points) => (Array.isArray(points) ? parsePoints(asRaw(points)) : [])),
    "menu.rootId": part(menu, "rootId", readMenuId),
    "menu.depth": part(menu, "depth", (depth) => readMenuDepth(typeof depth === "number" ? String(depth) : depth)),
    "menu.click": part(menu, "click", readMenuClick),
    "menu.layout": part(menu, "layout", (layout) =>
      isRecord(layout) ? parseMenuLayout(asRaw({ levels: layout })) : {},
    ),
    color: part(value, "color", (color) => readMarkerColor(color) ?? null),
  });
}

/** Je Schlüssel: der Teil aus `config`, sonst der Wert aus `base`. */
export function mergeParts(parts: ConfigParts, base: HotspotConfig): HotspotConfig {
  return {
    source: parts.source ?? base.source,
    image: parts.image === undefined ? base.image : parts.image,
    manual: {
      mode: parts["manual.mode"] ?? base.manual.mode,
      points: parts["manual.points"] ?? base.manual.points,
    },
    menu: {
      rootId: parts["menu.rootId"] === undefined ? base.menu.rootId : parts["menu.rootId"],
      depth: parts["menu.depth"] ?? base.menu.depth,
      click: parts["menu.click"] ?? base.menu.click,
      layout: parts["menu.layout"] ?? base.menu.layout,
    },
    color: parts.color === undefined ? base.color : parts.color,
  };
}

/** Die Schlüssel, die in `config` nicht stehen – für sie gilt beim Lesen das alte Feld. */
export function missingKeys(parts: ConfigParts): ConfigKey[] {
  return CONFIG_KEYS.filter((key) => parts[key] === undefined);
}

/** Liest `config` vollständig, Fehlendes mit den Vorgaben; `null`, wenn dort nichts Brauchbares steht. */
export function parseConfig(raw: string): HotspotConfig | null {
  const parts = parseConfigParts(raw);
  return parts === null ? null : mergeParts(parts, DEFAULT_CONFIG);
}

const plainPoints = <T extends { unknown?: Record<string, unknown> }>(points: readonly T[]) =>
  points.map(({ unknown, ...rest }) => ({ ...unknown, ...rest }));

function plainLayout(layout: MenuLayout): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(layout)
      .filter(([, level]) => level.image !== undefined || level.points.length > 0)
      .map(([id, level]) => [
        id,
        { ...(level.image === undefined ? {} : { image: level.image }), points: plainPoints(level.points) },
      ]),
  );
}

/** Die Einträge eines Teilobjekts ohne die weggelassenen Schlüssel; `undefined`, wenn nichts bleibt. */
function section(
  prefix: "manual" | "menu",
  entries: Record<string, unknown>,
  omit: ReadonlySet<ConfigKey>,
): Record<string, unknown> | undefined {
  const kept = Object.entries(entries).filter(([key]) => !omit.has(`${prefix}.${key}` as ConfigKey));
  return kept.length === 0 ? undefined : Object.fromEntries(kept);
}

/**
 * Schreibt `config`, kodiert wie die übrigen Felder; unbekannte Punktfelder
 * werden flach eingemischt. `omit` lässt Schlüssel weg – für sie gilt beim
 * Lesen weiter das alte Feld.
 */
export function encodeConfig(config: HotspotConfig, omit: readonly ConfigKey[] = []): string {
  const skip = new Set(omit);
  const manual = section("manual", { mode: config.manual.mode, points: plainPoints(config.manual.points) }, skip);
  const menu = section(
    "menu",
    {
      rootId: config.menu.rootId,
      depth: config.menu.depth,
      click: config.menu.click,
      layout: plainLayout(config.menu.layout),
    },
    skip,
  );
  return encodePayload(
    JSON.stringify({
      ...(skip.has("source") ? {} : { source: config.source }),
      ...(skip.has("image") ? {} : { image: config.image }),
      ...(manual === undefined ? {} : { manual }),
      ...(menu === undefined ? {} : { menu }),
      // Nur gesetzt: ohne Farbe bleibt `config` wie bisher.
      ...(skip.has("color") || config.color === null ? {} : { color: config.color }),
    }),
  );
}

/** Die Konfiguration aus den einzelnen Feldern älterer Fassungen. */
export function configFromLegacy(attrs: LegacyAttributes): HotspotConfig {
  return {
    source: readSource(attrs.source),
    image: readImage(attrs.image ?? "", attrs["image-alt"]),
    manual: { mode: readDisplayMode(attrs["display-mode"]), points: parsePoints(attrs.points ?? "") },
    menu: {
      rootId: readMenuId(attrs["menu-id"]),
      depth: readMenuDepth(attrs["menu-depth"]),
      click: readMenuClick(attrs["menu-click"]),
      layout: parseMenuLayout(attrs["menu-points"] ?? ""),
    },
    color: null,
  };
}

/** Was gilt: je Schlüssel `config`, sonst das alte Feld, sonst die Vorgabe. */
export function resolveConfig(attrs: LegacyAttributes & { config?: string }): HotspotConfig {
  const legacy = configFromLegacy(attrs);
  const parts = parseConfigParts(attrs.config ?? "");
  return parts === null ? legacy : mergeParts(parts, legacy);
}
