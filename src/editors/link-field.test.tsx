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
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LinkField } from "./link-field";

jest.mock("../page-catalog", () => ({
  pageCatalogSource: {
    fetchList: jest.fn().mockResolvedValue([{ id: "1", title: "Laden zu Hause", url: "/content/pages/1" }]),
    toOption: (raw: { id: string; title: string; url: string }) => ({
      id: raw.id,
      title: raw.title,
      href: raw.url,
    }),
  },
}));

describe("LinkField", () => {
  it("ist ohne Link leer und legt auf Wunsch einen an", async () => {
    const onChange = jest.fn();
    render(<LinkField link={undefined} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /Link hinzufügen/ }));
    expect(onChange).toHaveBeenCalledWith({ kind: "page", href: "" });
  });

  it("bietet die Seiten des Systems an und übernimmt Adresse und Titel", async () => {
    const onChange = jest.fn();
    render(<LinkField link={{ kind: "page", href: "" }} onChange={onChange} />);
    await waitFor(() => expect(screen.getByRole("option", { name: "Laden zu Hause" })).toBeInTheDocument());
    fireEvent.change(screen.getByLabelText(/Ziel/), { target: { value: "1" } });
    expect(onChange).toHaveBeenCalledWith({
      kind: "page",
      href: "/content/pages/1",
      title: "Laden zu Hause",
    });
  });

  it("nimmt eine eigene Adresse als „url“ auf — die geht später in einen neuen Tab", async () => {
    const onChange = jest.fn();
    render(<LinkField link={{ kind: "url", href: "https://example.test" }} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText(/Adresse/), { target: { value: "https://example.test/neu" } });
    expect(onChange).toHaveBeenCalledWith({ kind: "url", href: "https://example.test/neu" });
  });

  it("sagt, dass eigene Adressen in einem neuen Tab aufgehen", () => {
    render(<LinkField link={{ kind: "url", href: "https://example.test" }} onChange={jest.fn()} />);
    expect(screen.getByText(/neuem Tab/i)).toBeInTheDocument();
  });

  it("lässt die Beschriftung des Buttons setzen und zeigt sonst die Vorgabe an", () => {
    const onChange = jest.fn();
    render(<LinkField link={{ kind: "page", href: "/a" }} onChange={onChange} />);
    const label = screen.getByLabelText(/Beschriftung/);
    expect(label).toHaveAttribute("placeholder", "Seite öffnen");
    fireEvent.change(label, { target: { value: "Mehr zum Laden" } });
    expect(onChange).toHaveBeenCalledWith({ kind: "page", href: "/a", label: "Mehr zum Laden" });
  });

  it("nimmt den Link wieder heraus", () => {
    const onChange = jest.fn();
    render(<LinkField link={{ kind: "page", href: "/a" }} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /Link entfernen/ }));
    expect(onChange).toHaveBeenCalledWith(undefined);
  });
});
