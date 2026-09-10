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
import { PlacementCanvas } from "./placement-canvas";
import { HotspotPoint } from "../points-model";

const image = { url: "https://example.test/a.jpg", alt: "Ein Auto" };
const points: HotspotPoint[] = [{ id: "p1", x: 50, y: 50, title: "Ladeanschluss" }];

/** jsdom misst nicht — die Bühne bekommt feste Maße untergeschoben. */
const measure = (element: Element) => {
  element.getBoundingClientRect = () =>
    ({ left: 0, top: 0, width: 400, height: 200, right: 400, bottom: 200, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;
};

const renderCanvas = (overrides: Partial<React.ComponentProps<typeof PlacementCanvas>> = {}) => {
  const view = render(
    <PlacementCanvas
      image={image}
      points={points}
      selectedId={null}
      onAdd={jest.fn()}
      onMove={jest.fn()}
      onSelect={jest.fn()}
      {...overrides}
    />,
  );
  const stage = screen.getByTestId("placement-canvas");
  measure(stage);
  return view;
};

describe("PlacementCanvas", () => {
  it("legt beim Klick ins Bild einen Punkt an der Stelle an", () => {
    const onAdd = jest.fn();
    renderCanvas({ onAdd });
    fireEvent.click(screen.getByTestId("placement-canvas"), { clientX: 100, clientY: 50 });
    expect(onAdd).toHaveBeenCalledWith(25, 25);
  });

  it("legt keinen Punkt an, wenn der Klick einen Marker traf", () => {
    const onAdd = jest.fn();
    const onSelect = jest.fn();
    renderCanvas({ onAdd, onSelect });
    fireEvent.click(screen.getByTestId("place-marker-p1"), { clientX: 200, clientY: 100 });
    expect(onAdd).not.toHaveBeenCalled();
    expect(onSelect).toHaveBeenCalledWith("p1");
  });

  // Der Marker ruft onSelect ursprünglich sowohl bei onPointerDown als auch bei
  // onClick auf. Im echten Browser feuert nach pointerdown/pointerup auf
  // demselben Button in aller Regel auch click — beide Aufrufe träfen also
  // zusammen. Das ist bei einem reinen Zustands-Setter zwar folgenlos, aber
  // unnötig und ein Signal für zwei Zuständigkeiten an einer Stelle. Diese
  // Bühne wählt genau einen Auslöser (siehe Begründung in placement-canvas.tsx)
  // und muss deshalb pro Klick auch nur genau einmal auswählen.
  it("wählt bei einem einfachen Klick genau einmal aus, nicht doppelt über PointerDown und Click", () => {
    const onSelect = jest.fn();
    renderCanvas({ onSelect });
    const marker = screen.getByTestId("place-marker-p1");
    marker.setPointerCapture = jest.fn();
    marker.releasePointerCapture = jest.fn();

    // Ein echter Klick ohne Bewegung: pointerdown, pointerup, click — wie im Browser.
    fireEvent.pointerDown(marker, { clientX: 200, clientY: 100, pointerId: 1 });
    fireEvent.pointerUp(marker, { pointerId: 1 });
    fireEvent.click(marker, { clientX: 200, clientY: 100 });

    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("schiebt einen Marker mit dem Zeiger", () => {
    const onMove = jest.fn();
    renderCanvas({ onMove });
    const marker = screen.getByTestId("place-marker-p1");
    marker.setPointerCapture = jest.fn();
    marker.releasePointerCapture = jest.fn();

    fireEvent.pointerDown(marker, { clientX: 200, clientY: 100, pointerId: 1 });
    fireEvent.pointerMove(marker, { clientX: 300, clientY: 150, pointerId: 1 });
    fireEvent.pointerUp(marker, { pointerId: 1 });

    expect(onMove).toHaveBeenLastCalledWith("p1", 75, 75);
  });

  it("verschiebt mit den Pfeiltasten um ein Prozent — genauer als mit der Maus", () => {
    const onMove = jest.fn();
    renderCanvas({ onMove });
    const marker = screen.getByTestId("place-marker-p1");
    fireEvent.keyDown(marker, { key: "ArrowRight" });
    expect(onMove).toHaveBeenCalledWith("p1", 51, 50);
    fireEvent.keyDown(marker, { key: "ArrowUp" });
    expect(onMove).toHaveBeenCalledWith("p1", 50, 49);
  });

  it("hebt den ausgewählten Punkt optisch über die Klasse hervor", () => {
    renderCanvas({ selectedId: "p1" });
    expect(screen.getByTestId("place-marker-p1")).toHaveClass("man-hie__canvas-marker--selected");
  });

  // Eine CSS-Klasse allein prüft kein Verhalten und sagt einer Vorlesesoftware
  // nichts über die Auswahl. aria-pressed macht den Umschalt-Zustand des
  // Markers (ausgewählt / nicht ausgewählt) auch programmatisch benennbar.
  it("benennt die Auswahl zusätzlich über aria-pressed, damit Screenreader sie ansagen", () => {
    const { rerender } = renderCanvas({ selectedId: null });
    expect(screen.getByTestId("place-marker-p1")).toHaveAttribute("aria-pressed", "false");

    rerender(
      <PlacementCanvas
        image={image}
        points={points}
        selectedId="p1"
        onAdd={jest.fn()}
        onMove={jest.fn()}
        onSelect={jest.fn()}
      />,
    );
    expect(screen.getByTestId("place-marker-p1")).toHaveAttribute("aria-pressed", "true");
  });
});
