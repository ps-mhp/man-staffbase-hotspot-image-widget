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

import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { START_POINT_MESSAGES, StartPointField } from "./start-point-field";

const FAHRERHAUS = "6a58dd4eefeacc1239d9fd09";
const TECHNIK = "6a58dd4eefeacc1239d9fd0a";
const options = [
  { id: TECHNIK, title: "Technik im Detail" },
  { id: FAHRERHAUS, title: " Fahrerhaus" },
];

async function renderField(value: string | null, loadOptions = jest.fn(async () => options)) {
  const onChange = jest.fn();
  render(<StartPointField value={value} onChange={onChange} loadOptions={loadOptions} />);
  await act(async () => undefined);
  return onChange;
}

describe("StartPointField", () => {
  it("bietet die Menüpunkte als Liste an und meldet die Wahl", async () => {
    const onChange = await renderField(null);

    fireEvent.change(screen.getByRole("combobox"), { target: { value: FAHRERHAUS } });

    expect(onChange).toHaveBeenCalledWith(FAHRERHAUS);
  });

  it("zeigt einen gespeicherten Startpunkt, den die Liste nicht kennt, in der Eingabe", async () => {
    await renderField("6a58dd4eefeacc1239d9fd0b");

    expect(screen.getByRole("textbox", { name: START_POINT_MESSAGES.manualLabel })).toHaveValue("6a58dd4eefeacc1239d9fd0b");
  });

  it("nimmt von Hand eine Seitenadresse und liest die Menü-ID daraus", async () => {
    const onChange = await renderField(null, jest.fn(async () => []));

    fireEvent.change(screen.getByRole("textbox", { name: START_POINT_MESSAGES.manualLabel }), {
      target: { value: `https://www.mti.man/content/page/${FAHRERHAUS}` },
    });

    expect(onChange).toHaveBeenLastCalledWith(FAHRERHAUS);
  });
});
