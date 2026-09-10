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
 * Der Zugriff auf das Bildfeld des Konfigurationsdialogs.
 *
 * Der Punkte-Editor hängt am Feld `points`, braucht aber auch das Bild — ohne
 * Bild gibt es keine Fläche, auf der Punkte liegen könnten. Beide Felder in
 * einem Fenster zu bedienen heißt, das zweite von Hand zu beschreiben.
 */

import { configFieldSelector, setNativeFieldValue } from "@shared/config-field-injector";

import { HotspotImage, encodeImageAttribute, parseImage } from "../points-model";
import { IMAGE_ATTRIBUTE } from "../configuration-schema";

const imageField = (): HTMLInputElement | HTMLTextAreaElement | null =>
  document.querySelector(configFieldSelector(IMAGE_ATTRIBUTE));

export function readImageAttribute(): HotspotImage | null {
  const field = imageField();
  return field === null ? null : parseImage(field.value);
}

/** Gibt zurück, ob das Feld gefunden wurde. */
export function writeImageAttribute(image: HotspotImage | null): boolean {
  const field = imageField();
  if (field === null) return false;
  // Ein einfaches `field.value = …` bemerkt React nicht: der Setter des
  // Prototyps muss es sein, plus ein `input`-Ereignis.
  setNativeFieldValue(field, encodeImageAttribute(image));
  return true;
}
