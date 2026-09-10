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
 * Wie die Punkte dieses Widgets durch Staffbases Inhaltsübersetzung reisen.
 *
 * Die Punkte liegen im Attribut `points`, weil ein Attribut die einzige
 * Ablage ist, die das Widget-SDK anbietet — und `POST /api/translations`
 * übersetzt Textknoten und lässt Attribute unangetastet. Die geteilte
 * Registry schickt den Text deshalb als eigene Anfrage neben der des Editors
 * los und schreibt das Ergebnis ins Attribut zurück, bevor der Editor die
 * Antwort überhaupt sieht.
 */

import { TranslationProvider } from "@shared/translation/carriers";

import { POINTS_ATTRIBUTE } from "./configuration-schema";
import { encodePointsAttribute, parsePoints } from "./points-model";
import { pointsFromTranslated, pointsToTranslatable } from "./translation-payload";

/** Muss dem Tag entsprechen, unter dem `index.tsx` das Widget anmeldet. */
export const HOTSPOT_IMAGE_WIDGET_TAG = "hotspot-image-widget";

export const hotspotTranslationProvider: TranslationProvider = {
  id: `${HOTSPOT_IMAGE_WIDGET_TAG}/points`,
  label: "Bild mit Punkten",
  ref: { tagName: HOTSPOT_IMAGE_WIDGET_TAG, attribute: POINTS_ATTRIBUTE },

  // `stored` ist `string | null`: das Attribut kann ganz fehlen. `null`
  // zurückzugeben heißt „hier gibt es nichts zu übersetzen“ — die Alternative
  // wäre, ein leeres Dokument durch die Übersetzung zu schicken.
  toTranslatable: (stored) => {
    if (stored === null) return null;
    const points = parsePoints(stored);
    return points.length === 0 ? null : pointsToTranslatable(points);
  },

  fromTranslated: (html, stored) => {
    if (stored === null) return null;
    return encodePointsAttribute(pointsFromTranslated(html, parsePoints(stored)));
  },

  acceptsTranslated: (html) => html.includes("data-point"),
};
