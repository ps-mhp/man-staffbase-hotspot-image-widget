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
 * Ältere Inhalte tragen nur die einzelnen Felder. Solange `config` leer ist,
 * gelten sie ({@link configFromLegacy}); beim ersten Übernehmen im Fenster
 * wandern sie hierher.
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

export const DEFAULT_CONFIG: HotspotConfig = {
  source: "manual",
  image: null,
  manual: { mode: "numbered", points: [] },
  menu: { rootId: null, depth: 3, click: "enter", layout: {} },
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

/** Liest `config`; `null`, wenn dort nichts Brauchbares steht. */
export function parseConfig(raw: string): HotspotConfig | null {
  const value = readRaw(raw);
  if (!isRecord(value)) return null;
  const manual = isRecord(value.manual) ? value.manual : {};
  const menu = isRecord(value.menu) ? value.menu : {};
  return {
    source: readSource(value.source),
    image: readConfigImage(value.image),
    manual: {
      mode: readDisplayMode(manual.mode),
      points: Array.isArray(manual.points) ? parsePoints(asRaw(manual.points)) : [],
    },
    menu: {
      rootId: readMenuId(menu.rootId),
      depth: readMenuDepth(typeof menu.depth === "number" ? String(menu.depth) : menu.depth),
      click: readMenuClick(menu.click),
      layout: isRecord(menu.layout) ? parseMenuLayout(asRaw({ levels: menu.layout })) : {},
    },
  };
}

/** Schreibt `config`, kodiert wie die übrigen Felder; unbekannte Punktfelder werden flach eingemischt. */
export function encodeConfig(config: HotspotConfig): string {
  const plainLayout = Object.fromEntries(
    Object.entries(config.menu.layout)
      .filter(([, level]) => level.image !== undefined || level.points.length > 0)
      .map(([id, level]) => [
        id,
        {
          ...(level.image === undefined ? {} : { image: level.image }),
          points: level.points.map(({ unknown, ...rest }) => ({ ...unknown, ...rest })),
        },
      ]),
  );
  return encodePayload(
    JSON.stringify({
      source: config.source,
      image: config.image,
      manual: {
        mode: config.manual.mode,
        points: config.manual.points.map(({ unknown, ...rest }) => ({ ...unknown, ...rest })),
      },
      menu: { ...config.menu, layout: plainLayout },
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
  };
}

/** Was gilt: `config`, sonst die einzelnen Felder. */
export function resolveConfig(attrs: LegacyAttributes & { config?: string }): HotspotConfig {
  return parseConfig(attrs.config ?? "") ?? configFromLegacy(attrs);
}
