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
 * Setzt den Punkte-Editor an die Stelle des Feldes `points`.
 *
 * Staffbase baut den Konfigurationsdialog selbst und kennt nur die Feldtypen
 * von RJSF; ein Bild mit Punkten darauf ist keiner davon. Der Editor wird
 * deshalb neben das Feld gehängt, sobald der Dialog erscheint. Das Feld selbst
 * bleibt stehen: geht der Einbau schief, ist die Konfiguration noch von Hand
 * zu retten.
 */

import * as React from "react";

import { startFieldModalInjector } from "@shared/config-modal";

import { PointEditor } from "./editors/point-editor";
import { POINTS_ATTRIBUTE } from "./configuration-schema";
import { HotspotPoint, encodePointsAttribute, parsePoints } from "./points-model";

export function startPointEditorInjector(): () => void {
  return startFieldModalInjector<HotspotPoint[]>({
    fieldKey: POINTS_ATTRIBUTE,
    root: document,
    reopenLabel: "Punkte bearbeiten …",
    parse: parsePoints,
    serialize: encodePointsAttribute,
    render: (props) => React.createElement(PointEditor, props),
    modalTestId: "point-editor-modal",
    reopenTestId: "point-editor-reopen",
    panelStyle: { maxWidth: "1080px" },
  });
}
