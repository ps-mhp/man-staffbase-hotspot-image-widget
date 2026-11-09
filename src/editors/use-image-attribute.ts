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
 * Das Bild älterer Fassungen aus dem Feld `image` des Dialogs lesen.
 *
 * Seit 0.2.0-rc.3 steht das Bild in `config`. Ist das noch leer, übernimmt
 * das Fenster das Bild von hier (`hotspot-dialog.ts`). Geschrieben wird
 * nicht mehr in dieses Feld.
 *
 * Zwei Formen: Im klassischen Editor rendert RJSF `image` als Textfeld mit
 * dem Bild-JSON. Der Content Designer setzt an seine Stelle einen eigenen
 * Bild-Upload ohne Eingabefeld — nur die Beschriftung verweist auf
 * `root_image`, das Bild steht in der Vorschau (live gesehen 29.09.2026).
 */

import { configFieldSelector } from "@shared/config-field-injector";

import { IMAGE_ATTRIBUTE } from "../configuration-schema";
import { HotspotImage, parseImage } from "../points-model";

const imageField = (): HTMLInputElement | HTMLTextAreaElement | null =>
  document.querySelector(configFieldSelector(IMAGE_ATTRIBUTE));

/** Die Zeile des Designers, die zum Feld `image` gehört. */
const designerImageRow = (): HTMLElement | null =>
  document.querySelector<HTMLLabelElement>(`label[for="root_${IMAGE_ATTRIBUTE}"]`)?.parentElement ?? null;

export function readImageAttribute(): HotspotImage | null {
  const field = imageField();
  if (field !== null) return parseImage(field.value);
  const src = designerImageRow()?.querySelector("img")?.getAttribute("src");
  return src ? { url: src, alt: "" } : null;
}
