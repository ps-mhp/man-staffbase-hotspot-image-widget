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
 * Ob die Leseansicht schmal steht – nach ihrer eigenen Breite, nicht nach der
 * des Fensters.
 *
 * Die Frage lässt sich nicht ganz in CSS erledigen: in schmaler Breite wird
 * das Popover nicht nur anders gesetzt, es wird auch nicht mehr gemessen und
 * bekommt eine Abdunklung dahinter. Das ist eine Entscheidung im Code.
 *
 * Früher fragte sie das Fenster (`matchMedia`). In der Vorschau des
 * Config-Modals steht die Leseansicht aber in einem Rahmen mit Gerätebreite,
 * nicht in einem eigenen Fenster – „Mobil“ zeigte dort die breite
 * Darstellung. Gemessen wird deshalb das eigene Element, so wie das
 * Stylesheet per `@container man-hi` die eigene Breite fragt.
 */

import { useLayoutEffect, useState } from "react";

/**
 * Unter dieser eigenen Breite gilt „schmal“; deckungsgleich mit
 * `$narrow-below` in `styles/_narrow.scss`.
 *
 * 600 statt der früheren 768 Fensterbreite: die Leseansicht ist schmaler als
 * das Fenster. So bleibt es auf den Geräten wie bisher – Telefon (eigene
 * Breite um 350) schmal, Tablet hochkant (um 700) und Desktop breit –, und
 * die Vorschau zeigt dasselbe: Mobil 390 − 48 Rand = 342 schmal, Tablet
 * 768 − 48 = 720 breit.
 */
export const NARROW_BELOW_PX = 600;

/**
 * Misst das Element, an das die zurückgegebene Ref-Funktion gehängt wird.
 * Ohne Messung (kein `ResizeObserver`, Breite 0) gilt „breit“ – wie zuvor
 * ohne `matchMedia`.
 * @returns die Ref-Funktion für das gemessene Element und ob es schmal ist.
 */
export function useNarrowWidth(): [(element: HTMLElement | null) => void, boolean] {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [narrow, setNarrow] = useState(false);

  useLayoutEffect(() => {
    if (element === null || typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry?.contentRect.width ?? 0;
      setNarrow(width > 0 && width < NARROW_BELOW_PX);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return [setElement, narrow];
}
