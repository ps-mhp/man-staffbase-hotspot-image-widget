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

import { DEFAULT_CONFIG, HotspotConfig } from "./hotspot-config";
import { HotspotDraft } from "./hotspot-draft";
import { hotspotChangesStatus, pointIssueId, pointsMessage, validateHotspotDraft } from "./editor-rules";

const a = { id: "a", x: 1, y: 1, title: "Empfang" };
const b = { id: "b", x: 2, y: 2, title: "Werkhalle" };
const draftOf = (config: Partial<HotspotConfig>): HotspotDraft => ({
  config: { ...DEFAULT_CONFIG, ...config },
  inherited: [],
});

describe("validateHotspotDraft", () => {
  it("meldet jeden Punkt ohne Titel, auch im Menü-Modus", () => {
    const draft = draftOf({ source: "menu", manual: { mode: "numbered", points: [a, { ...b, title: " " }] } });

    expect(validateHotspotDraft(draft)).toEqual([
      { id: pointIssueId("b"), message: "Punkt 2: Titel fehlt – ohne ihn ginge der Punkt verloren." },
    ]);
  });

  it("hat nichts zu melden, wenn alle Punkte einen Titel tragen", () => {
    expect(validateHotspotDraft(draftOf({ manual: { mode: "dots", points: [a, b] } }))).toEqual([]);
  });
});

describe("pointsMessage", () => {
  it.each([
    [[a, { ...b, title: "Halle" }], [a, b], "Punkt 2 geändert"],
    [[a, b], [a], "Punkt 2 neu"],
    [[a], [a, b], "Punkt gelöscht"],
    [[b, a], [a, b], "Reihenfolge geändert"],
    [[{ ...a, x: 9 }, { ...b, x: 9 }], [a, b], "2 Punkte geändert"],
  ])("beschreibt die Änderung kurz", (draft, saved, message) => {
    expect(pointsMessage(draft, saved)).toBe(message);
  });

  it("schweigt ohne Änderung", () => {
    expect(pointsMessage([a, b], [a, b])).toBeUndefined();
  });
});

describe("hotspotChangesStatus", () => {
  it("nennt die erste Änderung und zählt die übrigen", () => {
    const saved = draftOf({ manual: { mode: "numbered", points: [a] } });
    const draft = draftOf({ source: "menu", manual: { mode: "dots", points: [a] } });

    expect(hotspotChangesStatus(draft, saved)).toBe("Modus geändert · 1 weitere Änderung");
  });

  it("schweigt ohne Änderung", () => {
    expect(hotspotChangesStatus(draftOf({}), draftOf({}))).toBeUndefined();
  });
});
