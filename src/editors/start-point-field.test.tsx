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
import userEvent from "@testing-library/user-event";

import { START_POINT_MESSAGES, StartPointField, useStartPointState } from "./start-point-field";

const FAHRERHAUS = "6a58dd4eefeacc1239d9fd09";
const options = [
  { id: FAHRERHAUS, title: "Fahrerhaus" },
  { id: "6a73580860fe1414378d4660", title: " Fahrerarbeitsplatz" },
];

function Harnessed({ value, onChange, load }: { value: string | null; onChange: jest.Mock; load: () => Promise<typeof options> }) {
  const state = useStartPointState(value, load);
  return <StartPointField value={value} onChange={onChange} state={state} />;
}

async function renderField(value: string | null, load = async () => options): Promise<jest.Mock> {
  const onChange = jest.fn();
  render(<Harnessed value={value} onChange={onChange} load={load} />);
  await act(async () => undefined);
  return onChange;
}

describe("StartPointField", () => {
  it("bietet die Einträge des Menüs als Liste an", async () => {
    const onChange = await renderField(null);

    await userEvent.click(screen.getByTestId("start-point-select"));
    await userEvent.click(await screen.findByRole("option", { name: "Fahrerhaus" }));

    expect(onChange).toHaveBeenCalledWith(FAHRERHAUS);
  });

  it("nimmt von Hand auch die Adresse einer Seite", async () => {
    const onChange = await renderField(null);

    await userEvent.click(screen.getByTestId("start-point-select"));
    await userEvent.click(await screen.findByRole("option", { name: START_POINT_MESSAGES.manualOption }));
    fireEvent.change(screen.getByTestId("start-point-manual"), { target: { value: `/content/page/${FAHRERHAUS}` } });

    expect(onChange).toHaveBeenLastCalledWith(FAHRERHAUS);
  });

  it("zeigt einen Startpunkt, den die Liste nicht kennt, in der Eingabe", async () => {
    await renderField("6a7358b8340cb013d7f29611");

    expect(screen.getByTestId("start-point-manual")).toHaveValue("6a7358b8340cb013d7f29611");
  });

  it("behält, was getippt ist, auch wenn das Feld neu eingehängt wird", async () => {
    const load = jest.fn(async () => options);
    function Remounting(): React.ReactElement {
      const [key, setKey] = React.useState(0);
      const state = useStartPointState(null, load);
      return (
        <>
          <button type="button" onClick={() => setKey((value) => value + 1)}>
            neu
          </button>
          <StartPointField key={key} value={null} onChange={jest.fn()} state={state} />
        </>
      );
    }
    render(<Remounting />);
    await act(async () => undefined);
    await userEvent.click(screen.getByTestId("start-point-select"));
    await userEvent.click(await screen.findByRole("option", { name: START_POINT_MESSAGES.manualOption }));
    fireEvent.change(screen.getByTestId("start-point-manual"), { target: { value: "6a58" } });

    await userEvent.click(screen.getByRole("button", { name: "neu" }));

    expect(screen.getByTestId("start-point-manual")).toHaveValue("6a58");
    expect(load).toHaveBeenCalledTimes(1);
  });

  it("sagt, dass das Menü nicht geladen werden konnte", async () => {
    await renderField(null, async () => []);

    expect(screen.getByText(START_POINT_MESSAGES.unavailableNotice)).toBeInTheDocument();
  });
});
