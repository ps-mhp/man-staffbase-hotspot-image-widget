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
 * Die einzelnen Felder älterer Fassungen im Staffbase-Dialog: lesen und
 * ausblenden.
 *
 * Sie bleiben im Schema, damit der Dialog ihre Werte weiter führt — das
 * Fenster beginnt beim ersten Öffnen mit dem, was sich davon lesen lässt
 * ({@link readLegacyFromDialog}). Zu sehen sollen sie nicht mehr sein: im
 * Content Designer liessen sie sich ohnehin nicht verlässlich bedienen, und
 * zwei Wege zum selben Wert laden zu Widersprüchen ein.
 *
 * Gefunden wird jedes Feld über das, was RJSF und der Content Designer gleich
 * vergeben: `id="root_<key>"` am Eingabeelement oder `for="root_<key>"` an
 * seiner Beschriftung. Der Designer zeigt für `image` einen Upload ohne
 * Eingabefeld, dort trägt nur die Beschriftung die Kennung. Ausgeblendet wird
 * die ganze Zeile: der grösste Vorfahre, der kein anderes Feld enthält.
 *
 * Nur im eigenen Dialog: dem Formular, das das eigene Feld (`config`) führt.
 * Studio lädt alle Widget-Bündel in dasselbe Dokument, und `root_<key>` ist
 * widgetübergreifend — `menu-id` hat auch das Navigation-Widget,
 * `display-mode` das Podcast-Widget. Dokumentweit ausgeblendet, stieg die
 * Zeile dort bis zum ganzen Formular hoch, und deren Dialog blieb leer.
 * Aus demselben Grund wird auch nur dort gelesen.
 */

import { CONFIG_ATTRIBUTE, LEGACY_ATTRIBUTES, configurationSchema } from "./configuration-schema";
import type { LegacyAttributes } from "./hotspot-config";
import { HotspotImage, parseImage } from "./points-model";

const FIELD_MARK = '[id^="root_"], label[for^="root_"]';

const fieldKeyOf = (element: Element): string =>
  element instanceof HTMLLabelElement ? element.htmlFor : element.id;

function rowOf(anchor: Element): HTMLElement {
  const key = fieldKeyOf(anchor);
  let row = anchor as HTMLElement;
  while (row.parentElement !== null && row.parentElement.tagName !== "FORM") {
    const parent = row.parentElement;
    const foreign = Array.from(parent.querySelectorAll(FIELD_MARK)).some((node) => fieldKeyOf(node) !== key);
    if (foreign) break;
    row = parent;
  }
  return row;
}

function anchorOf(root: ParentNode, key: string): Element | null {
  const id = `root_${key}`;
  return root.querySelector(`[id="${id}"]`) ?? root.querySelector(`label[for="${id}"]`);
}

/** Die Formulare, die das eigene Feld führen — nur dort wird ausgeblendet. */
function ownForms(root: ParentNode, ownKey: string): HTMLFormElement[] {
  const id = `root_${ownKey}`;
  const forms = Array.from(root.querySelectorAll(`[id="${id}"]`)).map((field) => field.closest("form"));
  return Array.from(new Set(forms.filter((form): form is HTMLFormElement => form !== null)));
}

/**
 * Hält die Zeilen dieser Felder verborgen, solange der eigene Dialog sie zeigt.
 * @param keys die auszublendenden Felder.
 * @param ownKey das Feld, an dem der eigene Dialog zu erkennen ist.
 * @returns eine Funktion, die aufhört und die Zeilen wieder zeigt.
 */
export function startHiddenFields(
  keys: readonly string[],
  ownKey: string,
  root: ParentNode = document,
): () => void {
  const hidden = new Set<HTMLElement>();

  const apply = (): void => {
    for (const form of ownForms(root, ownKey)) {
      for (const key of keys) {
        const anchor = anchorOf(form, key);
        if (anchor === null) continue;
        const row = rowOf(anchor);
        if (row.style.display !== "none") row.style.display = "none";
        hidden.add(row);
      }
    }
  };

  apply();
  const observer = new MutationObserver(apply);
  const target = root === document ? document.body : (root as Element);
  observer.observe(target, { childList: true, subtree: true });

  return () => {
    observer.disconnect();
    hidden.forEach((row) => {
      row.style.display = "";
    });
    hidden.clear();
  };
}

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

type FormField = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const isFormField = (element: Element | null | undefined): element is FormField =>
  element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement;

/**
 * Das Element, das den Wert eines Feldes trägt. Eine MUI-Auswahl legt die
 * Kennung auf ein `div` und den Wert in ein verstecktes Eingabefeld, das nur
 * den Namen `root_<key>` trägt; dann wird das genommen.
 */
function valueElementOf(form: ParentNode, key: string): FormField | null {
  const element = form.querySelector(`[id="root_${key}"]`);
  if (isFormField(element)) return element;
  const named = form.querySelector(`[name="root_${key}"]`);
  return isFormField(named) ? named : null;
}

interface SchemaOption {
  value: string;
  title: string;
}

/** Die Optionen eines Auswahlfelds in Schema-Reihenfolge; leer für Textfelder. */
function optionsOf(key: string): SchemaOption[] {
  const property = configurationSchema.properties?.[key];
  if (typeof property !== "object" || !Array.isArray(property.oneOf)) return [];
  return property.oneOf.flatMap((option) =>
    typeof option === "object" && typeof option.const === "string"
      ? [{ value: option.const, title: option.title ?? option.const }]
      : [],
  );
}

/**
 * Der Titel der gewählten Option, wie das Feld ihn zeigt: bei einem echten
 * `<select>` der Text der Option, bei einer MUI-Auswahl der Text des
 * Elements mit `root_<key>`. Gilt nur, wenn er genau einem Titel im Schema
 * entspricht.
 */
function optionByTitle(options: SchemaOption[], form: ParentNode, key: string): string | null {
  const shown = form.querySelector(`[id="root_${key}"]`);
  const text =
    shown instanceof HTMLSelectElement
      ? shown.selectedOptions[0]?.textContent
      : shown instanceof HTMLInputElement || shown instanceof HTMLTextAreaElement
        ? null
        : shown?.textContent;
  const match = options.filter((option) => option.title === text?.trim());
  return match.length === 1 ? match[0].value : null;
}

/**
 * Der Wert eines Auswahlfelds. Zuerst über den gezeigten Titel; sonst über
 * den Wert, den RJSF von sich aus als Stelle der Option schreibt („0“,
 * „1“), nicht als ihren Wert. Ist eine Zahl zugleich Wert und Stelle einer
 * anderen Option (bei `menu-depth` etwa „3“), lässt sich nicht entscheiden –
 * dann `null`, und es gilt weiter das alte Feld.
 */
function decodeOption(options: SchemaOption[], form: ParentNode, key: string, element: FormField | null): string | null {
  const byTitle = optionByTitle(options, form, key);
  if (byTitle !== null || element === null) return byTitle;
  const raw = element.value.trim();
  if (raw === "") return null;
  const byIndex = /^\d+$/.test(raw) ? options[Number(raw)]?.value : undefined;
  const isValue = options.some((option) => option.value === raw);
  if (isValue) return byIndex === undefined || byIndex === raw ? raw : null;
  return byIndex ?? null;
}

/** Der Wert eines Feldes, wenn er sicher lesbar ist; sonst `null`. */
function readableValue(form: ParentNode, key: string): string | null {
  const element = valueElementOf(form, key);
  const options = optionsOf(key);
  if (options.length > 0) return decodeOption(options, form, key, element);
  return element === null ? null : element.value;
}

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

/** Das Formular, das das eigene Feld führt; `null` ohne eigenen Dialog. */
function ownForm(root: ParentNode): HTMLFormElement | null {
  return ownForms(root, CONFIG_ATTRIBUTE)[0] ?? null;
}

/**
 * Die alten Felder, wie der eigene Dialog sie gerade führt. Ohne eigenen
 * Dialog ist nichts lesbar.
 */
export function readLegacyFromDialog(root: ParentNode = document): LegacyRead {
  const form = ownForm(root);
  if (form === null) return { attrs: {}, unreadable: [...LEGACY_ATTRIBUTES], previewImage: null };
  const values = LEGACY_ATTRIBUTES.map((key) => [key, readableValue(form, key)] as const);
  return {
    attrs: Object.fromEntries(values.filter(([, value]) => value !== null)),
    unreadable: values.filter(([, value]) => value === null).map(([key]) => key),
    previewImage: previewImageOf(form),
  };
}
