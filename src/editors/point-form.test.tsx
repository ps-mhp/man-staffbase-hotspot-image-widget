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
import { fireEvent, render, screen } from "@testing-library/react";
import { PointForm } from "./point-form";
import { HotspotPoint } from "../points-model";

jest.mock("./link-field", () => ({
  LinkField: () => <div data-testid="link-field" />,
}));

const point: HotspotPoint = { id: "p1", x: 25, y: 60, title: "Ladeanschluss" };

describe("PointForm", () => {
  it("zeigt Titel und Beschreibung und meldet Änderungen", () => {
    const onChange = jest.fn();
    render(<PointForm point={point} onChange={onChange} onRemove={jest.fn()} />);

    fireEvent.change(screen.getByLabelText(/Titel/), { target: { value: "Ladeklappe" } });
    expect(onChange).toHaveBeenCalledWith({ ...point, title: "Ladeklappe" });

    fireEvent.change(screen.getByLabelText(/Beschreibung/), { target: { value: "CCS." } });
    expect(onChange).toHaveBeenCalledWith({ ...point, description: "CCS." });
  });

  it("löscht die Beschreibung, statt sie leer zu speichern", () => {
    const onChange = jest.fn();
    render(
      <PointForm point={{ ...point, description: "CCS." }} onChange={onChange} onRemove={jest.fn()} />,
    );
    fireEvent.change(screen.getByLabelText(/Beschreibung/), { target: { value: "" } });
    expect(onChange).toHaveBeenCalledWith(point);
  });

  it("weist auf den fehlenden Titel hin — ohne ihn fällt der Punkt beim Lesen weg", () => {
    const { rerender } = render(
      <PointForm point={{ ...point, title: "" }} onChange={jest.fn()} onRemove={jest.fn()} />,
    );
    expect(screen.getByTestId("point-form-warning")).toBeInTheDocument();

    // Der Gegensatz gehört dazu: ohne ihn bliebe der Test auch dann grün,
    // wenn der Hinweis immer stünde.
    rerender(<PointForm point={point} onChange={jest.fn()} onRemove={jest.fn()} />);
    expect(screen.queryByTestId("point-form-warning")).not.toBeInTheDocument();
  });

  it("löscht den Punkt", () => {
    const onRemove = jest.fn();
    render(<PointForm point={point} onChange={jest.fn()} onRemove={onRemove} />);
    fireEvent.click(screen.getByRole("button", { name: /Punkt löschen/ }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("ordnet den Warnhinweis dem Titelfeld zu, statt ihn nur danebenzustellen", () => {
    // Ohne die Zuordnung liest ein Screenreader beim Betreten des Feldes
    // nichts vor -- der Hinweis stünde dann nur für Sehende da.
    render(<PointForm point={{ id: "p1", x: 10, y: 10, title: "" }} onChange={jest.fn()} onRemove={jest.fn()} />);
    const title = screen.getByLabelText(/Titel/);
    expect(title).toHaveAccessibleDescription(/nicht übernehmen/);
    expect(title).toBeInvalid();
  });
});
