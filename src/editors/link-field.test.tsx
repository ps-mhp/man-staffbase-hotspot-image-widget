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
import { PageOption } from "@shared/staffbase/pages";

import { HotspotLink } from "../points-model";
import { LINK_MESSAGES, LinkField } from "./link-field";

const pages: PageOption[] = [
  { id: "1", title: "Laden zu Hause", href: "/content/page/1", menuId: "1" },
  { id: "2", title: "Speiseplan", href: "/content/page/2", menuId: "2" },
];

async function renderField(link: HotspotLink | undefined, load = async () => pages): Promise<jest.Mock> {
  const onChange = jest.fn();
  render(<LinkField link={link} onChange={onChange} load={load} />);
  await act(async () => undefined);
  return onChange;
}

const choose = async (option: string): Promise<void> => {
  await userEvent.click(screen.getByTestId("link-field-target"));
  await userEvent.click(await screen.findByRole("option", { name: option }));
};

describe("LinkField", () => {
  it("steht ohne Link auf „Kein Link“ und ohne Beschriftung", async () => {
    await renderField(undefined);

    expect(screen.getByTestId("link-field-target")).toHaveTextContent(LINK_MESSAGES.none);
    expect(screen.queryByTestId("link-field-label")).toBeNull();
  });

  it("übernimmt aus der Liste Adresse und Titel einer Seite", async () => {
    const onChange = await renderField(undefined);

    await choose("Speiseplan");

    expect(onChange).toHaveBeenCalledWith({ kind: "page", href: "/content/page/2", title: "Speiseplan" });
  });

  it("nimmt den Link über „Kein Link“ wieder heraus", async () => {
    const onChange = await renderField({ kind: "page", href: "/content/page/2", title: "Speiseplan" });

    expect(screen.getByTestId("link-field-target")).toHaveTextContent("Speiseplan");
    await choose(LINK_MESSAGES.none);

    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it("schreibt bei „Eigene Adresse“ erst, wenn getippt wird – als „url“", async () => {
    const onChange = await renderField(undefined);

    await choose(LINK_MESSAGES.manual);
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.change(screen.getByTestId("link-field-address"), { target: { value: "https://man.eu" } });

    expect(onChange).toHaveBeenCalledWith({ kind: "url", href: "https://man.eu" });
    expect(screen.getByText(LINK_MESSAGES.addressHint)).toBeInTheDocument();
  });

  it("setzt die Beschriftung des Buttons und behält sie beim Seitenwechsel", async () => {
    const onChange = await renderField({ kind: "page", href: "/content/page/1", title: "Laden zu Hause", label: "Mehr" });

    fireEvent.change(screen.getByTestId("link-field-label"), { target: { value: "Zum Laden" } });
    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ label: "Zum Laden" }));

    await choose("Speiseplan");
    expect(onChange).toHaveBeenLastCalledWith({ kind: "page", href: "/content/page/2", title: "Speiseplan", label: "Mehr" });
  });

  it("sagt es, wenn die gespeicherte Seite nicht in der Liste steht, statt sie zu überschreiben", async () => {
    const onChange = await renderField({ kind: "page", href: "/content/page/9", title: "Alt" });

    expect(screen.getByText(LINK_MESSAGES.orphaned("/content/page/9"))).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("bietet ohne Seitenliste die Adresse von Hand an, ohne einen Seitenlink anzurühren", async () => {
    const onChange = await renderField({ kind: "page", href: "/content/page/1" }, async () => []);

    expect(screen.getByTestId("link-field-address")).toHaveValue("/content/page/1");
    expect(screen.getByText(LINK_MESSAGES.unavailable)).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("führt von einer eigenen Adresse zurück zur Liste", async () => {
    const onChange = await renderField({ kind: "url", href: "https://man.eu", label: "Los" });

    await userEvent.click(screen.getByRole("button", { name: LINK_MESSAGES.backToList }));

    expect(onChange).toHaveBeenCalledWith({ kind: "page", href: "", label: "Los" });
  });
});
