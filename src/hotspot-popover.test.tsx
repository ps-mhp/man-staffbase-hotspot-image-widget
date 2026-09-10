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
import { HotspotPopover } from "./hotspot-popover";
import { HotspotPoint } from "./points-model";

const point: HotspotPoint = {
  id: "p1",
  x: 50,
  y: 20,
  title: "Ladeanschluss",
  description: "CCS, bis 350 kW.",
};

const renderPopover = (overrides: Partial<React.ComponentProps<typeof HotspotPopover>> = {}) =>
  render(
    <HotspotPopover
      id="popover-p1"
      point={point}
      stage={null}
      centered={false}
      onClose={jest.fn()}
      onOpenLink={jest.fn()}
      {...overrides}
    />,
  );

describe("HotspotPopover", () => {
  it("zeigt Titel und Beschreibung", () => {
    renderPopover();
    expect(screen.getByRole("heading", { name: "Ladeanschluss" })).toBeInTheDocument();
    expect(screen.getByText("CCS, bis 350 kW.")).toBeInTheDocument();
  });

  it("zeigt ohne Link keinen Button", () => {
    renderPopover();
    expect(screen.queryByRole("button", { name: /öffnen/i })).not.toBeInTheDocument();
  });

  it("beschriftet den Button nach dem Punkt", () => {
    renderPopover({
      point: { ...point, link: { kind: "page", href: "/a", label: "Mehr zum Laden" } },
    });
    expect(screen.getByRole("button", { name: "Mehr zum Laden" })).toBeInTheDocument();
  });

  it("fällt auf die Vorgabebeschriftung zurück", () => {
    renderPopover({ point: { ...point, link: { kind: "page", href: "/a" } } });
    expect(screen.getByRole("button", { name: "Seite öffnen" })).toBeInTheDocument();
  });

  it("meldet den Klick auf den Button mit dem Punkt", () => {
    const onOpenLink = jest.fn();
    const linked = { ...point, link: { kind: "page" as const, href: "/a" } };
    renderPopover({ point: linked, onOpenLink });
    fireEvent.click(screen.getByRole("button", { name: "Seite öffnen" }));
    expect(onOpenLink).toHaveBeenCalledWith(linked);
  });

  it("schließt auf Escape — sonst säße das Popover auf Tastatur fest", () => {
    const onClose = jest.fn();
    renderPopover({ onClose });
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("hat einen eigenen Schließen-Knopf, den man auch mit dem Finger trifft", () => {
    const onClose = jest.fn();
    renderPopover({ onClose });
    fireEvent.click(screen.getByRole("button", { name: "Schließen" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("steht auf schmalen Bildschirmen zentriert statt am Punkt", () => {
    renderPopover({ centered: true });
    expect(screen.getByTestId("popover-p1")).toHaveClass("man-hi__popover--centered");
  });

  it("schließt beim Klick daneben", () => {
    const onClose = jest.fn();
    renderPopover({ onClose });
    fireEvent.mouseDown(document.body);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("schließt nicht beim Klick in die Box selbst", () => {
    const onClose = jest.fn();
    renderPopover({ onClose });
    fireEvent.mouseDown(screen.getByRole("heading", { name: "Ladeanschluss" }));
    expect(onClose).not.toHaveBeenCalled();
  });
});
