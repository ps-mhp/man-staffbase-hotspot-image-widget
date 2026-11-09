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

import { encodeImageAttribute } from "../points-model";
import { readImageAttribute } from "./use-image-attribute";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("readImageAttribute", () => {
  it("liest das Bild aus dem Textfeld des klassischen Editors", () => {
    const image = { url: "https://example.test/a.jpg", alt: "Ein Auto" };
    document.body.innerHTML = `<input id="root_image">`;
    document.querySelector<HTMLInputElement>("#root_image")!.value = encodeImageAttribute(image);

    expect(readImageAttribute()).toEqual(image);
  });

  it("liest das Bild aus der Vorschau des Content-Designer-Uploads", () => {
    document.body.innerHTML = `
      <div>
        <label for="root_image">Bild</label>
        <div><div data-c13y-component="card"><img src="https://example.test/upload/a.jpg" alt="x.jpg"></div></div>
      </div>`;

    expect(readImageAttribute()).toEqual({ url: "https://example.test/upload/a.jpg", alt: "" });
  });

  it("ist ohne Feld und ohne Vorschau null, statt zu werfen", () => {
    expect(readImageAttribute()).toBeNull();
    document.body.innerHTML = `<div><label for="root_image">Bild</label><button>Datei hochladen</button></div>`;
    expect(readImageAttribute()).toBeNull();
  });
});
