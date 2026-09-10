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
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LinkField } from "./link-field";
import { pageCatalogSource } from "../page-catalog";

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

/**
 * Reicht die Antwort des Katalogs durch, solange die Komponente noch hängt.
 *
 * Tests, die nicht ohnehin auf den Katalog warten, enden sonst vor dessen
 * Antwort; React meldet dann zu Recht „not wrapped in act". Solches Rauschen
 * verdeckt echte Warnungen, deshalb wird hier ausdrücklich abgewartet.
 */
async function catalogSettled(): Promise<void> {
  await act(async () => {});
}

describe("LinkField", () => {
  it("ist ohne Link leer und legt auf Wunsch einen an", async () => {
    const onChange = jest.fn();
    render(<LinkField link={undefined} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /Link hinzufügen/ }));
    expect(onChange).toHaveBeenCalledWith({ kind: "page", href: "" });
    await catalogSettled();
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
    await catalogSettled();
  });

  it("sagt, dass eigene Adressen in einem neuen Tab aufgehen", async () => {
    render(<LinkField link={{ kind: "url", href: "https://example.test" }} onChange={jest.fn()} />);
    expect(screen.getByText(/neuem Tab/i)).toBeInTheDocument();
    await catalogSettled();
  });

  it("lässt die Beschriftung des Buttons setzen und zeigt sonst die Vorgabe an", async () => {
    const onChange = jest.fn();
    render(<LinkField link={{ kind: "page", href: "/a" }} onChange={onChange} />);
    const label = screen.getByLabelText(/Beschriftung/);
    expect(label).toHaveAttribute("placeholder", "Seite öffnen");
    fireEvent.change(label, { target: { value: "Mehr zum Laden" } });
    expect(onChange).toHaveBeenCalledWith({ kind: "page", href: "/a", label: "Mehr zum Laden" });
    await catalogSettled();
  });

  it("nimmt den Link wieder heraus", async () => {
    const onChange = jest.fn();
    render(<LinkField link={{ kind: "page", href: "/a" }} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /Link entfernen/ }));
    expect(onChange).toHaveBeenCalledWith(undefined);
    await catalogSettled();
  });
});

/**
 * Ein Katalog, der nichts liefert -- weil die Anfrage fehlschlug oder das
 * System keine Seiten hat. Der `EntityPicker` ruft dann von sich aus
 * `onManual`, ohne dass jemand etwas angeklickt hätte.
 */
describe("LinkField, wenn der Katalog leer bleibt", () => {
  beforeEach(() => {
    (pageCatalogSource.fetchList as jest.Mock).mockResolvedValue([]);
  });

  afterEach(() => {
    (pageCatalogSource.fetchList as jest.Mock).mockResolvedValue([
      { id: "1", title: "Laden zu Hause", url: "/content/pages/1" },
    ]);
  });

  it("rührt einen bestehenden Seitenlink nicht an", async () => {
    // Das blosse Öffnen des Editors darf nichts speichern. Täte es das, wären
    // Adresse und Titel weg, bevor die Redaktion überhaupt etwas anfasst -- und
    // der Link öffnete danach in einem neuen Tab statt im Fenster über dem Bild.
    const onChange = jest.fn();
    render(
      <LinkField
        link={{ kind: "page", href: "/content/pages/7", title: "Laden unterwegs" }}
        onChange={onChange}
      />,
    );
    await waitFor(() => expect(screen.getByLabelText(/Adresse/)).toBeInTheDocument());
    expect(onChange).not.toHaveBeenCalled();
  });

  it("bietet stattdessen die Eingabe von Hand an, mit der bisherigen Adresse", async () => {
    render(
      <LinkField link={{ kind: "page", href: "/content/pages/7" }} onChange={jest.fn()} />,
    );
    await waitFor(() =>
      expect(screen.getByLabelText(/Adresse/)).toHaveValue("/content/pages/7"),
    );
  });
});

describe("LinkField, wenn die gespeicherte Seite nicht mehr im Katalog steht", () => {
  it("sagt es, statt das Feld leer aussehen zu lassen", async () => {
    // Sonst stünde dort „Seite auswählen …", als wäre nie etwas gesetzt worden
    // -- und der nächste Klick überschriebe den Link stillschweigend.
    render(
      <LinkField link={{ kind: "page", href: "/content/pages/999" }} onChange={jest.fn()} />,
    );
    const hint = await screen.findByTestId("link-field-orphaned");
    expect(hint).toHaveTextContent("/content/pages/999");
  });
});
