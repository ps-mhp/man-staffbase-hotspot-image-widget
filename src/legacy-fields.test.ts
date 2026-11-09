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

import { startHiddenFields } from "./legacy-fields";

function row(key: string, labelOnly = false): string {
  return labelOnly
    ? `<div data-row="${key}"><label for="root_${key}">${key}</label><div class="upload"><img src="x.jpg"></div></div>`
    : `<div data-row="${key}"><label for="root_${key}">${key}</label><input id="root_${key}"><p>Hilfe</p></div>`;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("startHiddenFields", () => {
  it("blendet die ganzen Zeilen der genannten Felder aus und lässt die übrigen stehen", () => {
    document.body.innerHTML = `<form>${row("config")}${row("points")}${row("image", true)}</form>`;

    const stop = startHiddenFields(["points", "image"]);

    expect(document.querySelector<HTMLElement>('[data-row="points"]')?.style.display).toBe("none");
    expect(document.querySelector<HTMLElement>('[data-row="image"]')?.style.display).toBe("none");
    expect(document.querySelector<HTMLElement>('[data-row="config"]')?.style.display).toBe("");
    stop();
  });

  it("erfasst auch Felder, die der Dialog erst später zeigt, und gibt sie beim Aufhören wieder frei", async () => {
    document.body.innerHTML = "<form></form>";
    const stop = startHiddenFields(["points"]);

    document.querySelector("form")?.insertAdjacentHTML("beforeend", `${row("config")}${row("points")}`);
    await Promise.resolve();

    const points = document.querySelector<HTMLElement>('[data-row="points"]');
    expect(points?.style.display).toBe("none");
    stop();
    expect(points?.style.display).toBe("");
  });
});
