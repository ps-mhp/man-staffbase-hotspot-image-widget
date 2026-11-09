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

import { readLegacyFromDialog } from "./hotspot-dialog";
import { encodePointsAttribute } from "./points-model";

const designerImage = { url: "https://www.mti.man/api/media/a.jpg", alt: "" };
jest.mock("./editors/use-image-attribute", () => ({
  readImageAttribute: jest.fn(() => designerImage),
}));

function field(key: string, value: string): string {
  return `<input id="root_${key}" value='${value}'>`;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("readLegacyFromDialog", () => {
  it("übernimmt die alten Felder des Dialogs", () => {
    document.body.innerHTML = `<form>${field("points", encodePointsAttribute([{ id: "p1", x: 1, y: 2, title: "Kabine" }]))}${field("display-mode", "dots")}${field("image-alt", "Ein Lkw")}</form>`;

    const config = readLegacyFromDialog();

    expect(config.manual).toEqual({ mode: "dots", points: [{ id: "p1", x: 1, y: 2, title: "Kabine" }] });
    // Im Content Designer steht das Bild nur in der Vorschau des Uploads.
    expect(config.image).toEqual({ url: designerImage.url, alt: "Ein Lkw" });
    expect(config.source).toBe("manual");
  });
});
