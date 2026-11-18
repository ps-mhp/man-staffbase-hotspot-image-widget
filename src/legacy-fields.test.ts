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

import { readLegacyFromDialog } from "./legacy-fields";
import { encodePointsAttribute } from "./points-model";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("readLegacyFromDialog", () => {
  const input = (key: string, value: string): string => `<input id="root_${key}" value='${value}'>`;
  const select = (key: string, options: Array<[string, string]>, selected: string): string =>
    `<select id="root_${key}">${options
      .map(([value, text]) => `<option value="${value}"${value === selected ? " selected" : ""}>${text}</option>`)
      .join("")}</select>`;

  it("liest Textfelder des eigenen Dialogs", () => {
    const points = encodePointsAttribute([{ id: "p1", x: 1, y: 2, title: "Kabine" }]);
    document.body.innerHTML = `<form>${input("config", "")}${input("points", points)}${input("image-alt", "Ein Lkw")}</form>`;

    const read = readLegacyFromDialog();

    expect(read.attrs).toEqual({ points, "image-alt": "Ein Lkw" });
    expect(read.unreadable).toEqual(expect.arrayContaining(["image", "source", "display-mode", "menu-depth"]));
  });

  it("liest nichts aus dem Dialog eines anderen Widgets", () => {
    document.body.innerHTML = `<form>${input("display-mode", "dots")}</form><form>${input("config", "")}</form>`;

    const read = readLegacyFromDialog();

    expect(read.attrs).toEqual({});
    expect(read.unreadable).toContain("display-mode");
  });

  it("ist ohne eigenen Dialog ganz unlesbar", () => {
    expect(readLegacyFromDialog().unreadable).toHaveLength(9);
  });

  it("nimmt bei einem echten select die Option über ihren Text, auch wenn RJSF die Stelle schreibt", () => {
    document.body.innerHTML = `<form>${input("config", "")}${select(
      "source",
      [
        ["0", "Manuell: eigene Punkte mit Titel, Text und Link"],
        ["1", "Menü: Menüpunkte auf dem Bild platzieren"],
      ],
      "1",
    )}</form>`;

    expect(readLegacyFromDialog().attrs.source).toBe("menu");
  });

  it.each([
    ["1", "3"],
    ["5", "5"],
    ["6", "6"],
  ])("deutet %s im Feld Ebenen eindeutig als %s", (raw, depth) => {
    document.body.innerHTML = `<form>${input("config", "")}<input name="root_menu-depth" value="${raw}"></form>`;

    expect(readLegacyFromDialog().attrs["menu-depth"]).toBe(depth);
  });

  it.each(["2", "3", "4"])("lässt die mehrdeutige Zahl %s im Feld Ebenen ungelesen", (raw) => {
    document.body.innerHTML = `<form>${input("config", "")}<input name="root_menu-depth" value="${raw}"></form>`;

    const read = readLegacyFromDialog();

    expect(read.attrs["menu-depth"]).toBeUndefined();
    expect(read.unreadable).toContain("menu-depth");
  });

  it("liest eine MUI-Auswahl über den gezeigten Titel, auch wenn die Stelle mehrdeutig ist", () => {
    document.body.innerHTML = `<form>${input("config", "")}<div id="root_menu-depth" role="combobox">5 Ebenen</div><input name="root_menu-depth" value="3"></form>`;

    expect(readLegacyFromDialog().attrs["menu-depth"]).toBe("5");
  });

  it("lässt ein Auswahlfeld ohne Wert (Content Designer) ungelesen", () => {
    document.body.innerHTML = `<form>${input("config", "")}<div id="root_source" role="combobox">Menü</div></form>`;

    expect(readLegacyFromDialog().unreadable).toContain("source");
  });

  it("zeigt im Content Designer das Bild aus der Vorschau des Uploads, ohne es lesbar zu nennen", () => {
    document.body.innerHTML = `<form>${input("config", "")}<div><label for="root_image">Bild</label><img src="https://www.mti.man/api/media/a.jpg"></div></form>`;

    const read = readLegacyFromDialog();

    expect(read.previewImage).toEqual({ url: "https://www.mti.man/api/media/a.jpg", alt: "" });
    expect(read.unreadable).toContain("image");
  });
});
