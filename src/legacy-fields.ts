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
 * Was sich beim Öffnen aus den einzelnen Feldern älterer Fassungen im
 * Staffbase-Dialog lesen lässt.
 *
 * Sie bleiben im Schema, damit der Dialog ihre Werte weiter führt — das
 * Fenster beginnt beim ersten Öffnen mit dem, was sich davon lesen lässt
 * ({@link readLegacyFromDialog}). Ausgeblendet werden sie über
 * `@shared/legacy-fields` (`startHiddenFields`), ebenso das Lesen; hier steht
 * nur, was das Hotspot-Widget dazu beiträgt: die strenge Deutung der
 * Auswahlfelder und das Bild aus der Vorschau des Uploads.
 */

import { LegacyFieldSpec, legacyFieldsFromSchema, ownFormsOf, readLegacyFields } from "@shared/legacy-fields";

import { CONFIG_ATTRIBUTE, LEGACY_ATTRIBUTES, configurationSchema } from "./configuration-schema";
import type { LegacyAttributes } from "./hotspot-config";
import { HotspotImage, parseImage } from "./points-model";

type LegacyKey = keyof LegacyAttributes;

/** Was sich beim Öffnen aus den alten Feldern des eigenen Dialogs lesen liess. */
export interface LegacyRead {
  /** Nur die lesbaren Werte. */
  attrs: LegacyAttributes;
  /** Felder, deren Wert nicht sicher zu lesen war: kein Eingabeelement, leer oder mehrdeutig. */
  unreadable: readonly LegacyKey[];
  /**
   * Das Bild aus der Vorschau des Uploads im Content Designer – nur zum
   * Anzeigen im Fenster, wenn `image` selbst nicht lesbar ist.
   */
  previewImage: HotspotImage | null;
}

/**
 * Die Auswahlfelder werden streng gelesen: Der Content Designer schreibt
 * RJSF-typisch die Stelle der Option, und Stelle und Wert können sich
 * überschneiden (Ebenen 2 bis 6). Im Zweifel gilt das Feld als nicht lesbar.
 */
const LEGACY_FIELDS: Record<LegacyKey, LegacyFieldSpec> = legacyFieldsFromSchema(
  LEGACY_ATTRIBUTES,
  configurationSchema,
  Object.fromEntries(LEGACY_ATTRIBUTES.map((key) => [key, { strict: true }])),
);

/**
 * Das Bild im Content Designer: dort ist `image` ein Upload ohne
 * Eingabefeld, nur die Beschriftung verweist auf `root_image`, das Bild
 * steht in seiner Vorschau (live gesehen 29.09.2026).
 */
function previewImageOf(form: ParentNode): HotspotImage | null {
  const row = form.querySelector<HTMLLabelElement>('label[for="root_image"]')?.parentElement;
  const src = row?.querySelector("img")?.getAttribute("src");
  return src ? parseImage(src) : null;
}

/**
 * Die alten Felder, wie der eigene Dialog sie gerade führt: die lesbaren
 * Werte, die Schlüssel der nicht lesbaren und das Vorschaubild. Ohne eigenen
 * Dialog ist alles unlesbar.
 */
export function readLegacyFromDialog(root: ParentNode = document): LegacyRead {
  const { values, unreadable } = readLegacyFields(LEGACY_FIELDS, CONFIG_ATTRIBUTE, root);
  const [form] = ownFormsOf(root, CONFIG_ATTRIBUTE);
  return {
    attrs: values as LegacyAttributes,
    unreadable,
    previewImage: form === undefined ? null : previewImageOf(form),
  };
}
