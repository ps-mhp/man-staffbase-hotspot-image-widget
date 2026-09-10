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
import { HotspotList } from "./hotspot-list";
import { HotspotPoint } from "./points-model";

const points: HotspotPoint[] = [
  { id: "p1", x: 10, y: 10, title: "Ladeanschluss", description: "CCS, bis 350 kW." },
  { id: "p2", x: 80, y: 40, title: "Kofferraum", link: { kind: "page", href: "/a" } },
];

const renderList = (overrides: Partial<React.ComponentProps<typeof HotspotList>> = {}) =>
  render(
    <HotspotList
      points={points}
      openId={null}
      panelId={(id) => `panel-${id}`}
      onToggle={jest.fn()}
      onOpenLink={jest.fn()}
      {...overrides}
    />,
  );

describe("HotspotList", () => {
  it("nummeriert die Einträge in der Reihenfolge der Punkte", () => {
    renderList();
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveTextContent("1");
    expect(buttons[0]).toHaveTextContent("Ladeanschluss");
    expect(buttons[1]).toHaveTextContent("2");
  });

  it("hält die Beschreibung zu, solange der Eintrag nicht offen ist", () => {
    renderList();
    expect(screen.queryByText("CCS, bis 350 kW.")).not.toBeInTheDocument();
  });

  it("klappt den offenen Eintrag auf", () => {
    renderList({ openId: "p1" });
    expect(screen.getByText("CCS, bis 350 kW.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Ladeanschluss/ })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("nennt die Klappe, die der Kopf steuert — dieselbe id wie am Marker", () => {
    renderList({ openId: "p1" });
    expect(screen.getByRole("button", { name: /Ladeanschluss/ })).toHaveAttribute(
      "aria-controls",
      "panel-p1",
    );
  });

  it("meldet den Klick auf den Kopf", () => {
    const onToggle = jest.fn();
    renderList({ onToggle });
    fireEvent.click(screen.getByRole("button", { name: /Kofferraum/ }));
    expect(onToggle).toHaveBeenCalledWith("p2");
  });

  it("zeigt den Button des offenen Eintrags und meldet den Klick", () => {
    const onOpenLink = jest.fn();
    renderList({ openId: "p2", onOpenLink });
    fireEvent.click(screen.getByRole("button", { name: "Seite öffnen" }));
    expect(onOpenLink).toHaveBeenCalledWith(points[1]);
  });
});
