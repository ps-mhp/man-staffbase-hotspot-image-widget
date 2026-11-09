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

import { HotspotImage, HotspotPoint } from "../points-model";
import { ManualPanel, untitledCount } from "./manual-panel";

jest.mock("./image-field", () => ({
  ImageField: ({
    onChange,
    onAltChange,
    alt,
  }: {
    onChange: (image: unknown) => void;
    onAltChange: (alt: string) => void;
    alt: string;
  }) => (
    <div data-testid="image-field" data-alt={alt}>
      <button type="button" onClick={() => onChange({ url: "https://example.test/b.jpg", alt: "" })}>
        Bild setzen
      </button>
      <button type="button" onClick={() => onAltChange("Neuer Text")}>
        Text setzen
      </button>
    </div>
  ),
}));
jest.mock("./link-field", () => ({ LinkField: () => <div data-testid="link-field" /> }));

const image: HotspotImage = { url: "https://example.test/a.jpg", alt: "Ein Auto" };
const points: HotspotPoint[] = [{ id: "p1", x: 25, y: 60, title: "Ladeanschluss" }];

function renderPanel(overrides: Partial<React.ComponentProps<typeof ManualPanel>> = {}) {
  const props = {
    image,
    onImageChange: jest.fn(),
    points,
    onPointsChange: jest.fn(),
    ...overrides,
  };
  render(<ManualPanel {...props} />);
  return props;
}

function clickStage(): void {
  const stage = screen.getByTestId("placement-canvas");
  stage.getBoundingClientRect = () =>
    ({ left: 0, top: 0, width: 400, height: 200, right: 400, bottom: 200, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;
  fireEvent.click(stage, { clientX: 200, clientY: 100 });
}

describe("ManualPanel", () => {
  it("fordert zuerst ein Bild an, wenn keines gewählt ist", () => {
    renderPanel({ image: null, points: [] });
    expect(screen.getByTestId("point-editor-needs-image")).toBeInTheDocument();
    expect(screen.queryByTestId("placement-canvas")).not.toBeInTheDocument();
  });

  it("legt beim Klick ins Bild einen Punkt an", () => {
    const { onPointsChange } = renderPanel();
    clickStage();
    expect(onPointsChange).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ x: 50, y: 50, title: "" })]),
    );
  });

  it("gibt ein gewähltes Bild und seinen Alternativtext an den Entwurf", () => {
    const { onImageChange } = renderPanel();
    fireEvent.click(screen.getByRole("button", { name: "Bild setzen" }));
    expect(onImageChange).toHaveBeenCalledWith({ url: "https://example.test/b.jpg", alt: "" });
    fireEvent.click(screen.getByRole("button", { name: "Text setzen" }));
    expect(onImageChange).toHaveBeenCalledWith({ ...image, alt: "Neuer Text" });
    expect(screen.getByTestId("image-field")).toHaveAttribute("data-alt", "Ein Auto");
  });

  it("legt nicht mehr als die Höchstzahl an Punkten an", () => {
    const many: HotspotPoint[] = Array.from({ length: 20 }, (_, index) => ({ id: `p${index}`, x: 10, y: 10, title: `P${index}` }));
    const { onPointsChange } = renderPanel({ points: many });
    clickStage();
    expect(onPointsChange).not.toHaveBeenCalled();
    expect(screen.getByTestId("point-editor-full")).toBeInTheDocument();
  });

  it("verschiebt einen Punkt in der Reihenfolge — sie bestimmt die Nummern", () => {
    const two: HotspotPoint[] = [...points, { id: "p2", x: 80, y: 30, title: "Kofferraum" }];
    const { onPointsChange } = renderPanel({ points: two });
    fireEvent.click(screen.getByTestId("place-marker-p1"));
    fireEvent.click(screen.getByRole("button", { name: "Nach unten" }));
    expect(onPointsChange).toHaveBeenCalledWith([two[1], two[0]]);
  });

  it("lässt den ersten Punkt nicht weiter nach oben", () => {
    renderPanel();
    fireEvent.click(screen.getByTestId("place-marker-p1"));
    expect(screen.getByRole("button", { name: "Nach oben" })).toBeDisabled();
  });

  it("löscht den ausgewählten Punkt", () => {
    const { onPointsChange } = renderPanel();
    fireEvent.click(screen.getByTestId("place-marker-p1"));
    fireEvent.click(screen.getByRole("button", { name: /Punkt löschen/ }));
    expect(onPointsChange).toHaveBeenCalledWith([]);
  });

  it("zeigt ohne Punkte einen Hinweis statt einer leeren Liste", () => {
    renderPanel({ points: [] });
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
    expect(screen.getByTestId("point-editor-no-points")).toBeInTheDocument();
  });
});

describe("untitledCount", () => {
  it("zählt Punkte ohne Titel, auch nur aus Leerzeichen", () => {
    expect(untitledCount([...points, { id: "a", x: 1, y: 1, title: "" }, { id: "b", x: 1, y: 1, title: "  " }])).toBe(2);
  });
});
