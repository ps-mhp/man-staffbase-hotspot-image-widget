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
 * Das eigene Bild eines Punktes, an Stelle des roten Punkts — in der
 * Leseansicht beider Modi. Rein schmückend: den Namen trägt der Punkt selbst.
 */

import * as React from "react";
import { ReactElement } from "react";

import { PointIcon } from "./point-icon";

/** Die Klassen, die aus dem Punkt einen Bildpunkt der passenden Grösse machen. */
export function iconClassNames(icon: PointIcon | undefined): string[] {
  return icon === undefined ? [] : ["man-hi__marker--icon", `man-hi__marker--icon-${icon.size}`];
}

export function MarkerIcon({ icon }: { icon: PointIcon }): ReactElement {
  return <img className="man-hi__marker-icon" src={icon.url} alt="" draggable={false} />;
}
