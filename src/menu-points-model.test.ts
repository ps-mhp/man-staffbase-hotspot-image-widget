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
  MenuHotspotPoint,
  encodeMenuPointsAttribute,
  parseMenuPoints,
  readMenuClick,
  readMenuDepth,
  readSource,
} from "./menu-points-model";
import { MAX_POINTS } from "./points-model";

const FAHRERHAUS = "6a58dd4eefeacc1239d9fd09";
const RUHEBEREICH = "6a7358b8340cb013d7f29611";

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
    ["3", 3],
    ["1", DEFAULT_MENU_DEPTH],
    ["7", DEFAULT_MENU_DEPTH],
    ["2.5", DEFAULT_MENU_DEPTH],
    ["", DEFAULT_MENU_DEPTH],
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
    ["reveal", "reveal"],
    ["open", "open"],
    ["", "open"],
    [undefined, "open"],
  ])("liest %p als %p", (raw, expected) => {
    expect(readMenuClick(raw)).toBe(expected);
  });
});

describe("parseMenuPoints", () => {
  it("liest Menü-ID und Position und schreibt die ID klein", () => {
    const raw = JSON.stringify([{ id: "p1", menuId: FAHRERHAUS.toUpperCase(), x: 10, y: 20.5 }]);

    expect(parseMenuPoints(raw)).toEqual([{ id: "p1", menuId: FAHRERHAUS, x: 10, y: 20.5 }]);
  });

  it("liest auch die kodierte Fassung, die der Editor schreibt", () => {
    const points: MenuHotspotPoint[] = [{ id: "p1", menuId: FAHRERHAUS, x: 1, y: 2 }];

    expect(parseMenuPoints(encodeMenuPointsAttribute(points))).toEqual(points);
  });

  it("verwirft Einträge ohne gültige Menü-ID oder ausserhalb des Bildes", () => {
    const raw = JSON.stringify([
      { id: "a", menuId: "keine-id", x: 1, y: 1 },
      { id: "b", menuId: FAHRERHAUS, x: 101, y: 1 },
      { id: "c", menuId: FAHRERHAUS, x: "1", y: 1 },
      { id: "d", menuId: RUHEBEREICH, x: 5, y: 5 },
    ]);

    expect(parseMenuPoints(raw).map((point) => point.id)).toEqual(["d"]);
  });

  it("behält je Menüeintrag nur den ersten Punkt", () => {
    const raw = JSON.stringify([
      { id: "a", menuId: FAHRERHAUS, x: 1, y: 1 },
      { id: "b", menuId: FAHRERHAUS, x: 2, y: 2 },
    ]);

    expect(parseMenuPoints(raw).map((point) => point.id)).toEqual(["a"]);
  });

  it("vergibt eine ID, wo keine steht", () => {
    const [point] = parseMenuPoints(JSON.stringify([{ menuId: FAHRERHAUS, x: 1, y: 1 }]));

    expect(point.id).toMatch(/\S+/);
  });

  it("trägt höchstens so viele Punkte wie der manuelle Modus", () => {
    const raw = JSON.stringify(
      Array.from({ length: MAX_POINTS + 5 }, (_, index) => ({
        id: `p${index}`,
        menuId: index.toString(16).padStart(24, "0"),
        x: 1,
        y: 1,
      })),
    );

    expect(parseMenuPoints(raw)).toHaveLength(MAX_POINTS);
  });

  it.each(["", "kaputt", "{}", "null"])("liest %p als leere Liste", (raw) => {
    expect(parseMenuPoints(raw)).toEqual([]);
  });

  it("schreibt unbekannte Felder einer späteren Version wieder mit", () => {
    const raw = JSON.stringify([{ id: "a", menuId: FAHRERHAUS, x: 1, y: 1, farbe: "blau" }]);

    const encoded = encodeMenuPointsAttribute(parseMenuPoints(raw));

    expect(JSON.parse(decodePayload(encoded) ?? "")).toEqual([
      { id: "a", menuId: FAHRERHAUS, x: 1, y: 1, farbe: "blau" },
    ]);
  });
});
