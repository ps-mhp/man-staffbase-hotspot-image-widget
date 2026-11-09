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

import { MenuTree } from "@shared/staffbase/menu-tree";

import { MenuClickMode, MenuHotspotPoint, MenuLayout } from "../menu-points-model";
import { HotspotImage } from "../points-model";
import { MENU_STATUS, MenuHotspotImage } from "./menu-hotspot-image";
import { MENU_MESSAGES } from "./menu-browser";
import { IDS, buildTree } from "./menu-tree-test-data";

const rootImage = { url: "https://example.test/lkw.jpg", alt: "Ein Lkw" };
const cabImage = { url: "https://example.test/kabine.jpg", alt: "Die Kabine" };

const point = (menuId: string, x = 50, y = 50): MenuHotspotPoint => ({ id: `p-${menuId}`, menuId, x, y });

/** Startebene: vier Punkte; Fahrerarbeitsplatz mit eigenem Bild; Ausstattung ohne Bild. */
const LAYOUT: MenuLayout = {
  [IDS.fahrerhaus]: {
    points: [
      point(IDS.arbeitsplatz),
      point(IDS.ruhe),
      point(IDS.ausstattung),
      point(IDS.haendler),
      // Steht nicht im Baum: gelöscht, verborgen oder nicht berechtigt.
      point("000000000000000000000000"),
    ],
  },
  [IDS.arbeitsplatz]: { image: cabImage, points: [point(IDS.lenkrad), point(IDS.sitz)] },
};

interface Setup {
  click?: MenuClickMode;
  layout?: MenuLayout;
  image?: HotspotImage | null;
  load?: jest.Mock;
}

async function renderReady({ click = "enter", layout = LAYOUT, image = rootImage, load }: Setup = {}): Promise<jest.Mock> {
  const loader = load ?? jest.fn(async () => buildTree());
  render(
    <MenuHotspotImage image={image} layout={layout} rootId={IDS.fahrerhaus} depth={3} click={click} loadTree={loader} />,
  );
  await act(async () => undefined);
  return loader;
}

const marker = (menuId: string): HTMLElement => screen.getByTestId(`menu-marker-${menuId}`);
const markers = (): string[] => screen.queryAllByTestId(/^menu-marker-/).map((element) => element.dataset.testid ?? "");
const row = (menuId: string): HTMLElement => screen.getByTestId(`menu-row-${menuId}`);
const shownImage = (): string | null => document.querySelector(".man-hi__image")?.getAttribute("src") ?? null;
const pointer = { pointerType: "mouse" };

describe("MenuHotspotImage", () => {
  it("zeigt nichts ohne Startknoten oder ohne ein einziges Bild und fragt dann auch nicht", () => {
    const load = jest.fn(async () => buildTree());
    const { container, rerender } = render(
      <MenuHotspotImage image={rootImage} layout={LAYOUT} rootId={null} depth={3} click="enter" loadTree={load} />,
    );
    expect(container).toBeEmptyDOMElement();

    rerender(
      <MenuHotspotImage
        image={null}
        layout={{ [IDS.fahrerhaus]: LAYOUT[IDS.fahrerhaus] }}
        rootId={IDS.fahrerhaus}
        depth={3}
        click="enter"
        loadTree={load}
      />,
    );
    expect(container).toBeEmptyDOMElement();
    expect(load).not.toHaveBeenCalled();
  });

  it("zeigt das Bild der Startebene schon, während das Menü lädt", () => {
    render(
      <MenuHotspotImage
        image={rootImage}
        layout={LAYOUT}
        rootId={IDS.fahrerhaus}
        depth={4}
        click="enter"
        loadTree={jest.fn(() => new Promise<MenuTree | null>(() => undefined))}
      />,
    );

    expect(screen.getByAltText("Ein Lkw")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(MENU_STATUS.loading);
  });

  it("fragt den Baum mit Startknoten und Tiefe ab", async () => {
    const load = await renderReady();

    expect(load).toHaveBeenCalledWith(IDS.fahrerhaus, 3);
  });

  it("bietet nach einem Fehlschlag einen neuen Versuch an", async () => {
    const load = jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce(buildTree());
    await renderReady({ load });

    expect(screen.getByRole("alert")).toHaveTextContent(MENU_STATUS.failed);
    fireEvent.click(screen.getByRole("button", { name: MENU_STATUS.retry }));
    await act(async () => undefined);

    expect(load).toHaveBeenCalledTimes(2);
    expect(marker(IDS.ruhe)).toBeInTheDocument();
  });

  describe("Ebenen", () => {
    it("zeigt oben das Bild der Startebene mit den Punkten ihrer Unterpunkte", async () => {
      await renderReady();

      expect(shownImage()).toBe(rootImage.url);
      expect(markers()).toEqual([
        `menu-marker-${IDS.arbeitsplatz}`,
        `menu-marker-${IDS.ruhe}`,
        `menu-marker-${IDS.ausstattung}`,
        `menu-marker-${IDS.haendler}`,
      ]);
    });

    it("wechselt beim Blättern im Menü auf Bild und Punkte der neuen Ebene", async () => {
      await renderReady();

      fireEvent.click(screen.getByRole("button", { name: MENU_MESSAGES.openChildren("Fahrerarbeitsplatz") }));

      expect(shownImage()).toBe(cabImage.url);
      expect(markers()).toEqual([`menu-marker-${IDS.lenkrad}`, `menu-marker-${IDS.sitz}`]);

      fireEvent.click(screen.getByRole("button", { name: `${MENU_MESSAGES.back}Fahrerarbeitsplatz` }));

      expect(shownImage()).toBe(rootImage.url);
    });

    it("lässt auf einer Ebene ohne eigenes Bild das der Ebene darüber stehen", async () => {
      await renderReady();

      fireEvent.click(screen.getByRole("button", { name: "Ausstattung" }));

      expect(shownImage()).toBe(rootImage.url);
      expect(markers()).toContain(`menu-marker-${IDS.ausstattung}`);
    });

    it("zeigt nur das Menü, wenn bis oben keine Ebene ein Bild hat", async () => {
      await renderReady({ image: null });

      expect(shownImage()).toBeNull();
      expect(document.querySelector(".man-hi--menu-only")).not.toBeNull();

      fireEvent.click(screen.getByRole("button", { name: MENU_MESSAGES.openChildren("Fahrerarbeitsplatz") }));

      expect(shownImage()).toBe(cabImage.url);
    });
  });

  describe("Klick „Ins Untermenü wechseln“", () => {
    it("blättert in das Untermenü des Punktes, wechselt das Bild und setzt den Fokus ins Menü", async () => {
      await renderReady();

      expect(marker(IDS.arbeitsplatz)).toHaveAccessibleName(`Fahrerarbeitsplatz${MENU_MESSAGES.enterSuffix}`);
      fireEvent.click(marker(IDS.arbeitsplatz));

      const back = screen.getByRole("button", { name: `${MENU_MESSAGES.back}Fahrerarbeitsplatz` });
      expect(back).toHaveFocus();
      expect(shownImage()).toBe(cabImage.url);
    });

    it("öffnet bei einem Punkt ohne Unterpunkte die Seite", async () => {
      await renderReady();

      expect(marker(IDS.ruhe).tagName).toBe("A");
      expect(marker(IDS.ruhe)).toHaveAttribute("href", `/openlink/content/page/${IDS.ruhe}`);
    });

    it("öffnet externe Ziele in neuem Tab und sagt das an", async () => {
      await renderReady();

      expect(marker(IDS.haendler)).toHaveAttribute("target", "_blank");
      expect(marker(IDS.haendler)).toHaveAttribute("rel", "noopener noreferrer");
      expect(marker(IDS.haendler)).toHaveAccessibleName(`Händlersuche${MENU_MESSAGES.newTab}`);
    });
  });

  describe("Klick „Seite öffnen“", () => {
    it("macht auch einen Punkt mit Unterpunkten zum Link auf seine Seite", async () => {
      await renderReady({ click: "open" });

      expect(marker(IDS.arbeitsplatz).tagName).toBe("A");
      expect(marker(IDS.arbeitsplatz)).toHaveAttribute("href", `/openlink/content/page/${IDS.arbeitsplatz}`);
      expect(marker(IDS.arbeitsplatz)).toHaveAccessibleName("Fahrerarbeitsplatz");
    });

    it("wechselt bei einem Ordner ohne Seite trotzdem ins Untermenü", async () => {
      await renderReady({ click: "open" });

      expect(marker(IDS.ausstattung).tagName).toBe("BUTTON");
      fireEvent.click(marker(IDS.ausstattung));

      expect(screen.getByRole("button", { name: `${MENU_MESSAGES.back}Ausstattung` })).toBeInTheDocument();
    });
  });

  describe("Hover", () => {
    it("markiert über dem Punkt seine Zeile und hebt sie beim Verlassen auf", async () => {
      await renderReady();

      fireEvent.pointerEnter(marker(IDS.ruhe), pointer);
      expect(row(IDS.ruhe)).toHaveClass("man-hi-menu__item--marked");

      fireEvent.pointerLeave(marker(IDS.ruhe), pointer);
      expect(row(IDS.ruhe)).not.toHaveClass("man-hi-menu__item--marked");
    });

    it("markiert auch im Fokus", async () => {
      await renderReady();

      fireEvent.focus(marker(IDS.ruhe));

      expect(row(IDS.ruhe)).toHaveClass("man-hi-menu__item--marked");
    });

    it("hebt über einer Zeile ihren Punkt hervor und zeigt sein Namensschild", async () => {
      await renderReady();

      fireEvent.pointerEnter(row(IDS.ruhe), pointer);

      expect(marker(IDS.ruhe)).toHaveClass("man-hi__marker--highlighted", "man-hi__marker--named");
      expect(within(marker(IDS.ruhe)).getByText("Ruhebereich")).toBeInTheDocument();
      expect(marker(IDS.arbeitsplatz)).not.toHaveClass("man-hi__marker--highlighted");
    });

    it("markiert die Kopfzeile, wenn auf dem geerbten Bild der Punkt der gezeigten Ebene unter dem Zeiger steht", async () => {
      await renderReady();
      fireEvent.click(screen.getByRole("button", { name: "Ausstattung" }));

      fireEvent.pointerEnter(marker(IDS.ausstattung), pointer);

      expect(document.querySelector(".man-hi-menu__header")).toHaveClass("man-hi-menu__header--marked");
    });

    it("vergisst die Hervorhebung, wenn die Zeile beim Blättern verschwindet", async () => {
      await renderReady();
      // Ausstattung hat kein eigenes Bild: ihr Punkt bleibt nach dem Blättern zu sehen.
      const folder = screen.getByRole("button", { name: "Ausstattung" });
      fireEvent.focus(folder);
      expect(marker(IDS.ausstattung)).toHaveClass("man-hi__marker--highlighted");

      fireEvent.click(folder);

      expect(marker(IDS.ausstattung)).not.toHaveClass("man-hi__marker--highlighted");
    });

    it("lässt Touch das Hervorheben aus", async () => {
      await renderReady();

      fireEvent.pointerEnter(marker(IDS.ruhe), { pointerType: "touch" });

      expect(row(IDS.ruhe)).not.toHaveClass("man-hi-menu__item--marked");
    });
  });

  it("richtet das Namensschild am Rand des Bildes nach innen aus", async () => {
    await renderReady({
      layout: { [IDS.fahrerhaus]: { points: [point(IDS.ruhe, 5, 5), point(IDS.haendler, 95, 50)] } },
    });

    expect(within(marker(IDS.ruhe)).getByText("Ruhebereich")).toHaveClass("man-hi__tag--start", "man-hi__tag--below");
    expect(within(marker(IDS.haendler)).getByText("Händlersuche")).toHaveClass("man-hi__tag--end");
  });
});
