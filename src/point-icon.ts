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
 * Ein eigenes Bild für einen Punkt, das an Stelle des roten Punkts steht.
 *
 * Gilt in beiden Modi. Die Grösse ist fest in Pixeln (S/M/L, Vorgabe des
 * Nutzers 09.11.2026), nicht relativ zum Bild: ein Symbol soll auf dem
 * Telefon so gut zu treffen sein wie am Bildschirm. Ein Alternativtext fehlt
 * bewusst — der Punkt trägt seinen Titel als `aria-label`, das Bild ist Zier.
 */

export type IconSize = "s" | "m" | "l";

/**
 * Die Fläche hinter dem Bild, rund wie der Punkt (Wunsch des Nutzers
 * 09.11.2026). Fehlt sie, steht das Bild frei — „transparent“.
 */
export type IconBackground = "white" | "red" | "dark" | "light";

export interface PointIcon {
  url: string;
  size: IconSize;
  background?: IconBackground;
}

export const ICON_BACKGROUNDS: readonly IconBackground[] = ["white", "red", "dark", "light"];

/** Kantenlänge des Kastens, in den das Bild proportional eingepasst wird. */
export const ICON_SIZES: Readonly<Record<IconSize, number>> = { s: 32, m: 48, l: 72 };

export const DEFAULT_ICON_SIZE: IconSize = "m";

/** Nur http(s) und Pfade der eigenen Instanz — eine `javascript:`-Adresse soll nicht als `src` enden. */
const SAFE_URL = /^(https?:\/\/|\/)\S+$/i;

const isIconSize = (value: unknown): value is IconSize => value === "s" || value === "m" || value === "l";

/** Liest ein gespeichertes Punktbild; `undefined`, wenn es nichts taugt. */
export function readPointIcon(value: unknown): PointIcon | undefined {
  if (typeof value !== "object" || value === null) return undefined;
  const raw = value as Record<string, unknown>;
  const url = typeof raw.url === "string" ? raw.url.trim() : "";
  if (!SAFE_URL.test(url)) return undefined;
  const size = isIconSize(raw.size) ? raw.size : DEFAULT_ICON_SIZE;
  const background = ICON_BACKGROUNDS.find((candidate) => candidate === raw.background);
  return background === undefined ? { url, size } : { url, size, background };
}
