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

import {
  ALL_ATTRIBUTES,
  DISPLAY_MODE_ATTRIBUTE,
  IMAGE_ALT_ATTRIBUTE,
  IMAGE_ATTRIBUTE,
  MENU_CLICK_ATTRIBUTE,
  MENU_DEPTH_ATTRIBUTE,
  MENU_ID_ATTRIBUTE,
  MENU_POINTS_ATTRIBUTE,
  POINTS_ATTRIBUTE,
  SOURCE_ATTRIBUTE,
  configurationSchema,
  uiSchema,
} from "./configuration-schema";

describe("configurationSchema", () => {
  it("beschreibt die Attribute des Widgets in der Reihenfolge des Dialogs", () => {
    expect(Object.keys(configurationSchema.properties ?? {})).toEqual([
      IMAGE_ATTRIBUTE,
      IMAGE_ALT_ATTRIBUTE,
      SOURCE_ATTRIBUTE,
      POINTS_ATTRIBUTE,
      DISPLAY_MODE_ATTRIBUTE,
      MENU_ID_ATTRIBUTE,
      MENU_DEPTH_ATTRIBUTE,
      MENU_CLICK_ATTRIBUTE,
      MENU_POINTS_ATTRIBUTE,
    ]);
    expect(ALL_ATTRIBUTES).toEqual(Object.keys(configurationSchema.properties ?? {}));
  });

  it("beginnt im bisherigen Modus, damit bestehende Inhalte unverändert bleiben", () => {
    expect((configurationSchema.properties ?? {})[SOURCE_ATTRIBUTE]).toMatchObject({
      type: "string",
      default: "manual",
      oneOf: [
        { const: "manual", title: expect.any(String) },
        { const: "menu", title: expect.any(String) },
      ],
    });
  });

  it("bietet drei Ebenen und das Öffnen der Seite als Vorgabe an", () => {
    const properties = configurationSchema.properties ?? {};
    expect(properties[MENU_DEPTH_ATTRIBUTE]).toMatchObject({ default: "3" });
    expect((properties[MENU_DEPTH_ATTRIBUTE] as { oneOf: Array<{ const: string }> }).oneOf.map((option) => option.const)).toEqual([
      "2",
      "3",
      "4",
      "5",
      "6",
    ]);
    expect(properties[MENU_CLICK_ATTRIBUTE]).toMatchObject({
      default: "open",
      oneOf: [{ const: "open" }, { const: "reveal" }],
    });
  });

  it("bietet den Anzeigemodus als Auswahl an, damit er ohne den Editor bedienbar bleibt", () => {
    const mode = (configurationSchema.properties ?? {})[DISPLAY_MODE_ATTRIBUTE];
    expect(mode).toMatchObject({
      type: "string",
      default: "numbered",
      oneOf: [
        { const: "numbered", title: expect.any(String) },
        { const: "dots", title: expect.any(String) },
      ],
    });
  });

  it("erklärt jedes Feld im Dialog", () => {
    for (const key of ALL_ATTRIBUTES) {
      expect(uiSchema[key]?.["ui:help"]).toEqual(expect.any(String));
    }
  });
});
