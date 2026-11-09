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

import { ICON_SIZES, readPointIcon } from "./point-icon";
import { parseMenuLayout, encodeMenuLayout } from "./menu-points-model";
import { encodePointsAttribute, parsePoints } from "./points-model";

const url = "https://www.mti.man/api/media/secure/external/v2/image/upload/kabine.png";

describe("readPointIcon", () => {
  it("liest Adresse und Grösse", () => {
    expect(readPointIcon({ url, size: "l" })).toEqual({ url, size: "l" });
  });

  it("nimmt ohne gültige Grösse M", () => {
    expect(readPointIcon({ url })).toEqual({ url, size: "m" });
    expect(readPointIcon({ url, size: "xl" })).toEqual({ url, size: "m" });
  });

  it.each([null, "kaputt", {}, { url: "javascript:alert(1)" }, { url: "" }])("verwirft %p", (value) => {
    expect(readPointIcon(value)).toBeUndefined();
  });

  it("kennt drei Grössen in Pixeln", () => {
    expect(ICON_SIZES).toEqual({ s: 32, m: 48, l: 72 });
  });
});

describe("Punktbilder in den Punkten", () => {
  it("überstehen manuelle Punkte Schreiben und Lesen", () => {
    const points = [{ id: "p1", x: 1, y: 2, title: "Kabine", icon: { url, size: "s" as const } }];

    expect(parsePoints(encodePointsAttribute(points))).toEqual(points);
  });

  it("überstehen Menüpunkte Schreiben und Lesen", () => {
    const layout = {
      "6a58dd4eefeacc1239d9fd09": {
        points: [{ id: "m1", menuId: "6a7358b8340cb013d7f29611", x: 1, y: 2, icon: { url, size: "l" as const } }],
      },
    };

    expect(parseMenuLayout(encodeMenuLayout(layout))).toEqual(layout);
  });

  it("lassen ein unbrauchbares Bild weg und behalten den Punkt", () => {
    const raw = JSON.stringify([{ id: "p1", x: 1, y: 2, title: "Kabine", icon: { url: "javascript:x" } }]);

    expect(parsePoints(raw)).toEqual([{ id: "p1", x: 1, y: 2, title: "Kabine" }]);
  });
});
