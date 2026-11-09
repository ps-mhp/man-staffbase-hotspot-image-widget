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

import { CONFIG_ATTRIBUTE, POINTS_ATTRIBUTE } from "./configuration-schema";
import { encodeConfig, parseConfig } from "./hotspot-config";
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

/**
 * Dasselbe für `config`, wo die Punkte seit 0.2.0-rc.3 liegen. Übersetzt
 * werden nur die eigenen Punkte des manuellen Modus; im Menü-Modus kommen
 * die Titel schon übersetzt aus dem Menü. Der Provider für `points` bleibt
 * für Inhalte, deren Fenster seither nicht übernommen wurde.
 */
export const hotspotConfigTranslationProvider: TranslationProvider = {
  id: `${HOTSPOT_IMAGE_WIDGET_TAG}/config`,
  label: "Bild mit Punkten",
  ref: { tagName: HOTSPOT_IMAGE_WIDGET_TAG, attribute: CONFIG_ATTRIBUTE },

  toTranslatable: (stored) => {
    const config = stored === null ? null : parseConfig(stored);
    if (config === null || config.manual.points.length === 0) return null;
    return pointsToTranslatable(config.manual.points);
  },

  fromTranslated: (html, stored) => {
    const config = stored === null ? null : parseConfig(stored);
    if (config === null) return null;
    return encodeConfig({
      ...config,
      manual: { ...config.manual, points: pointsFromTranslated(html, config.manual.points) },
    });
  },

  acceptsTranslated: (html) => html.includes("data-point"),
};

