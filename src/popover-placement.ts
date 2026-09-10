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
 * Wo das Popover zum Punkt steht.
 *
 * Reine Rechnung, ohne DOM: die Maße kommen von außen, damit die Randfälle —
 * unten kein Platz, seitlich über die Kante — ohne Layout prüfbar sind. Der
 * Browser misst in `hotspot-popover.tsx`.
 */

export interface PlacementInput {
  /** Der Punkt in Prozent der Bühne. */
  point: { x: number; y: number };
  /** Die Maße der Bühne in Pixeln. */
  stage: { width: number; height: number };
  /** Die Maße des Popovers in Pixeln. */
  popover: { width: number; height: number };
  /** Abstand zwischen Marker und Popover; Vorgabe 14. */
  gap?: number;
}

export interface Placement {
  left: number;
  top: number;
  side: "top" | "bottom";
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), Math.max(min, max));

export function placePopover({ point, stage, popover, gap = 14 }: PlacementInput): Placement {
  const anchorX = (stage.width * point.x) / 100;
  const anchorY = (stage.height * point.y) / 100;

  // Unter dem Punkt ist die Regel; nach oben wird nur gekippt, wenn das
  // Popover sonst unten aus der Bühne liefe.
  const fitsBelow = anchorY + gap + popover.height <= stage.height;
  const side = fitsBelow ? "bottom" : "top";
  const top = fitsBelow ? anchorY + gap : Math.max(anchorY - gap - popover.height, 0);

  const left = clamp(anchorX - popover.width / 2, 0, stage.width - popover.width);

  return { left, top, side };
}
