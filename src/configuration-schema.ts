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

import { UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";

export const IMAGE_ATTRIBUTE = "image";
export const IMAGE_ALT_ATTRIBUTE = "image-alt";
export const POINTS_ATTRIBUTE = "points";
export const DISPLAY_MODE_ATTRIBUTE = "display-mode";
/** Modus „Manuell“ oder „Menü“ — siehe `menu-points-model.ts`. */
export const SOURCE_ATTRIBUTE = "source";
export const MENU_ID_ATTRIBUTE = "menu-id";
export const MENU_DEPTH_ATTRIBUTE = "menu-depth";
export const MENU_CLICK_ATTRIBUTE = "menu-click";
export const MENU_POINTS_ATTRIBUTE = "menu-points";

/** Die Felder, die nur im Modus „Manuell“ etwas bedeuten. */
export const MANUAL_ATTRIBUTES = [POINTS_ATTRIBUTE, DISPLAY_MODE_ATTRIBUTE] as const;

/** Die Felder, die nur im Modus „Menü“ etwas bedeuten. */
export const MENU_ATTRIBUTES = [
  MENU_ID_ATTRIBUTE,
  MENU_DEPTH_ATTRIBUTE,
  MENU_CLICK_ATTRIBUTE,
  MENU_POINTS_ATTRIBUTE,
] as const;

/**
 * Das Schema des Konfigurationsdialogs.
 *
 * `image` und `points` stehen als gewöhnliche Textfelder, obwohl sie niemand
 * von Hand ausfüllen soll: Staffbase rendert den Dialog selbst und kennt nur
 * die Feldtypen von RJSF. Der Punkte-Editor tritt zur Laufzeit an die Stelle
 * von `points` (`point-editor-injector.ts`). Fällt er aus, bleiben die
 * Textfelder sichtbar und die Konfiguration damit reparierbar statt
 * unerreichbar.
 *
 * Der Content Designer behandelt den Schlüssel `image` eigens: er zeigt statt
 * des Textfelds seinen eigenen Bild-Upload und speichert nur die Adresse. Der
 * Alternativtext hat deshalb ein eigenes Feld, `image-alt` — im JSON des
 * klassischen Editors steht er nur noch bei älteren Inhalten. Der Anzeigemodus bleibt aus demselben Grund ein echtes
 * Auswahlfeld des Dialogs.
 *
 * Im Modus „Menü“ gilt dasselbe für `menu-points`: der Platzierungs-Editor
 * tritt an die Stelle des Textfelds. Welche Felder je Modus zu sehen sind,
 * regelt `index.tsx` über `startConditionalFieldVisibility`.
 *
 * @see https://rjsf-team.github.io/react-jsonschema-form/docs/
 */
export const configurationSchema: JSONSchema7 = {
  properties: {
    [IMAGE_ATTRIBUTE]: {
      type: "string",
      title: "Bild",
      default: "",
    },
    [IMAGE_ALT_ATTRIBUTE]: {
      type: "string",
      title: "Alternativtext",
      default: "",
    },
    [SOURCE_ATTRIBUTE]: {
      type: "string",
      title: "Modus",
      default: "manual",
      oneOf: [
        { const: "manual", title: "Manuell: eigene Punkte mit Titel, Text und Link" },
        { const: "menu", title: "Menü: Menüpunkte auf dem Bild platzieren" },
      ],
    },
    [POINTS_ATTRIBUTE]: {
      type: "string",
      title: "Punkte",
      default: "[]",
    },
    [DISPLAY_MODE_ATTRIBUTE]: {
      type: "string",
      title: "Darstellung",
      default: "numbered",
      oneOf: [
        { const: "numbered", title: "Nummeriert, mit Liste neben dem Bild" },
        { const: "dots", title: "Punkte, ohne Liste" },
      ],
    },
    [MENU_ID_ATTRIBUTE]: {
      type: "string",
      title: "Startpunkt im Menü",
      default: "",
    },
    [MENU_DEPTH_ATTRIBUTE]: {
      type: "string",
      title: "Ebenen",
      default: "3",
      oneOf: [
        { const: "2", title: "2 — Startpunkt und Unterpunkte" },
        { const: "3", title: "3 — dazu deren Unterpunkte" },
        { const: "4", title: "4 Ebenen" },
        { const: "5", title: "5 Ebenen" },
        { const: "6", title: "6 Ebenen" },
      ],
    },
    [MENU_CLICK_ATTRIBUTE]: {
      type: "string",
      title: "Klick auf einen Punkt mit Unterpunkten",
      default: "enter",
      oneOf: [
        { const: "enter", title: "Ins Untermenü wechseln" },
        { const: "open", title: "Seite öffnen" },
      ],
    },
    [MENU_POINTS_ATTRIBUTE]: {
      type: "string",
      title: "Menüpunkte auf dem Bild",
      default: "",
    },
  },
};

/** Alle Attribute, in der Reihenfolge des Schemas. */
export const ALL_ATTRIBUTES: string[] = Object.keys(configurationSchema.properties ?? {});

/**
 * @see https://rjsf-team.github.io/react-jsonschema-form/docs/api-reference/uiSchema
 */
export const uiSchema: UiSchema = {
  [IMAGE_ATTRIBUTE]: {
    "ui:help":
      "Das Bild, auf dem die Punkte liegen. Im Content Designer wird es hier gewählt; " +
      "im klassischen Editor wählt es der Punkte-Editor, das Textfeld ist dort nur die Rohfassung.",
  },
  [IMAGE_ALT_ATTRIBUTE]: {
    "ui:help":
      "Beschreibt das Bild für Screenreader. Leer lassen, wenn es nur schmückt. " +
      "Lässt sich auch im Punkte-Editor bearbeiten.",
  },
  [SOURCE_ATTRIBUTE]: {
    "ui:help":
      "„Manuell“: jeder Punkt hat einen eigenen Titel, Text und Link. " +
      "„Menü“: die Unterpunkte eines Menüpunkts werden auf dem Bild platziert, je Menüebene mit " +
      "eigenem Bild; daneben steht das Menü zum Blättern. Die Punkte des anderen Modus bleiben erhalten.",
  },
  [POINTS_ATTRIBUTE]: {
    "ui:help":
      "Die Punkte auf dem Bild. Der Editor öffnet sich von selbst; " +
      "das Textfeld dahinter ist die Rohfassung.",
  },
  [DISPLAY_MODE_ATTRIBUTE]: {
    "ui:help":
      "„Nummeriert“ zeigt neben dem Bild eine aufklappbare Liste der Punkte — " +
      "gut für viele Punkte und für Lesende, die lieber lesen als suchen. " +
      "„Punkte“ zeigt nur die Marker; der Text erscheint erst beim Anklicken.",
  },
  [MENU_ID_ATTRIBUTE]: {
    "ui:help":
      "Der Menüpunkt, dessen Unterpunkte auf dem Bild platziert werden. Fehlt er in der Liste, „Andere Menü-ID eingeben …“ wählen und die Adresse der Seite einfügen.",
  },
  [MENU_DEPTH_ATTRIBUTE]: {
    "ui:help": "Wie viele Ebenen unter dem Startpunkt erscheinen, den Startpunkt mitgezählt.",
  },
  [MENU_CLICK_ATTRIBUTE]: {
    "ui:help":
      "„Ins Untermenü wechseln“ zeigt die Unterpunkte im Menü daneben und das Bild dieser Ebene. " +
      "„Seite öffnen“ führt direkt zur Seite des Menüpunkts. Punkte ohne Unterpunkte öffnen immer ihre Seite.",
  },
  [MENU_POINTS_ATTRIBUTE]: {
    "ui:help":
      "Je Menüebene ein Bild und die Punkte ihrer Unterpunkte. Der Editor öffnet sich über " +
      "„Menüpunkte platzieren …“; das Textfeld dahinter ist die Rohfassung.",
  },
};
