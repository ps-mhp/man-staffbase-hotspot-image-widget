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

import { HotspotPoint, MAX_POINTS } from "../points-model";
import { duplicatePoint, freeSpot, linkSummary, movePoint, reorderPoints } from "./manual-points";

const point = (id: string, x = 10, y = 10): HotspotPoint => ({ id, x, y, title: id });

describe("freeSpot", () => {
  it("nimmt die Mitte und weicht schräg aus, wenn sie belegt ist", () => {
    expect(freeSpot([])).toEqual({ x: 50, y: 50 });
    expect(freeSpot([point("a", 50, 50)])).toEqual({ x: 56, y: 56 });
  });
});

describe("movePoint und reorderPoints", () => {
  const points = [point("a"), point("b"), point("c")];

  it("tauscht mit dem Nachbarn und bleibt am Rand stehen", () => {
    expect(movePoint(points, "a", 1).map((entry) => entry.id)).toEqual(["b", "a", "c"]);
    expect(movePoint(points, "a", -1).map((entry) => entry.id)).toEqual(["a", "b", "c"]);
  });

  it("ordnet nach Kennungen und lässt Fehlendes hinten", () => {
    expect(reorderPoints(points, ["c", "a"]).map((entry) => entry.id)).toEqual(["c", "a", "b"]);
  });
});

describe("duplicatePoint", () => {
  it("setzt eine versetzte Kopie gleich dahinter", () => {
    const result = duplicatePoint([point("a"), point("b")], "a");

    expect(result?.points.map((entry) => entry.title)).toEqual(["a", "a", "b"]);
    expect(result?.copy).toMatchObject({ x: 13, y: 13, title: "a" });
    expect(result?.copy.id).not.toBe("a");
  });

  it("kopiert an der Höchstzahl nicht", () => {
    const full = Array.from({ length: MAX_POINTS }, (_, index) => point(`p${index}`));
    expect(duplicatePoint(full, "p0")).toBeNull();
  });
});

describe("linkSummary", () => {
  it.each([
    [undefined, "ohne Link"],
    [{ kind: "page" as const, href: "/content/page/1", title: "Speiseplan" }, "Seite: Speiseplan"],
    [{ kind: "url" as const, href: "https://www.man.eu/de" }, "Adresse: www.man.eu"],
    [{ kind: "page" as const, href: "" }, "ohne Link"],
  ])("fasst %j zusammen", (link, text) => {
    expect(linkSummary(link)).toBe(text);
  });
});
