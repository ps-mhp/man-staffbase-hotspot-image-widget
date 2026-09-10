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
import { HotspotMarker } from "./hotspot-marker";
import { HotspotPoint } from "./points-model";

const point: HotspotPoint = { id: "p1", x: 25, y: 60, title: "Ladeanschluss" };

describe("HotspotMarker", () => {
  it("sitzt auf seinen Prozentkoordinaten", () => {
    render(
      <HotspotMarker point={point} index={0} mode="dots" open={false} controls="box" onToggle={jest.fn()} />,
    );
    expect(screen.getByRole("button")).toHaveStyle({ left: "25%", top: "60%" });
  });

  it("trägt im nummerierten Modus seine Nummer sichtbar", () => {
    render(
      <HotspotMarker point={point} index={2} mode="numbered" open={false} controls="box" onToggle={jest.fn()} />,
    );
    expect(screen.getByRole("button")).toHaveTextContent("3");
  });

  it("nennt sich auch im Punkte-Modus beim Titel, wo keine Nummer steht", () => {
    render(
      <HotspotMarker point={point} index={0} mode="dots" open={false} controls="box" onToggle={jest.fn()} />,
    );
    expect(screen.getByRole("button", { name: "Ladeanschluss" })).toBeInTheDocument();
  });

  it("sagt an, was es auf- und zuklappt", () => {
    render(
      <HotspotMarker point={point} index={0} mode="numbered" open controls="eintrag-p1" onToggle={jest.fn()} />,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(button).toHaveAttribute("aria-controls", "eintrag-p1");
  });

  it("meldet den Klick", () => {
    const onToggle = jest.fn();
    render(
      <HotspotMarker point={point} index={0} mode="dots" open={false} controls="box" onToggle={onToggle} />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
