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
 * Was der Konfigurationsdialog für den Modus „Menü“ braucht.
 *
 * - Die Startpunkt-Auswahl am Feld `menu-id` — dieselbe Liste wie in der
 *   Navigation.
 * - Der Platzierungs-Editor am Feld `menu-points`.
 * - Je Modus nur die Felder, die dort etwas bedeuten: ein Feld, das nichts
 *   bewirkt, lädt nur dazu ein, es auszufüllen und sich zu wundern.
 */

import * as React from "react";

import { startConditionalFieldVisibility } from "@shared/conditional-field-visibility";
import { startFieldModalInjector } from "@shared/config-modal";
import { startEntityPickerInjector } from "@shared/entity-picker/entity-picker-injector";
import { readMenuId } from "@shared/staffbase/menu";
import { fetchStartPointOptions } from "@shared/staffbase/menu-start-points";

import {
  MANUAL_ATTRIBUTES,
  MENU_ATTRIBUTES,
  MENU_ID_ATTRIBUTE,
  MENU_POINTS_ATTRIBUTE,
  SOURCE_ATTRIBUTE,
} from "./configuration-schema";
import { readConfigValue } from "./editors/config-values";
import { MenuPointEditor } from "./editors/menu-point-editor";
import { imageSource, readImageAttribute } from "./editors/use-image-attribute";
import { MenuLayout, encodeMenuLayout, parseMenuLayout, readSource } from "./menu-points-model";

const START_POINT_LABELS = {
  placeholder: "Startpunkt auswählen …",
  manualOption: "Andere Menü-ID eingeben …",
  unavailableNotice:
    "Das Menü konnte nicht geladen werden. Bitte die Adresse der Seite oder die Menü-ID eintragen.",
};

/** Ob der Dialog gerade im Modus „Menü“ steht. */
export const dialogInMenuMode = (): boolean => readSource(readConfigValue(SOURCE_ATTRIBUTE)) === "menu";

export function startMenuPointEditorInjector(): () => void {
  return startFieldModalInjector<MenuLayout>({
    fieldKey: MENU_POINTS_ATTRIBUTE,
    root: document,
    reopenLabel: "Menüpunkte platzieren …",
    parse: parseMenuLayout,
    serialize: encodeMenuLayout,
    render: (props) => React.createElement(MenuPointEditor, props),
    modalTestId: "menu-point-editor-modal",
    reopenTestId: "menu-point-editor-reopen",
    panelClassName: "max-w-[1080px]",
    openInitially: menuEditorOpensInitially,
  });
}

/**
 * Der Platzierungs-Editor öffnet von selbst nur, wenn es etwas zu platzieren
 * gibt: im Modus „Menü“, mit Startpunkt und — im Content Designer, wo das
 * Formular es liefert — Bild.
 */
export function menuEditorOpensInitially(): boolean {
  return (
    dialogInMenuMode() &&
    readMenuId(readConfigValue(MENU_ID_ATTRIBUTE)) !== null &&
    (imageSource() !== "designer" || readImageAttribute() !== null)
  );
}

/** Blendet je Modus die Felder des anderen aus. */
export function startModeFieldVisibility(root: ParentNode = document): () => void {
  const stops = [
    ...MANUAL_ATTRIBUTES.map((key) =>
      startConditionalFieldVisibility({
        controllingFieldKey: SOURCE_ATTRIBUTE,
        hiddenFieldKey: key,
        shouldHide: (source) => readSource(source) === "menu",
        root,
      }),
    ),
    ...MENU_ATTRIBUTES.map((key) =>
      startConditionalFieldVisibility({
        controllingFieldKey: SOURCE_ATTRIBUTE,
        hiddenFieldKey: key,
        shouldHide: (source) => readSource(source) !== "menu",
        root,
      }),
    ),
  ];
  return () => stops.forEach((stop) => stop());
}

/** Startet alles für den Modus „Menü“; gibt eine Funktion zurück, die es wieder abbaut. */
export function startMenuModeDialog(): () => void {
  const stops = [
    startEntityPickerInjector({
      fieldKey: MENU_ID_ATTRIBUTE,
      fetchOptions: () => fetchStartPointOptions(),
      labels: START_POINT_LABELS,
    }),
    startMenuPointEditorInjector(),
    startModeFieldVisibility(),
  ];
  return () => stops.forEach((stop) => stop());
}
