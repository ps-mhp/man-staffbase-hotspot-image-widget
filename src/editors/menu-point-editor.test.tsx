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
import { act, fireEvent, render, screen, within } from "@testing-library/react";

import { MENU_DEPTH_ATTRIBUTE, MENU_ID_ATTRIBUTE } from "../configuration-schema";
import { MenuHotspotPoint, MenuLayout } from "../menu-points-model";
import { IDS, buildTree } from "../menu/menu-tree-test-data";
import { MAX_POINTS } from "../points-model";
import { MENU_EDITOR_MESSAGES, MenuPointEditor } from "./menu-point-editor";
import { LEVEL_LIST_MESSAGES } from "./menu-level-list";

const cabImage = { url: "https://example.test/kabine.jpg", alt: "Kabine" };

// Die Bildwahl: für tiefere Ebenen ein Knopf, der ein Bild setzt, und einer, der es entfernt.
jest.mock("./image-field", () => ({
  ImageField: ({ image, onChange }: { image: unknown; onChange: (image: unknown) => void }) => (
    <div data-testid="level-image-field" data-has-image={image === null ? "nein" : "ja"}>
      <button type="button" onClick={() => onChange({ url: "https://example.test/kabine.jpg", alt: "Kabine" })}>
        Ebenenbild setzen
      </button>
      <button type="button" onClick={() => onChange(null)}>
        Ebenenbild entfernen
      </button>
    </div>
  ),
}));

const rootImage = { url: "https://example.test/lkw.jpg", alt: "Lkw" };
jest.mock("./use-image-attribute", () => ({
  imageSource: jest.fn(() => "field"),
  readImageAttribute: jest.fn(() => rootImage),
  writeImageAttribute: jest.fn(() => true),
  readImageAlt: jest.fn(() => ""),
  writeImageAlt: jest.fn(() => true),
}));

const fields: Record<string, string> = {};
jest.mock("./config-values", () => ({
  readConfigValue: jest.fn((key: string) => fields[key] ?? null),
}));

beforeEach(() => {
  fields[MENU_ID_ATTRIBUTE] = IDS.fahrerhaus;
  fields[MENU_DEPTH_ATTRIBUTE] = "4";
});

afterEach(() => jest.clearAllMocks());

const point = (menuId: string, x = 10, y = 20): MenuHotspotPoint => ({ id: `p-${menuId}`, menuId, x, y });

async function renderEditor(
  overrides: Partial<React.ComponentProps<typeof MenuPointEditor>> = {},
): Promise<{ onChange: jest.Mock; loadTree: jest.Mock }> {
  const onChange = jest.fn();
  const loadTree = jest.fn(async () => buildTree());
  render(
    <MenuPointEditor
      value={{}}
      onChange={onChange}
      onSave={jest.fn()}
      onClose={jest.fn()}
      dirty={false}
      loadTree={loadTree}
      {...overrides}
    />,
  );
  await act(async () => undefined);
  return { onChange, loadTree: (overrides.loadTree as jest.Mock | undefined) ?? loadTree };
}

function clickCanvas(clientX = 200, clientY = 100): void {
  const stage = screen.getByTestId("placement-canvas");
  stage.getBoundingClientRect = () =>
    ({ left: 0, top: 0, width: 400, height: 200, right: 400, bottom: 200, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;
  fireEvent.click(stage, { clientX, clientY });
}

const item = (menuId: string): HTMLElement => screen.getByTestId(`menu-level-item-${menuId}`);

describe("MenuPointEditor", () => {
  it("liest Startpunkt und Tiefe aus dem Dialog und beginnt auf der Startebene", async () => {
    const { loadTree } = await renderEditor();

    expect(loadTree).toHaveBeenCalledWith(IDS.fahrerhaus, 4);
    expect(screen.getByTestId("menu-editor-level")).toHaveValue(IDS.fahrerhaus);
    expect(within(screen.getByTestId("menu-level-list")).getAllByRole("listitem").map((li) => li.textContent)).toEqual([
      "Fahrerarbeitsplatz›",
      "Ruhebereich",
      "Ausstattung›",
      "Händlersuche",
    ]);
  });

  it("bietet jede Ebene mit Unterpunkten zur Auswahl an", async () => {
    await renderEditor();

    const options = within(screen.getByTestId("menu-editor-level")).getAllByRole("option");
    expect(options.map((option) => option.textContent?.trim())).toEqual(["Fahrerhaus", "Fahrerarbeitsplatz", "Ausstattung"]);
  });

  it("verlangt zuerst einen Startpunkt", async () => {
    delete fields[MENU_ID_ATTRIBUTE];
    const loadTree = jest.fn();

    await renderEditor({ loadTree });

    expect(screen.getByTestId("menu-editor-no-start")).toHaveTextContent(MENU_EDITOR_MESSAGES.noStart);
    expect(loadTree).not.toHaveBeenCalled();
  });

  it("bietet nach einem Fehlschlag einen neuen Versuch an", async () => {
    const loadTree = jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce(buildTree());
    await renderEditor({ loadTree });

    fireEvent.click(within(screen.getByTestId("menu-editor-failed")).getByRole("button"));
    await act(async () => undefined);

    expect(screen.getByTestId("menu-level-list")).toBeInTheDocument();
  });

  it("setzt keinen Punkt, solange kein Unterpunkt gewählt ist", async () => {
    const { onChange } = await renderEditor();

    clickCanvas();

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByTestId("menu-editor-selection")).toHaveTextContent(MENU_EDITOR_MESSAGES.pickFirst);
  });

  it("setzt auf der Startebene den Punkt eines Unterpunkts", async () => {
    const { onChange } = await renderEditor();

    fireEvent.click(item(IDS.ruhe));
    clickCanvas(200, 100);

    expect(onChange).toHaveBeenCalledWith({
      [IDS.fahrerhaus]: { points: [{ id: expect.any(String), menuId: IDS.ruhe, x: 50, y: 50 }] },
    });
  });

  it("versetzt einen schon gesetzten Punkt, statt einen zweiten anzulegen", async () => {
    const value: MenuLayout = { [IDS.fahrerhaus]: { points: [point(IDS.ruhe)] } };
    const { onChange } = await renderEditor({ value });

    fireEvent.click(item(IDS.ruhe));
    clickCanvas(100, 50);

    expect(onChange).toHaveBeenCalledWith({ [IDS.fahrerhaus]: { points: [{ ...point(IDS.ruhe), x: 25, y: 25 }] } });
  });

  it("kennzeichnet gesetzte Unterpunkte und entfernt den Punkt des gewählten", async () => {
    const value: MenuLayout = { [IDS.fahrerhaus]: { points: [point(IDS.ruhe), point(IDS.haendler)] } };
    const { onChange } = await renderEditor({ value });

    expect(item(IDS.ruhe)).toHaveTextContent(LEVEL_LIST_MESSAGES.placed);
    expect(item(IDS.arbeitsplatz)).not.toHaveTextContent(LEVEL_LIST_MESSAGES.placed);

    fireEvent.click(item(IDS.ruhe));
    fireEvent.click(screen.getByRole("button", { name: MENU_EDITOR_MESSAGES.remove }));

    expect(onChange).toHaveBeenCalledWith({ [IDS.fahrerhaus]: { points: [point(IDS.haendler)] } });
  });

  describe("tiefere Ebenen", () => {
    it("öffnet über die Liste die Ebene eines Unterpunkts", async () => {
      await renderEditor();

      fireEvent.click(screen.getByRole("button", { name: LEVEL_LIST_MESSAGES.openLevel("Fahrerarbeitsplatz") }));

      expect(screen.getByTestId("menu-editor-level")).toHaveValue(IDS.arbeitsplatz);
      expect(item(IDS.lenkrad)).toBeInTheDocument();
    });

    it("sagt ohne eigenes Bild, dass die Ebene das Bild darüber zeigt, und bietet keine Fläche", async () => {
      await renderEditor();

      fireEvent.change(screen.getByTestId("menu-editor-level"), { target: { value: IDS.arbeitsplatz } });

      expect(screen.getByTestId("menu-editor-needs-image")).toHaveTextContent(MENU_EDITOR_MESSAGES.inherits);
      expect(screen.queryByTestId("placement-canvas")).not.toBeInTheDocument();
    });

    it("setzt das Bild der Ebene in den Entwurf", async () => {
      const value: MenuLayout = { [IDS.fahrerhaus]: { points: [point(IDS.ruhe)] } };
      const { onChange } = await renderEditor({ value });
      fireEvent.change(screen.getByTestId("menu-editor-level"), { target: { value: IDS.arbeitsplatz } });

      fireEvent.click(screen.getByRole("button", { name: "Ebenenbild setzen" }));

      expect(onChange).toHaveBeenCalledWith({
        [IDS.fahrerhaus]: { points: [point(IDS.ruhe)] },
        [IDS.arbeitsplatz]: { image: cabImage, points: [] },
      });
    });

    it("platziert auf der Ebene mit eigenem Bild ihre Unterpunkte", async () => {
      const value: MenuLayout = { [IDS.arbeitsplatz]: { image: cabImage, points: [] } };
      const { onChange } = await renderEditor({ value });
      fireEvent.change(screen.getByTestId("menu-editor-level"), { target: { value: IDS.arbeitsplatz } });

      fireEvent.click(item(IDS.sitz));
      clickCanvas(200, 100);

      expect(onChange).toHaveBeenCalledWith({
        [IDS.arbeitsplatz]: { image: cabImage, points: [{ id: expect.any(String), menuId: IDS.sitz, x: 50, y: 50 }] },
      });
    });

    it("behält die Punkte, wenn das Bild der Ebene entfernt wird", async () => {
      const value: MenuLayout = { [IDS.arbeitsplatz]: { image: cabImage, points: [point(IDS.sitz)] } };
      const { onChange } = await renderEditor({ value });
      fireEvent.change(screen.getByTestId("menu-editor-level"), { target: { value: IDS.arbeitsplatz } });

      fireEvent.click(screen.getByRole("button", { name: "Ebenenbild entfernen" }));

      expect(onChange).toHaveBeenCalledWith({ [IDS.arbeitsplatz]: { points: [point(IDS.sitz)] } });
    });
  });

  it("wählt beim Anfassen eines Punktes seinen Unterpunkt aus", async () => {
    await renderEditor({ value: { [IDS.fahrerhaus]: { points: [point(IDS.ruhe)] } } });

    fireEvent.pointerDown(screen.getByTestId(`place-marker-p-${IDS.ruhe}`), { pointerId: 1 });

    expect(item(IDS.ruhe)).toHaveAttribute("aria-current", "true");
  });

  it("zeigt Punkte, die nirgends gezeigt würden, gesondert und entfernt sie nur auf Wunsch", async () => {
    // Lenkrad steht nicht direkt unter Fahrerhaus, der zweite Eintrag gar nicht im Baum.
    const value: MenuLayout = {
      [IDS.fahrerhaus]: { points: [point(IDS.lenkrad), point(IDS.ruhe), point("000000000000000000000000")] },
    };
    const { onChange } = await renderEditor({ value });

    const orphans = screen.getByTestId("menu-editor-orphans");
    expect(within(orphans).getAllByRole("listitem")).toHaveLength(2);
    expect(orphans).toHaveTextContent("Lenkrad");
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.click(within(orphans).getAllByRole("button", { name: MENU_EDITOR_MESSAGES.removeOrphan })[0]);

    expect(onChange).toHaveBeenCalledWith({
      [IDS.fahrerhaus]: { points: [point(IDS.ruhe), point("000000000000000000000000")] },
    });
  });

  it("setzt je Ebene höchstens so viele Punkte wie erlaubt und zeigt, wie viele frei sind", async () => {
    const many = Array.from({ length: MAX_POINTS }, (_, index) => point(index.toString(16).padStart(24, "a")));
    const { onChange } = await renderEditor({ value: { [IDS.fahrerhaus]: { points: many } } });

    expect(screen.getByTestId("menu-editor-remaining")).toHaveTextContent(MENU_EDITOR_MESSAGES.remaining(0));
    fireEvent.click(item(IDS.ruhe));
    clickCanvas();

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByTestId("menu-editor-full")).toBeInTheDocument();
  });

  it("fordert auf der Startebene ein Bild an, bevor es Punkte gibt", async () => {
    const { readImageAttribute } = jest.requireMock("./use-image-attribute");
    readImageAttribute.mockReturnValueOnce(null);

    await renderEditor();

    expect(screen.getByTestId("menu-editor-needs-image")).toHaveTextContent(MENU_EDITOR_MESSAGES.rootNeedsImage);
    expect(screen.queryByTestId("placement-canvas")).not.toBeInTheDocument();
  });

  it("zeigt die Punkte auf der Fläche ohne Ziffer", async () => {
    await renderEditor({ value: { [IDS.fahrerhaus]: { points: [point(IDS.ruhe)] } } });

    expect(screen.getByTestId(`place-marker-p-${IDS.ruhe}`)).toHaveTextContent("");
    expect(screen.getByTestId(`place-marker-p-${IDS.ruhe}`)).toHaveAccessibleName("Punkt 1: Ruhebereich");
  });
});
