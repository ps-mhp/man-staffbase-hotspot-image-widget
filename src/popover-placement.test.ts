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

import { placePopover } from "./popover-placement";

const stage = { width: 800, height: 600 };
const popover = { width: 260, height: 160 };

describe("placePopover", () => {
  it("hängt das Popover mittig unter den Punkt, wenn Platz ist", () => {
    expect(placePopover({ point: { x: 50, y: 20 }, stage, popover, gap: 10 })).toEqual({
      left: 270,
      top: 130,
      side: "bottom",
    });
  });

  it("kippt nach oben, wenn darunter kein Platz mehr ist", () => {
    expect(placePopover({ point: { x: 50, y: 95 }, stage, popover, gap: 10 })).toEqual({
      left: 270,
      top: 400,
      side: "top",
    });
  });

  it("rastet am linken Rand ein, statt aus dem Bild zu ragen", () => {
    expect(placePopover({ point: { x: 2, y: 20 }, stage, popover, gap: 10 }).left).toBe(0);
  });

  it("rastet am rechten Rand ein", () => {
    expect(placePopover({ point: { x: 98, y: 20 }, stage, popover, gap: 10 }).left).toBe(540);
  });

  it("bleibt bei 0, wenn das Popover breiter ist als die Bühne", () => {
    expect(
      placePopover({ point: { x: 50, y: 20 }, stage: { width: 200, height: 600 }, popover }).left,
    ).toBe(0);
  });
});
