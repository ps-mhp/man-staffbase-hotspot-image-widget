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

import { MenuLayout, MenuHotspotPoint } from "../menu-points-model";
import { imageLevelFor, levelNodes, levelPoints, orphanPoints, shownLevelId, trailOf } from "./menu-levels";
import { IDS, buildTree } from "./menu-tree-test-data";

const tree = buildTree();
const rootImage = { url: "https://example.test/lkw.jpg", alt: "Lkw" };
const cabImage = { url: "https://example.test/kabine.jpg", alt: "Kabine" };

const point = (menuId: string): MenuHotspotPoint => ({ id: `p-${menuId}`, menuId, x: 10, y: 10 });

const layout: MenuLayout = {
  [IDS.fahrerhaus]: { points: [point(IDS.arbeitsplatz), point(IDS.ruhe), point(IDS.lenkrad)] },
  [IDS.arbeitsplatz]: { image: cabImage, points: [point(IDS.sitz)] },
};

describe("shownLevelId und trailOf", () => {
  it("zeigt oben den Startknoten, sonst das Ende des Pfads", () => {
    expect(shownLevelId(tree, [])).toBe(IDS.fahrerhaus);
    expect(shownLevelId(tree, [IDS.arbeitsplatz])).toBe(IDS.arbeitsplatz);
  });

  it("nennt den Pfad, auf dem ein Eintrag selbst die gezeigte Ebene ist", () => {
    expect(trailOf(tree, IDS.arbeitsplatz)).toEqual([IDS.arbeitsplatz]);
    expect(trailOf(tree, IDS.fahrerhaus)).toEqual([]);
    expect(trailOf(tree, "000000000000000000000000")).toBeNull();
  });
});

describe("imageLevelFor", () => {
  it("nimmt das eigene Bild der Ebene", () => {
    expect(imageLevelFor(tree, IDS.arbeitsplatz, rootImage, layout)).toEqual({ levelId: IDS.arbeitsplatz, image: cabImage });
  });

  it("nimmt oben das Bild aus dem Bildfeld", () => {
    expect(imageLevelFor(tree, IDS.fahrerhaus, rootImage, layout)).toEqual({ levelId: IDS.fahrerhaus, image: rootImage });
  });

  it("fällt ohne eigenes Bild auf die Ebene darüber zurück", () => {
    expect(imageLevelFor(tree, IDS.ausstattung, rootImage, layout)).toEqual({ levelId: IDS.fahrerhaus, image: rootImage });
  });

  it("findet nichts, wenn keine Ebene bis oben ein Bild hat", () => {
    expect(imageLevelFor(tree, IDS.ausstattung, null, layout)).toBeNull();
    expect(imageLevelFor(tree, IDS.arbeitsplatz, null, layout)?.levelId).toBe(IDS.arbeitsplatz);
  });
});

describe("levelPoints", () => {
  it("nimmt nur Punkte direkter Unterpunkte der Ebene, die im Baum stehen", () => {
    const placed = levelPoints(tree, layout, IDS.fahrerhaus);

    // Lenkrad liegt eine Ebene tiefer und gehört nicht auf das Bild von Fahrerhaus.
    expect(placed.map(({ point }) => point.menuId)).toEqual([IDS.arbeitsplatz, IDS.ruhe]);
    expect(placed[0].node.entry.title).toBe("Fahrerarbeitsplatz");
  });

  it("ist leer für eine Ebene ohne Eintrag im Layout", () => {
    expect(levelPoints(tree, layout, IDS.ausstattung)).toEqual([]);
  });
});

describe("orphanPoints", () => {
  it("nennt Punkte, die auf ihrer Ebene nicht gezeigt würden", () => {
    const withGone: MenuLayout = {
      ...layout,
      "111111111111111111111111": { points: [point(IDS.ruhe)] },
    };

    expect(orphanPoints(tree, withGone).map(({ levelId, point: { menuId } }) => [levelId, menuId])).toEqual([
      [IDS.fahrerhaus, IDS.lenkrad],
      ["111111111111111111111111", IDS.ruhe],
    ]);
  });
});

describe("levelNodes", () => {
  it("nennt jeden Eintrag mit Unterpunkten im Baum, mit Tiefe, in Menüreihenfolge", () => {
    expect(levelNodes(tree).map(({ node, depth }) => [node.entry.title, depth])).toEqual([
      ["Fahrerhaus", 0],
      ["Fahrerarbeitsplatz", 1],
      ["Ausstattung", 1],
    ]);
  });
});
