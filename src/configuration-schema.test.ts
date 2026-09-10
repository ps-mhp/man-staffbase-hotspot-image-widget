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
  DISPLAY_MODE_ATTRIBUTE,
  IMAGE_ATTRIBUTE,
  POINTS_ATTRIBUTE,
  configurationSchema,
  uiSchema,
} from "./configuration-schema";

describe("configurationSchema", () => {
  it("beschreibt die drei Attribute des Widgets", () => {
    expect(Object.keys(configurationSchema.properties ?? {})).toEqual([
      IMAGE_ATTRIBUTE,
      POINTS_ATTRIBUTE,
      DISPLAY_MODE_ATTRIBUTE,
    ]);
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
    for (const key of [IMAGE_ATTRIBUTE, POINTS_ATTRIBUTE, DISPLAY_MODE_ATTRIBUTE]) {
      expect(uiSchema[key]?.["ui:help"]).toEqual(expect.any(String));
    }
  });
});
