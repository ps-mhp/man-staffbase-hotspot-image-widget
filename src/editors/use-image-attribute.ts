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
import { IMAGE_ALT_ATTRIBUTE, IMAGE_ATTRIBUTE } from "../configuration-schema";

/**
 * Wer das Bild im Dialog führt.
 *
 * - `field`: der klassische Editor. RJSF rendert `image` als Textfeld, und der
 *   Punkte-Editor wählt das Bild selbst und schreibt es hinein.
 * - `designer`: der Content Designer. Er erkennt den Schlüssel `image` und
 *   setzt an seine Stelle einen eigenen Bild-Upload mit Vorschaukarte — ohne
 *   Eingabefeld, nur die Beschriftung verweist noch auf `root_image`. Das Bild
 *   wählt dort Staffbase; der Editor kann es nur lesen. Live gesehen am
 *   29.09.2026 in `/studio/content/page/…/edit`.
 */
export type ImageSource = "field" | "designer";

const imageField = (): HTMLInputElement | HTMLTextAreaElement | null =>
  document.querySelector(configFieldSelector(IMAGE_ATTRIBUTE));

const altField = (): HTMLInputElement | HTMLTextAreaElement | null =>
  document.querySelector(configFieldSelector(IMAGE_ALT_ATTRIBUTE));

/** Die Zeile des Designers, die zum Feld `image` gehört. */
const designerImageRow = (): HTMLElement | null =>
  document.querySelector<HTMLLabelElement>(`label[for="root_${IMAGE_ATTRIBUTE}"]`)?.parentElement ?? null;

export function imageSource(): ImageSource | null {
  if (imageField() !== null) return "field";
  if (designerImageRow() !== null) return "designer";
  return null;
}

export function readImageAttribute(): HotspotImage | null {
  const field = imageField();
  if (field !== null) return parseImage(field.value);

  // Die Vorschau des Uploads ist das Einzige, was der Designer vom Bild zeigt.
  const src = designerImageRow()?.querySelector("img")?.getAttribute("src");
  return src ? { url: src, alt: "" } : null;
}

/** Gibt zurück, ob das Feld gefunden wurde. Im Designer nie. */
export function writeImageAttribute(image: HotspotImage | null): boolean {
  const field = imageField();
  if (field === null) return false;
  // Ein einfaches `field.value = …` bemerkt React nicht: der Setter des
  // Prototyps muss es sein, plus ein `input`-Ereignis.
  setNativeFieldValue(field, encodeImageAttribute(image));
  return true;
}

/** Der Alternativtext aus seinem eigenen Feld; null, wenn es fehlt. */
export function readImageAlt(): string | null {
  return altField()?.value ?? null;
}

/** Gibt zurück, ob das Feld gefunden wurde. */
export function writeImageAlt(alt: string): boolean {
  const field = altField();
  if (field === null) return false;
  setNativeFieldValue(field, alt);
  return true;
}
