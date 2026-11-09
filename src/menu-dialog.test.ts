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

import { fireEvent } from "@testing-library/react";

import {
  DISPLAY_MODE_ATTRIBUTE,
  MENU_CLICK_ATTRIBUTE,
  MENU_DEPTH_ATTRIBUTE,
  MENU_ID_ATTRIBUTE,
  MENU_POINTS_ATTRIBUTE,
  POINTS_ATTRIBUTE,
  SOURCE_ATTRIBUTE,
} from "./configuration-schema";
import { menuEditorOpensInitially, startModeFieldVisibility } from "./menu-dialog";

const image = { url: "https://example.test/a.jpg", alt: "" };
jest.mock("./editors/use-image-attribute", () => ({
  imageSource: jest.fn(() => "field"),
  readImageAttribute: jest.fn(() => image),
}));

const KEYS = [
  SOURCE_ATTRIBUTE,
  POINTS_ATTRIBUTE,
  DISPLAY_MODE_ATTRIBUTE,
  MENU_ID_ATTRIBUTE,
  MENU_DEPTH_ATTRIBUTE,
  MENU_CLICK_ATTRIBUTE,
  MENU_POINTS_ATTRIBUTE,
];

/** Ein Formular wie das von RJSF: je Feld eine Zeile mit `id="root_<key>"`. */
function buildForm(values: Record<string, string>): HTMLFormElement {
  const form = document.createElement("form");
  for (const key of KEYS) {
    const row = document.createElement("div");
    row.dataset.row = key;
    const input = document.createElement("input");
    input.id = `root_${key}`;
    input.value = values[key] ?? "";
    row.append(input);
    form.append(row);
  }
  document.body.append(form);
  return form;
}

const row = (form: HTMLElement, key: string): HTMLElement => form.querySelector<HTMLElement>(`[data-row="${key}"]`)!;
const hidden = (form: HTMLElement, key: string): boolean => row(form, key).style.display === "none";

afterEach(() => {
  document.body.innerHTML = "";
  jest.clearAllMocks();
});

describe("startModeFieldVisibility", () => {
  it("zeigt im manuellen Modus nur dessen Felder", () => {
    const form = buildForm({ [SOURCE_ATTRIBUTE]: "manual" });
    const stop = startModeFieldVisibility(form);

    expect(hidden(form, POINTS_ATTRIBUTE)).toBe(false);
    expect(hidden(form, DISPLAY_MODE_ATTRIBUTE)).toBe(false);
    for (const key of [MENU_ID_ATTRIBUTE, MENU_DEPTH_ATTRIBUTE, MENU_CLICK_ATTRIBUTE, MENU_POINTS_ATTRIBUTE]) {
      expect(hidden(form, key)).toBe(true);
    }
    expect(hidden(form, SOURCE_ATTRIBUTE)).toBe(false);
    stop();
  });

  it("schaltet beim Wechsel in den Modus „Menü“ um", () => {
    const form = buildForm({ [SOURCE_ATTRIBUTE]: "manual" });
    const stop = startModeFieldVisibility(form);
    const source = form.querySelector<HTMLInputElement>(`#root_${SOURCE_ATTRIBUTE}`)!;

    source.value = "menu";
    fireEvent.input(source);

    expect(hidden(form, POINTS_ATTRIBUTE)).toBe(true);
    expect(hidden(form, DISPLAY_MODE_ATTRIBUTE)).toBe(true);
    expect(hidden(form, MENU_ID_ATTRIBUTE)).toBe(false);
    expect(hidden(form, MENU_POINTS_ATTRIBUTE)).toBe(false);
    stop();
  });

  it("behandelt einen fehlenden Modus wie den manuellen", () => {
    const form = buildForm({});
    const stop = startModeFieldVisibility(form);

    expect(hidden(form, POINTS_ATTRIBUTE)).toBe(false);
    expect(hidden(form, MENU_ID_ATTRIBUTE)).toBe(true);
    stop();
  });
});

describe("menuEditorOpensInitially", () => {
  it("öffnet im Modus „Menü“ mit Startpunkt und Bild", () => {
    buildForm({ [SOURCE_ATTRIBUTE]: "menu", [MENU_ID_ATTRIBUTE]: "6a58dd4eefeacc1239d9fd09" });

    expect(menuEditorOpensInitially()).toBe(true);
  });

  it("bleibt im manuellen Modus zu", () => {
    buildForm({ [SOURCE_ATTRIBUTE]: "manual", [MENU_ID_ATTRIBUTE]: "6a58dd4eefeacc1239d9fd09" });

    expect(menuEditorOpensInitially()).toBe(false);
  });

  it("bleibt ohne Startpunkt zu", () => {
    buildForm({ [SOURCE_ATTRIBUTE]: "menu" });

    expect(menuEditorOpensInitially()).toBe(false);
  });

  it("bleibt im Content Designer ohne Bild zu", () => {
    const attribute = jest.requireMock("./editors/use-image-attribute");
    attribute.imageSource.mockReturnValue("designer");
    attribute.readImageAttribute.mockReturnValue(null);
    buildForm({ [SOURCE_ATTRIBUTE]: "menu", [MENU_ID_ATTRIBUTE]: "6a58dd4eefeacc1239d9fd09" });

    expect(menuEditorOpensInitially()).toBe(false);
  });
});
