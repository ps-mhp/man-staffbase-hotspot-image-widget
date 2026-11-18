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
 * Sagt, welche bisherigen Einstellungen das Fenster nicht lesen konnte.
 *
 * Für sie zeigt es die Vorgabe, schreibt sie aber nicht: der Block behält
 * seinen alten Wert, bis jemand ihn hier ändert (`hotspot-draft.ts`). Ohne
 * diesen Satz sähe „Manuell“ aus wie die Wahrheit, auch wenn die Seite den
 * Menü-Modus zeigt.
 */

import * as React from "react";
import { ReactElement } from "react";
import { Info } from "lucide-react";

import { ConfigKey } from "../hotspot-config";

const KEY_NAMES: Readonly<Record<ConfigKey, string>> = {
  source: "Quelle der Punkte",
  image: "Bild",
  "manual.mode": "Darstellung",
  "manual.points": "Punkte",
  "menu.rootId": "Startpunkt",
  "menu.depth": "Tiefe",
  "menu.click": "Klick auf einen Punkt",
  "menu.layout": "Menüpunkte",
};

export function InheritedNote({ keys }: { keys: readonly ConfigKey[] }): ReactElement | null {
  if (keys.length === 0) return null;
  return (
    <p
      className="flex items-start gap-2.5 rounded-md bg-muted px-3.5 py-3 text-[13px] leading-normal text-muted-foreground"
      data-testid="inherited-note"
    >
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
      <span>
        Aus dem Dialog nicht lesbar: {keys.map((key) => KEY_NAMES[key]).join(", ")}. Dafür gilt weiter die bisherige
        Einstellung des Blocks – bis du sie hier änderst.
      </span>
    </p>
  );
}
