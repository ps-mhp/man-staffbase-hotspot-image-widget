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
 * Blendet die einzelnen Felder älterer Fassungen im Staffbase-Dialog aus.
 *
 * Sie bleiben im Schema, damit der Dialog ihre Werte weiter führt — das
 * Fenster übernimmt sie beim ersten Öffnen nach `config`. Zu sehen sollen sie
 * nicht mehr sein: im Content Designer liessen sie sich ohnehin nicht
 * verlässlich bedienen, und zwei Wege zum selben Wert laden zu Widersprüchen ein.
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
 */

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
