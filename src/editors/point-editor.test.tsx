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
import { PointEditor } from "./point-editor";
import { HotspotPoint } from "../points-model";

jest.mock("./image-field", () => ({
  ImageField: ({ onChange }: { onChange: (image: unknown) => void }) => (
    <button type="button" onClick={() => onChange({ url: "https://example.test/a.jpg", alt: "" })}>
      Bild setzen
    </button>
  ),
}));
jest.mock("./link-field", () => ({ LinkField: () => <div data-testid="link-field" /> }));

const image = { url: "https://example.test/a.jpg", alt: "Ein Auto" };
jest.mock("./use-image-attribute", () => ({
  readImageAttribute: jest.fn(() => image),
  writeImageAttribute: jest.fn(() => true),
}));

const points: HotspotPoint[] = [{ id: "p1", x: 25, y: 60, title: "Ladeanschluss" }];

const renderEditor = (overrides: Partial<React.ComponentProps<typeof PointEditor>> = {}) =>
  render(
    <PointEditor
      value={points}
      onChange={jest.fn()}
      onSave={jest.fn()}
      onClose={jest.fn()}
      dirty={false}
      {...overrides}
    />,
  );

describe("PointEditor", () => {
  it("fordert zuerst ein Bild an, wenn keines gewählt ist", () => {
    const { readImageAttribute } = jest.requireMock("./use-image-attribute");
    readImageAttribute.mockReturnValueOnce(null);
    renderEditor({ value: [] });
    expect(screen.getByTestId("point-editor-needs-image")).toBeInTheDocument();
    expect(screen.queryByTestId("placement-canvas")).not.toBeInTheDocument();
  });

  it("zeigt die Bühne, sobald ein Bild da ist", () => {
    renderEditor();
    expect(screen.getByTestId("placement-canvas")).toBeInTheDocument();
  });

  it("legt beim Klick ins Bild einen Punkt an und wählt ihn aus", () => {
    const onChange = jest.fn();
    renderEditor({ onChange });
    const stage = screen.getByTestId("placement-canvas");
    stage.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 400, height: 200, right: 400, bottom: 200, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;
    fireEvent.click(stage, { clientX: 200, clientY: 100 });

    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ x: 50, y: 50, title: "" })]),
    );
  });

  it("schreibt das Bild in sein eigenes Attribut — der Editor hängt nur am Punktefeld", () => {
    const { writeImageAttribute } = jest.requireMock("./use-image-attribute");
    renderEditor();
    fireEvent.click(screen.getByRole("button", { name: "Bild setzen" }));
    expect(writeImageAttribute).toHaveBeenCalledWith(
      expect.objectContaining({ url: "https://example.test/a.jpg" }),
    );
  });

  it("legt nicht mehr als die Höchstzahl an Punkten an", () => {
    const many: HotspotPoint[] = Array.from({ length: 20 }, (_, index) => ({
      id: `p${index}`,
      x: 10,
      y: 10,
      title: `Punkt ${index}`,
    }));
    const onChange = jest.fn();
    renderEditor({ value: many, onChange });
    const stage = screen.getByTestId("placement-canvas");
    stage.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 400, height: 200, right: 400, bottom: 200, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;
    fireEvent.click(stage, { clientX: 200, clientY: 100 });
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByTestId("point-editor-full")).toBeInTheDocument();
  });

  it("verschiebt einen Punkt in der Reihenfolge — sie bestimmt die Nummern", () => {
    const two: HotspotPoint[] = [
      ...points,
      { id: "p2", x: 80, y: 30, title: "Kofferraum" },
    ];
    const onChange = jest.fn();
    renderEditor({ value: two, onChange });
    fireEvent.click(screen.getByTestId("place-marker-p1"));
    fireEvent.click(screen.getByRole("button", { name: "Nach unten" }));
    expect(onChange).toHaveBeenCalledWith([two[1], two[0]]);
  });

  it("lässt den ersten Punkt nicht weiter nach oben", () => {
    renderEditor();
    fireEvent.click(screen.getByTestId("place-marker-p1"));
    expect(screen.getByRole("button", { name: "Nach oben" })).toBeDisabled();
  });

  it("löscht den ausgewählten Punkt", () => {
    const onChange = jest.fn();
    renderEditor({ onChange });
    fireEvent.click(screen.getByTestId("place-marker-p1"));
    fireEvent.click(screen.getByRole("button", { name: /Punkt löschen/ }));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("speichert und schließt", () => {
    const onSave = jest.fn();
    const onClose = jest.fn();
    renderEditor({ onSave, onClose });
    fireEvent.click(screen.getByRole("button", { name: "Übernehmen" }));
    expect(onSave).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: "Abbrechen" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("legt das Stylesheet als Stil an, nicht als Text ins Fenster", () => {
    // `useHotStyle` liefert eine Zeichenkette. Direkt in den Baum gerendert
    // stünde das ganze Stylesheet lesbar im Dialog, und der Editor verlöre
    // sein Layout.
    const { container } = renderEditor();
    expect(container.querySelector("style")).not.toBeNull();
    expect(screen.queryByText(/man-hie__layout/)).not.toBeInTheDocument();
  });

  it("zeigt kein Bild an, das sich nicht speichern liess", () => {
    // Sonst setzte die Redaktion Punkte auf eine Fläche, die nach dem
    // Übernehmen gar nicht da ist.
    const { readImageAttribute, writeImageAttribute } = jest.requireMock("./use-image-attribute");
    readImageAttribute.mockReturnValueOnce(null);
    writeImageAttribute.mockReturnValueOnce(false);
    renderEditor({ value: [] });
    fireEvent.click(screen.getByRole("button", { name: "Bild setzen" }));
    expect(screen.getByTestId("point-editor-image-failed")).toBeInTheDocument();
    expect(screen.queryByTestId("placement-canvas")).not.toBeInTheDocument();
  });

  it("lässt einen Punkt ohne Titel nicht übernehmen", () => {
    // `readPoint` verwirft titellose Punkte beim nächsten Lesen -- mitsamt
    // Beschreibung und Link. Ohne diesen Riegel verschwände die Arbeit
    // stillschweigend zwischen Speichern und Wiederöffnen.
    const onSave = jest.fn();
    renderEditor({ value: [{ id: "p1", x: 25, y: 60, title: "" }], onSave });
    const apply = screen.getByRole("button", { name: "Übernehmen" });
    expect(apply).toBeDisabled();
    fireEvent.click(apply);
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByTestId("point-editor-untitled")).toBeInTheDocument();
  });

  it("lässt übernehmen, sobald jeder Punkt einen Titel hat", () => {
    const onSave = jest.fn();
    renderEditor({ onSave });
    fireEvent.click(screen.getByRole("button", { name: "Übernehmen" }));
    expect(onSave).toHaveBeenCalled();
  });
});
