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
  },
};

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
};
