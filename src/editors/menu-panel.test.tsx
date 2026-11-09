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

import { HotspotConfig } from "../hotspot-config";
import { MenuHotspotPoint, MenuLayout } from "../menu-points-model";
import { IDS, buildTree } from "../menu/menu-tree-test-data";
import { MAX_POINTS } from "../points-model";
import { LEVEL_LIST_MESSAGES } from "./menu-level-list";
import { MENU_EDITOR_MESSAGES, MenuPanel } from "./menu-panel";

const cabImage = { url: "https://example.test/kabine.jpg", alt: "Kabine" };
const rootImage = { url: "https://example.test/lkw.jpg", alt: "Lkw" };

// Die Bildwahl: ein Knopf setzt ein Bild, einer entfernt es.
jest.mock("./image-field", () => ({
  ImageField: ({ image, onChange }: { image: { url: string } | null; onChange: (image: unknown) => void }) => (
    <div data-testid="image-field" data-url={image?.url ?? ""}>
      <button type="button" onClick={() => onChange({ url: "https://example.test/kabine.jpg", alt: "Kabine" })}>
        Bild setzen
      </button>
      <button type="button" onClick={() => onChange(null)}>
        Bild entfernen
      </button>
    </div>
  ),
}));

// Das Punktbild: ein Knopf setzt eines — die Mediathek prüft point-icon-field.test.
jest.mock("./point-icon-field", () => ({
  PointIconField: ({ onChange }: { onChange: (icon: unknown) => void }) => (
    <button type="button" onClick={() => onChange({ url: "https://example.test/i.png", size: "m" })}>
      Icon setzen
    </button>
  ),
}));

// Der Startpunkt: ein Feld, das eine ID setzt — die Liste prüft start-point-field.test.
jest.mock("./start-point-field", () => ({
  StartPointField: ({ onChange }: { onChange: (id: string | null) => void }) => (
    <button type="button" onClick={() => onChange("6a73580860fe1414378d4660")}>
      Startpunkt setzen
    </button>
  ),
}));

type MenuSettings = HotspotConfig["menu"];

const point = (menuId: string, x = 10, y = 20): MenuHotspotPoint => ({ id: `p-${menuId}`, menuId, x, y });

async function renderPanel(
  layout: MenuLayout = {},
  overrides: Partial<React.ComponentProps<typeof MenuPanel>> = {},
): Promise<{ onMenuChange: jest.Mock; onRootImageChange: jest.Mock; loadTree: jest.Mock }> {
  const onMenuChange = jest.fn();
  const onRootImageChange = jest.fn();
  const loadTree = jest.fn(async () => buildTree());
  const menu: MenuSettings = { rootId: IDS.fahrerhaus, depth: 4, click: "enter", layout };
  render(
    <MenuPanel
      rootImage={rootImage}
      onRootImageChange={onRootImageChange}
      menu={menu}
      onMenuChange={onMenuChange}
      loadTree={loadTree}
      {...overrides}
    />,
  );
  await act(async () => undefined);
  return { onMenuChange, onRootImageChange, loadTree: (overrides.loadTree as jest.Mock | undefined) ?? loadTree };
}

const lastLayout = (onMenuChange: jest.Mock): MenuLayout => onMenuChange.mock.calls.at(-1)?.[0].layout;

function clickCanvas(clientX = 200, clientY = 100): void {
  const stage = screen.getByTestId("placement-canvas");
  stage.getBoundingClientRect = () =>
    ({ left: 0, top: 0, width: 400, height: 200, right: 400, bottom: 200, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;
  fireEvent.click(stage, { clientX, clientY });
}

const item = (menuId: string): HTMLElement => screen.getByTestId(`menu-level-item-${menuId}`);
const openLevel = (levelId: string): void => {
  fireEvent.change(screen.getByTestId("menu-editor-level"), { target: { value: levelId } });
};

describe("MenuPanel", () => {
  describe("Einstellungen", () => {
    it("lädt den Baum mit Startpunkt und Tiefe und beginnt auf der Startebene", async () => {
      const { loadTree } = await renderPanel();

      expect(loadTree).toHaveBeenCalledWith(IDS.fahrerhaus, 4);
      expect(screen.getByTestId("menu-editor-level")).toHaveValue(IDS.fahrerhaus);
      expect(within(screen.getByTestId("menu-level-list")).getAllByRole("listitem").map((li) => li.textContent)).toEqual([
        "Fahrerarbeitsplatz›",
        "Ruhebereich",
        "Ausstattung›",
        "Händlersuche",
      ]);
    });

    it("ändert Startpunkt, Tiefe und Klickverhalten im Entwurf", async () => {
      const { onMenuChange } = await renderPanel();

      fireEvent.click(screen.getByRole("button", { name: "Startpunkt setzen" }));
      expect(onMenuChange).toHaveBeenLastCalledWith(expect.objectContaining({ rootId: IDS.arbeitsplatz }));

      fireEvent.change(screen.getByTestId("menu-editor-depth"), { target: { value: "5" } });
      expect(onMenuChange).toHaveBeenLastCalledWith(expect.objectContaining({ depth: 5 }));

      fireEvent.change(screen.getByTestId("menu-editor-click"), { target: { value: "open" } });
      expect(onMenuChange).toHaveBeenLastCalledWith(expect.objectContaining({ click: "open" }));
    });

    it("verlangt einen Startpunkt, bevor es einen Baum gibt", async () => {
      const loadTree = jest.fn();
      await renderPanel({}, { menu: { rootId: null, depth: 3, click: "enter", layout: {} }, loadTree });

      expect(screen.getByTestId("menu-editor-no-start")).toHaveTextContent(MENU_EDITOR_MESSAGES.noStart);
      expect(loadTree).not.toHaveBeenCalled();
    });

    it("bietet nach einem Fehlschlag einen neuen Versuch an", async () => {
      const loadTree = jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce(buildTree());
      await renderPanel({}, { loadTree });

      fireEvent.click(within(screen.getByTestId("menu-editor-failed")).getByRole("button"));
      await act(async () => undefined);

      expect(screen.getByTestId("menu-level-list")).toBeInTheDocument();
    });
  });

  it("bietet jede Ebene mit Unterpunkten zur Auswahl an", async () => {
    await renderPanel();

    const options = within(screen.getByTestId("menu-editor-level")).getAllByRole("option");
    expect(options.map((option) => option.textContent?.trim())).toEqual(["Fahrerhaus", "Fahrerarbeitsplatz", "Ausstattung"]);
  });

  it("setzt keinen Punkt, solange kein Unterpunkt gewählt ist", async () => {
    const { onMenuChange } = await renderPanel();

    clickCanvas();

    expect(onMenuChange).not.toHaveBeenCalled();
    expect(screen.getByTestId("menu-editor-selection")).toHaveTextContent(MENU_EDITOR_MESSAGES.pickFirst);
  });

  it("setzt auf der Startebene den Punkt eines Unterpunkts", async () => {
    const { onMenuChange } = await renderPanel();

    fireEvent.click(item(IDS.ruhe));
    clickCanvas(200, 100);

    expect(lastLayout(onMenuChange)).toEqual({
      [IDS.fahrerhaus]: { points: [{ id: expect.any(String), menuId: IDS.ruhe, x: 50, y: 50 }] },
    });
  });

  it("gibt das Bild der Startebene an das Bild der Konfiguration", async () => {
    const { onRootImageChange } = await renderPanel();

    expect(screen.getByTestId("image-field")).toHaveAttribute("data-url", rootImage.url);
    fireEvent.click(screen.getByRole("button", { name: "Bild entfernen" }));

    expect(onRootImageChange).toHaveBeenCalledWith(null);
  });

  it("versetzt einen schon gesetzten Punkt, statt einen zweiten anzulegen", async () => {
    const { onMenuChange } = await renderPanel({ [IDS.fahrerhaus]: { points: [point(IDS.ruhe)] } });

    fireEvent.click(item(IDS.ruhe));
    clickCanvas(100, 50);

    expect(lastLayout(onMenuChange)).toEqual({ [IDS.fahrerhaus]: { points: [{ ...point(IDS.ruhe), x: 25, y: 25 }] } });
  });

  it("kennzeichnet gesetzte Unterpunkte und entfernt den Punkt des gewählten", async () => {
    const { onMenuChange } = await renderPanel({ [IDS.fahrerhaus]: { points: [point(IDS.ruhe), point(IDS.haendler)] } });

    expect(item(IDS.ruhe)).toHaveTextContent(LEVEL_LIST_MESSAGES.placed);
    expect(item(IDS.arbeitsplatz)).not.toHaveTextContent(LEVEL_LIST_MESSAGES.placed);

    fireEvent.click(item(IDS.ruhe));
    fireEvent.click(screen.getByRole("button", { name: MENU_EDITOR_MESSAGES.remove }));

    expect(lastLayout(onMenuChange)).toEqual({ [IDS.fahrerhaus]: { points: [point(IDS.haendler)] } });
  });

  describe("tiefere Ebenen", () => {
    it("öffnet über die Liste die Ebene eines Unterpunkts", async () => {
      await renderPanel();

      fireEvent.click(screen.getByRole("button", { name: LEVEL_LIST_MESSAGES.openLevel("Fahrerarbeitsplatz") }));

      expect(screen.getByTestId("menu-editor-level")).toHaveValue(IDS.arbeitsplatz);
      expect(item(IDS.lenkrad)).toBeInTheDocument();
    });

    it("sagt ohne eigenes Bild, dass die Ebene das Bild darüber zeigt, und bietet keine Fläche", async () => {
      await renderPanel();
      openLevel(IDS.arbeitsplatz);

      expect(screen.getByTestId("menu-editor-needs-image")).toHaveTextContent(MENU_EDITOR_MESSAGES.inherits);
      expect(screen.queryByTestId("placement-canvas")).not.toBeInTheDocument();
    });

    it("setzt das Bild der Ebene in den Entwurf", async () => {
      const { onMenuChange, onRootImageChange } = await renderPanel({ [IDS.fahrerhaus]: { points: [point(IDS.ruhe)] } });
      openLevel(IDS.arbeitsplatz);

      fireEvent.click(screen.getByRole("button", { name: "Bild setzen" }));

      expect(lastLayout(onMenuChange)).toEqual({
        [IDS.fahrerhaus]: { points: [point(IDS.ruhe)] },
        [IDS.arbeitsplatz]: { image: cabImage, points: [] },
      });
      expect(onRootImageChange).not.toHaveBeenCalled();
    });

    it("platziert auf der Ebene mit eigenem Bild ihre Unterpunkte", async () => {
      const { onMenuChange } = await renderPanel({ [IDS.arbeitsplatz]: { image: cabImage, points: [] } });
      openLevel(IDS.arbeitsplatz);

      fireEvent.click(item(IDS.sitz));
      clickCanvas(200, 100);

      expect(lastLayout(onMenuChange)).toEqual({
        [IDS.arbeitsplatz]: { image: cabImage, points: [{ id: expect.any(String), menuId: IDS.sitz, x: 50, y: 50 }] },
      });
    });

    it("behält die Punkte, wenn das Bild der Ebene entfernt wird", async () => {
      const { onMenuChange } = await renderPanel({ [IDS.arbeitsplatz]: { image: cabImage, points: [point(IDS.sitz)] } });
      openLevel(IDS.arbeitsplatz);

      fireEvent.click(screen.getByRole("button", { name: "Bild entfernen" }));

      expect(lastLayout(onMenuChange)).toEqual({ [IDS.arbeitsplatz]: { points: [point(IDS.sitz)] } });
    });
  });

  it("wählt beim Anfassen eines Punktes seinen Unterpunkt aus", async () => {
    await renderPanel({ [IDS.fahrerhaus]: { points: [point(IDS.ruhe)] } });

    fireEvent.pointerDown(screen.getByTestId(`place-marker-p-${IDS.ruhe}`), { pointerId: 1 });

    expect(item(IDS.ruhe)).toHaveAttribute("aria-current", "true");
  });

  it("zeigt Punkte, die nirgends gezeigt würden, gesondert und entfernt sie nur auf Wunsch", async () => {
    const { onMenuChange } = await renderPanel({
      [IDS.fahrerhaus]: { points: [point(IDS.lenkrad), point(IDS.ruhe), point("000000000000000000000000")] },
    });

    const orphans = screen.getByTestId("menu-editor-orphans");
    expect(within(orphans).getAllByRole("listitem")).toHaveLength(2);
    expect(orphans).toHaveTextContent("Lenkrad");
    expect(onMenuChange).not.toHaveBeenCalled();

    fireEvent.click(within(orphans).getAllByRole("button", { name: MENU_EDITOR_MESSAGES.removeOrphan })[0]);

    expect(lastLayout(onMenuChange)).toEqual({
      [IDS.fahrerhaus]: { points: [point(IDS.ruhe), point("000000000000000000000000")] },
    });
  });

  it("setzt je Ebene höchstens so viele Punkte wie erlaubt und zeigt, wie viele frei sind", async () => {
    const many = Array.from({ length: MAX_POINTS }, (_, index) => point(index.toString(16).padStart(24, "a")));
    const { onMenuChange } = await renderPanel({ [IDS.fahrerhaus]: { points: many } });

    expect(screen.getByTestId("menu-editor-remaining")).toHaveTextContent(MENU_EDITOR_MESSAGES.remaining(0));
    fireEvent.click(item(IDS.ruhe));
    clickCanvas();

    expect(onMenuChange).not.toHaveBeenCalled();
    expect(screen.getByTestId("menu-editor-full")).toBeInTheDocument();
  });

  it("fordert auf der Startebene ein Bild an, bevor es Punkte gibt", async () => {
    await renderPanel({}, { rootImage: null });

    expect(screen.getByTestId("menu-editor-needs-image")).toHaveTextContent(MENU_EDITOR_MESSAGES.rootNeedsImage);
    expect(screen.queryByTestId("placement-canvas")).not.toBeInTheDocument();
  });

  it("zeigt die Punkte auf der Fläche ohne Ziffer", async () => {
    await renderPanel({ [IDS.fahrerhaus]: { points: [point(IDS.ruhe)] } });

    expect(screen.getByTestId(`place-marker-p-${IDS.ruhe}`)).toHaveTextContent("");
    expect(screen.getByTestId(`place-marker-p-${IDS.ruhe}`)).toHaveAccessibleName("Punkt 1: Ruhebereich");
  });

  it("gibt einem gesetzten Menüpunkt ein eigenes Bild und nimmt es wieder weg", async () => {
    const { onMenuChange } = await renderPanel({ [IDS.fahrerhaus]: { points: [point(IDS.ruhe)] } });
    fireEvent.click(item(IDS.ruhe));

    fireEvent.click(screen.getByRole("button", { name: "Icon setzen" }));
    expect(lastLayout(onMenuChange)).toEqual({
      [IDS.fahrerhaus]: { points: [{ ...point(IDS.ruhe), icon: { url: "https://example.test/i.png", size: "m" } }] },
    });
  });

  it("zeigt das Bild eines Punktes auch auf der Fläche", async () => {
    await renderPanel({
      [IDS.fahrerhaus]: { points: [{ ...point(IDS.ruhe), icon: { url: "https://example.test/i.png", size: "l" } }] },
    });

    const canvasMarker = screen.getByTestId(`place-marker-p-${IDS.ruhe}`);
    expect(canvasMarker).toHaveClass("man-hie__canvas-marker--icon");
    expect(canvasMarker).toHaveStyle({ width: "72px", height: "72px" });
    expect(canvasMarker.querySelector("img")).toHaveAttribute("src", "https://example.test/i.png");
  });

  it("gibt einem Punktbild mit Hintergrund auf der Fläche seine Grösse für die Luft mit", async () => {
    await renderPanel({
      [IDS.fahrerhaus]: {
        points: [{ ...point(IDS.ruhe), icon: { url: "https://example.test/i.png", size: "m", background: "white" } }],
      },
    });

    const canvasMarker = screen.getByTestId(`place-marker-p-${IDS.ruhe}`);
    expect(canvasMarker).toHaveClass("man-hie__icon-bg", "man-hie__icon-bg--white");
    expect(canvasMarker.style.getPropertyValue("--man-hie-icon")).toBe("48px");
    expect(canvasMarker).toHaveStyle({ width: "48px", height: "48px" });
  });
});
