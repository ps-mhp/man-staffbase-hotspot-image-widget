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

import { decodePayload } from "@shared/payload";

import {
  DEFAULT_MENU_DEPTH,
  MenuLayout,
  encodeMenuLayout,
  levelLayout,
  parseMenuLayout,
  readMenuClick,
  readMenuDepth,
  readSource,
  withLevel,
} from "./menu-points-model";
import { MAX_POINTS } from "./points-model";

const FAHRERHAUS = "6a58dd4eefeacc1239d9fd09";
const ARBEITSPLATZ = "6a73580860fe1414378d4660";
const RUHEBEREICH = "6a7358b8340cb013d7f29611";

const image = { url: "https://www.mti.man/api/media/secure/external/v2/image/upload/a.jpg", alt: "Fahrerhaus", width: 800, height: 600 };

describe("readSource", () => {
  it.each([
    ["menu", "menu"],
    ["manual", "manual"],
    ["", "manual"],
    [undefined, "manual"],
    ["etwas", "manual"],
  ])("liest %p als %p", (raw, expected) => {
    expect(readSource(raw)).toBe(expected);
  });
});

describe("readMenuDepth", () => {
  it.each([
    ["2", 2],
    ["6", 6],
    ["1", DEFAULT_MENU_DEPTH],
    ["7", DEFAULT_MENU_DEPTH],
    ["2.5", DEFAULT_MENU_DEPTH],
    [undefined, DEFAULT_MENU_DEPTH],
  ])("liest %p als %p", (raw, expected) => {
    expect(readMenuDepth(raw)).toBe(expected);
  });

  it("gibt standardmäßig drei Ebenen", () => {
    expect(DEFAULT_MENU_DEPTH).toBe(3);
  });
});

describe("readMenuClick", () => {
  it.each([
    ["open", "open"],
    ["enter", "enter"],
    // Die Fassung 0.2.0-rc.1 schrieb `reveal`; gemeint war das Menü, nicht die Seite.
    ["reveal", "enter"],
    ["", "enter"],
    [undefined, "enter"],
  ])("liest %p als %p", (raw, expected) => {
    expect(readMenuClick(raw)).toBe(expected);
  });
});

describe("parseMenuLayout", () => {
  it("liest je Ebene Bild und Punkte und schreibt IDs klein", () => {
    const raw = JSON.stringify({
      levels: {
        [FAHRERHAUS.toUpperCase()]: {
          image,
          points: [{ id: "p1", menuId: ARBEITSPLATZ.toUpperCase(), x: 10, y: 20.5 }],
        },
      },
    });

    expect(parseMenuLayout(raw)).toEqual({
      [FAHRERHAUS]: { image, points: [{ id: "p1", menuId: ARBEITSPLATZ, x: 10, y: 20.5 }] },
    });
  });

  it("liest die kodierte Fassung, die der Editor schreibt", () => {
    const layout: MenuLayout = {
      [FAHRERHAUS]: { image, points: [{ id: "p1", menuId: ARBEITSPLATZ, x: 1, y: 2 }] },
      [ARBEITSPLATZ]: { points: [{ id: "p2", menuId: RUHEBEREICH, x: 3, y: 4 }] },
    };

    expect(parseMenuLayout(encodeMenuLayout(layout))).toEqual(layout);
  });

  it("verwirft Ebenen ohne gültige ID und Punkte ohne gültige Menü-ID oder ausserhalb des Bildes", () => {
    const raw = JSON.stringify({
      levels: {
        "keine-id": { points: [{ id: "a", menuId: RUHEBEREICH, x: 1, y: 1 }] },
        [FAHRERHAUS]: {
          points: [
            { id: "b", menuId: "keine-id", x: 1, y: 1 },
            { id: "c", menuId: RUHEBEREICH, x: 101, y: 1 },
            { id: "d", menuId: ARBEITSPLATZ, x: 5, y: 5 },
          ],
        },
      },
    });

    expect(parseMenuLayout(raw)).toEqual({
      [FAHRERHAUS]: { points: [{ id: "d", menuId: ARBEITSPLATZ, x: 5, y: 5 }] },
    });
  });

  it("nimmt als Bild nur http(s)-Adressen und Pfade der eigenen Instanz", () => {
    const raw = JSON.stringify({
      levels: {
        [FAHRERHAUS]: { image: { url: "javascript:alert(1)", alt: "" }, points: [] },
        [ARBEITSPLATZ]: { image: { url: "/api/media/a.jpg" }, points: [] },
      },
    });

    expect(parseMenuLayout(raw)).toEqual({ [ARBEITSPLATZ]: { image: { url: "/api/media/a.jpg", alt: "" }, points: [] } });
  });

  it("behält je Menüeintrag und Ebene nur den ersten Punkt", () => {
    const raw = JSON.stringify({
      levels: {
        [FAHRERHAUS]: {
          points: [
            { id: "a", menuId: ARBEITSPLATZ, x: 1, y: 1 },
            { id: "b", menuId: ARBEITSPLATZ, x: 2, y: 2 },
          ],
        },
      },
    });

    expect(levelLayout(parseMenuLayout(raw), FAHRERHAUS).points.map((point) => point.id)).toEqual(["a"]);
  });

  it("trägt je Ebene höchstens so viele Punkte wie der manuelle Modus", () => {
    const points = Array.from({ length: MAX_POINTS + 5 }, (_, index) => ({
      id: `p${index}`,
      menuId: index.toString(16).padStart(24, "0"),
      x: 1,
      y: 1,
    }));

    const layout = parseMenuLayout(JSON.stringify({ levels: { [FAHRERHAUS]: { points } } }));

    expect(levelLayout(layout, FAHRERHAUS).points).toHaveLength(MAX_POINTS);
  });

  it.each(["", "kaputt", "{}", "null", "[]", JSON.stringify([{ menuId: FAHRERHAUS, x: 1, y: 1 }])])(
    "liest %p als leer",
    (raw) => {
      expect(parseMenuLayout(raw)).toEqual({});
    },
  );

  it("schreibt unbekannte Felder eines Punktes wieder mit", () => {
    const raw = JSON.stringify({
      levels: { [FAHRERHAUS]: { points: [{ id: "a", menuId: ARBEITSPLATZ, x: 1, y: 1, farbe: "blau" }] } },
    });

    const encoded = encodeMenuLayout(parseMenuLayout(raw));

    expect(JSON.parse(decodePayload(encoded) ?? "")).toEqual({
      levels: { [FAHRERHAUS]: { points: [{ id: "a", menuId: ARBEITSPLATZ, x: 1, y: 1, farbe: "blau" }] } },
    });
  });
});

describe("encodeMenuLayout", () => {
  it("lässt leere Ebenen weg", () => {
    const encoded = encodeMenuLayout({ [FAHRERHAUS]: { points: [] } });

    expect(JSON.parse(decodePayload(encoded) ?? "")).toEqual({ levels: {} });
  });
});

describe("levelLayout und withLevel", () => {
  it("gibt für eine unbekannte Ebene eine leere zurück", () => {
    expect(levelLayout({}, FAHRERHAUS)).toEqual({ points: [] });
  });

  it("setzt eine Ebene, ohne die Vorlage zu verändern", () => {
    const before: MenuLayout = { [FAHRERHAUS]: { points: [] } };

    const after = withLevel(before, ARBEITSPLATZ, { image, points: [] });

    expect(after).toEqual({ [FAHRERHAUS]: { points: [] }, [ARBEITSPLATZ]: { image, points: [] } });
    expect(before).toEqual({ [FAHRERHAUS]: { points: [] } });
  });
});
