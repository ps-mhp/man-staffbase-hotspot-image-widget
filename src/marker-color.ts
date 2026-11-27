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
 * Die Farbe der Punkte: eine für alle (`config.color`) und je Punkt eine
 * eigene, die sie überstimmt (Wunsch des Nutzers 27.11.2026). Ohne Angabe
 * gilt MAN-Rot aus dem Stylesheet.
 *
 * Gespeichert als `#rrggbb`; was sich nicht so lesen lässt, gilt als „nicht
 * gesetzt“. Auf die Seite kommt die Farbe als CSS-Variable, nicht als Regel:
 * Punkt, Puls und Nummer der Liste lesen dieselbe `--man-hi-accent`.
 */

import type { CSSProperties } from "react";
import { isLightColor, normalizeHexColor } from "@man/config-ui/toolbar/colors";

/** Schrift auf einem hellen Punkt (etwa Weiss): Anthrazit statt Weiss. */
const INK_ON_LIGHT = "#303c49";
const INK_ON_DARK = "#ffffff";

/** Liest eine gespeicherte Farbe; `undefined`, wenn sie nichts taugt. */
export function readMarkerColor(value: unknown): string | undefined {
  return typeof value === "string" ? (normalizeHexColor(value) ?? undefined) : undefined;
}

/** Die Farbe eines Punkts: seine eigene, sonst die aller Punkte. */
export function effectiveColor(own: string | undefined, global: string | null | undefined): string | undefined {
  return own ?? global ?? undefined;
}

/** Die Schrift auf einer Fläche dieser Farbe. */
export const inkOn = (color: string): string => (isLightColor(color) ? INK_ON_LIGHT : INK_ON_DARK);

/** Fläche und Schrift in einer Farbe, für den Editor; leer ohne Farbe. */
export function fillStyle(color: string | undefined): CSSProperties {
  return color === undefined ? {} : { background: color, color: inkOn(color) };
}

/** Die CSS-Variablen für eine Farbe; leer ohne Farbe, dann gilt das Stylesheet. */
export function markerColorStyle(color: string | null | undefined): CSSProperties {
  if (color === null || color === undefined) return {};
  return {
    ["--man-hi-accent" as string]: color,
    ["--man-hi-on-accent" as string]: inkOn(color),
  } as CSSProperties;
}
