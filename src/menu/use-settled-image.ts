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
 * Damit der Wechsel zwischen den Bildern der Menüebenen nicht blitzt.
 *
 * Ein neues Bild, das erst nach dem Klick zu laden beginnt, zeigte für einen
 * Augenblick eine leere Fläche und erschiene dann schlagartig — im Studio am
 * 09.11.2026 als „epileptischer Schock“ beschrieben. Deshalb bleibt das alte
 * Bild stehen, bis das neue dekodiert ist; erst dann wird getauscht und
 * übergeblendet (`menu-hotspot-image.tsx`, `menu-mode.scss`). Vorgeladen wird
 * ohnehin alles, sobald das Widget steht — dann ist das Warten meist null.
 */

import { useEffect, useState } from "react";

import { ImageLevel } from "./menu-levels";

/** Lädt die Bilder im Hintergrund, damit der spätere Wechsel aus dem Cache kommt. */
export function prefetchImages(urls: readonly string[]): void {
  for (const url of new Set(urls)) {
    const img = new Image();
    img.src = url;
  }
}

/** Wartet, bis das Bild dekodiert ist — oder scheitert; beides heisst „weiter“. */
function whenDecoded(url: string): Promise<void> {
  const img = new Image();
  img.src = url;
  return typeof img.decode === "function" ? img.decode().catch(() => undefined) : Promise.resolve();
}

/**
 * Das Bild, das gerade gezeigt werden soll: sofort beim ersten Mal und wenn
 * nur die Ebene wechselt, sonst erst, wenn das neue Bild bereit ist.
 */
export function useSettledImageLevel(target: ImageLevel | null): ImageLevel | null {
  const [settled, setSettled] = useState<ImageLevel | null>(target);
  const sameImage = settled !== null && target !== null && settled.image.url === target.image.url;

  // Gleiches Bild, andere Ebene: nichts zu laden, also gleich im Rendern übernehmen.
  if (sameImage && settled.levelId !== target.levelId) setSettled(target);
  if (target === null && settled !== null) setSettled(null);

  useEffect(() => {
    if (target === null || sameImage) return;
    let current = true;
    void whenDecoded(target.image.url).then(() => {
      if (current) setSettled(target);
    });
    return () => {
      current = false;
    };
    // Nur bei neuem Ziel neu laden — Ebene und Adresse bestimmen es ganz;
    // `settled` gehört bewusst nicht dazu.
  }, [target?.levelId, target?.image.url]);

  return settled;
}
