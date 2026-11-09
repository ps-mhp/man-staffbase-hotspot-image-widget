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
import { MenuHotspotPoint } from "../menu-points-model";
import { IDS, buildTree } from "../menu/menu-tree-test-data";
import { MAX_POINTS } from "../points-model";
import { MENU_EDITOR_MESSAGES, MenuPointEditor } from "./menu-point-editor";
import { PLACED_LABEL } from "./menu-tree-list";

jest.mock("./image-field", () => ({ ImageField: () => <div data-testid="image-field" /> }));

const image = { url: "https://example.test/a.jpg", alt: "Ein Lkw" };
jest.mock("./use-image-attribute", () => ({
  imageSource: jest.fn(() => "field"),
  readImageAttribute: jest.fn(() => image),
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
      value={[]}
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

describe("MenuPointEditor", () => {
  it("liest Startpunkt und Tiefe aus dem Dialog und lädt den Baum", async () => {
    const { loadTree } = await renderEditor();

    expect(loadTree).toHaveBeenCalledWith(IDS.fahrerhaus, 4);
    expect(screen.getByTestId(`menu-tree-item-${IDS.lenkrad}`)).toHaveTextContent("Lenkrad");
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

    expect(screen.getByTestId("menu-tree-list")).toBeInTheDocument();
  });

  it("setzt keinen Punkt, solange kein Menüpunkt gewählt ist", async () => {
    const { onChange } = await renderEditor();

    clickCanvas();

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByTestId("menu-editor-selection")).toHaveTextContent(MENU_EDITOR_MESSAGES.pickFirst);
  });

  it("setzt den Punkt des gewählten Menüpunkts per Klick ins Bild", async () => {
    const { onChange } = await renderEditor();

    fireEvent.click(screen.getByTestId(`menu-tree-item-${IDS.lenkrad}`));
    clickCanvas(200, 100);

    expect(onChange).toHaveBeenCalledWith([{ id: expect.any(String), menuId: IDS.lenkrad, x: 50, y: 50 }]);
  });

  it("versetzt einen schon gesetzten Punkt, statt einen zweiten anzulegen", async () => {
    const { onChange } = await renderEditor({ value: [point(IDS.lenkrad)] });

    fireEvent.click(screen.getByTestId(`menu-tree-item-${IDS.lenkrad}`));
    clickCanvas(100, 50);

    expect(onChange).toHaveBeenCalledWith([{ id: `p-${IDS.lenkrad}`, menuId: IDS.lenkrad, x: 25, y: 25 }]);
  });

  it("kennzeichnet gesetzte Einträge und entfernt den Punkt des gewählten", async () => {
    const { onChange } = await renderEditor({ value: [point(IDS.lenkrad), point(IDS.ruhe)] });

    expect(screen.getByTestId(`menu-tree-item-${IDS.lenkrad}`)).toHaveTextContent(PLACED_LABEL);
    expect(screen.getByTestId(`menu-tree-item-${IDS.sitz}`)).not.toHaveTextContent(PLACED_LABEL);

    fireEvent.click(screen.getByTestId(`menu-tree-item-${IDS.lenkrad}`));
    fireEvent.click(screen.getByRole("button", { name: MENU_EDITOR_MESSAGES.remove }));

    expect(onChange).toHaveBeenCalledWith([point(IDS.ruhe)]);
  });

  it("wählt beim Anfassen eines Punktes seinen Menüpunkt aus", async () => {
    await renderEditor({ value: [point(IDS.ruhe)] });

    fireEvent.pointerDown(screen.getByTestId(`place-marker-p-${IDS.ruhe}`), { pointerId: 1 });

    expect(screen.getByTestId(`menu-tree-item-${IDS.ruhe}`)).toHaveAttribute("aria-current", "true");
  });

  it("zeigt Punkte ohne Eintrag im Baum gesondert und entfernt sie nur auf Wunsch", async () => {
    const orphan = point("000000000000000000000000");
    const { onChange } = await renderEditor({ value: [orphan, point(IDS.ruhe)] });

    const orphans = screen.getByTestId("menu-editor-orphans");
    expect(orphans).toHaveTextContent(MENU_EDITOR_MESSAGES.orphans);
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.click(within(orphans).getByRole("button", { name: MENU_EDITOR_MESSAGES.removeOrphan }));

    expect(onChange).toHaveBeenCalledWith([point(IDS.ruhe)]);
  });

  it("setzt höchstens so viele Punkte wie erlaubt", async () => {
    const many = Array.from({ length: MAX_POINTS }, (_, index) => point(index.toString(16).padStart(24, "a")));
    const { onChange } = await renderEditor({ value: many });

    fireEvent.click(screen.getByTestId(`menu-tree-item-${IDS.sitz}`));
    clickCanvas();

    expect(onChange).not.toHaveBeenCalled();
    // Alle zwanzig gehören zu Einträgen außerhalb des Baums: der Hinweis sagt, wo Platz zu holen ist.
    expect(screen.getByTestId("menu-editor-full")).toHaveTextContent(MENU_EDITOR_MESSAGES.fullWithOrphans(MAX_POINTS));
  });

  it("zeigt, wie viele Punkte noch frei sind", async () => {
    await renderEditor({ value: [point(IDS.ruhe)] });

    expect(screen.getByTestId("menu-editor-remaining")).toHaveTextContent(MENU_EDITOR_MESSAGES.remaining(MAX_POINTS - 1));
  });

  it("fordert ein Bild an, bevor es Punkte gibt", async () => {
    const { readImageAttribute } = jest.requireMock("./use-image-attribute");
    readImageAttribute.mockReturnValueOnce(null);

    await renderEditor();

    expect(screen.getByTestId("menu-editor-needs-image")).toBeInTheDocument();
    expect(screen.queryByTestId("placement-canvas")).not.toBeInTheDocument();
  });

  it("zeigt die Punkte auf der Fläche ohne Ziffer", async () => {
    await renderEditor({ value: [point(IDS.ruhe)] });

    expect(screen.getByTestId(`place-marker-p-${IDS.ruhe}`)).toHaveTextContent("");
    expect(screen.getByTestId(`place-marker-p-${IDS.ruhe}`)).toHaveAccessibleName("Punkt 1: Ruhebereich");
  });
});
