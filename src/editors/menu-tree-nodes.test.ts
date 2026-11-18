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

import { IDS, buildTree } from "../menu/menu-tree-test-data";
import { expandableIds, menuTreeNodes, orphanKey, parentOf, parseOrphanKey, trailTitle } from "./menu-tree-nodes";

const rootImage = { url: "https://example.test/lkw.jpg", alt: "" };

describe("menuTreeNodes", () => {
  it("beschreibt Startpunkt, Ebenen und Einträge mit ihrem Stand", () => {
    const tree = buildTree();
    const layout = {
      [IDS.fahrerhaus]: { points: [{ id: "a", menuId: IDS.arbeitsplatz, x: 1, y: 1 }] },
      [IDS.arbeitsplatz]: { image: rootImage, points: [{ id: "b", menuId: IDS.lenkrad, x: 1, y: 1 }] },
    };

    const [root] = menuTreeNodes(tree, layout, rootImage);
    const [arbeitsplatz, ruhe, ausstattung] = root.children ?? [];

    expect(root.description).toBe("Startpunkt · Bild + 1 Punkt");
    expect(arbeitsplatz.description).toBe("Punkt gesetzt · Bild + 1 Punkt");
    expect(ruhe).toMatchObject({ description: "kein Punkt" });
    expect(ruhe.children).toBeUndefined();
    expect(ausstattung.description).toBe("kein Punkt · Bild der Ebene darüber");
  });

  it("hängt verwaiste Punkte als Fehler unter ihre Ebene", () => {
    const tree = buildTree();
    const layout = { [IDS.fahrerhaus]: { points: [{ id: "x", menuId: "6a0000000000000000000000", x: 1, y: 1 }] } };

    const [root] = menuTreeNodes(tree, layout, null);
    const orphan = root.children?.at(-1);

    expect(root.description).toBe("Startpunkt · noch kein Bild");
    expect(orphan).toEqual({
      id: orphanKey(IDS.fahrerhaus, "x"),
      label: "Unbekannter Menüpunkt",
      description: "Nicht mehr im Menü",
      invalid: true,
    });
  });
});

describe("Hilfen zum Baum", () => {
  const tree = buildTree();

  it("kennt den Eintrag darüber und den Weg vom Startpunkt", () => {
    expect(parentOf(tree, IDS.lenkrad)).toBe(IDS.arbeitsplatz);
    expect(parentOf(tree, IDS.fahrerhaus)).toBeNull();
    expect(trailTitle(tree, IDS.arbeitsplatz)).toBe("Fahrerhaus › Fahrerarbeitsplatz");
  });

  it("liest die Kennung eines verwaisten Punkts zurück", () => {
    expect(parseOrphanKey(orphanKey("lvl", "pt"))).toEqual({ levelId: "lvl", pointId: "pt" });
    expect(parseOrphanKey(IDS.ruhe)).toBeNull();
  });

  it("klappt alle Ebenen auf", () => {
    expect(expandableIds(menuTreeNodes(tree, {}, null))).toEqual([IDS.fahrerhaus, IDS.arbeitsplatz, IDS.ausstattung]);
  });
});
