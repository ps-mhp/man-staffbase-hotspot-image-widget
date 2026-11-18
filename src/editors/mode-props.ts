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

/** Was beide Modi des Editors vom Fenster bekommen. */

import { ConfigKey, HotspotConfig } from "../hotspot-config";
import { PointSource } from "../menu-points-model";

/** Ändert die Konfiguration über ihren jüngsten Stand – auch aus festgehaltenen Rückrufen. */
export type ConfigUpdate = (change: (config: HotspotConfig) => HotspotConfig) => void;

export interface ModeEditorProps {
  config: HotspotConfig;
  /** Schlüssel, deren alter Wert nicht lesbar war (siehe `inherited-note.tsx`). */
  inherited: readonly ConfigKey[];
  update: ConfigUpdate;
  onSourceChange: (source: PointSource) => void;
}
