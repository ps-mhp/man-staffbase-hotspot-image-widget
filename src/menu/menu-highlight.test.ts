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

import { menuMarkFor, subtreeIds } from "./menu-highlight";
import { IDS, buildTree } from "./menu-tree-test-data";

const tree = buildTree();

describe("menuMarkFor", () => {
  it("markiert die Zeile des Eintrags, wenn er auf der gezeigten Ebene steht", () => {
    expect(menuMarkFor(tree, IDS.ruhe, [])).toEqual({ kind: "row", id: IDS.ruhe });
  });

  it("markiert die Zeile des Vorfahren, wenn der Eintrag tiefer liegt", () => {
    expect(menuMarkFor(tree, IDS.lenkrad, [])).toEqual({ kind: "row", id: IDS.arbeitsplatz });
  });

  it("markiert die Kopfzeile für den Knoten der Ebene selbst", () => {
    expect(menuMarkFor(tree, IDS.fahrerhaus, [])).toEqual({ kind: "header" });
    expect(menuMarkFor(tree, IDS.arbeitsplatz, [IDS.arbeitsplatz])).toEqual({ kind: "header" });
  });

  it("markiert nichts für einen Eintrag über der gezeigten Ebene", () => {
    // Die Kopfzeile hieße dort „Fahrerarbeitsplatz“, nicht „Fahrerhaus“.
    expect(menuMarkFor(tree, IDS.fahrerhaus, [IDS.arbeitsplatz])).toBeNull();
  });

  it("markiert nichts für einen Eintrag in einem anderen Zweig", () => {
    expect(menuMarkFor(tree, IDS.kuehlbox, [IDS.arbeitsplatz])).toBeNull();
  });

  it("markiert nichts ohne Eintrag oder für einen unbekannten", () => {
    expect(menuMarkFor(tree, null, [])).toBeNull();
    expect(menuMarkFor(tree, "000000000000000000000000", [])).toBeNull();
  });
});

describe("subtreeIds", () => {
  it("nennt den Eintrag und alle seine Nachfahren", () => {
    expect([...subtreeIds(tree, IDS.arbeitsplatz)].sort()).toEqual([IDS.arbeitsplatz, IDS.lenkrad, IDS.sitz].sort());
  });

  it("ist leer für einen unbekannten Eintrag", () => {
    expect(subtreeIds(tree, "000000000000000000000000").size).toBe(0);
  });
});
