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

import { MenuClickMode, MenuHotspotPoint } from "../menu-points-model";
import { MENU_STATUS, MenuHotspotImage } from "./menu-hotspot-image";
import { MENU_MESSAGES } from "./menu-browser";
import { IDS, buildTree } from "./menu-tree-test-data";

const image = { url: "https://example.test/lkw.jpg", alt: "Ein Lkw" };

const point = (menuId: string, x = 50, y = 50): MenuHotspotPoint => ({ id: `p-${menuId}`, menuId, x, y });

const POINTS = [
  point(IDS.fahrerhaus),
  point(IDS.lenkrad),
  point(IDS.ruhe),
  point(IDS.ausstattung),
  point(IDS.haendler),
  // Steht nicht im Baum: gelöscht, verborgen oder nicht berechtigt.
  point("000000000000000000000000"),
];

interface Setup {
  click?: MenuClickMode;
  points?: MenuHotspotPoint[];
  load?: jest.Mock;
}

async function renderReady({ click = "open", points = POINTS, load }: Setup = {}): Promise<jest.Mock> {
  const loader = load ?? jest.fn(async () => buildTree());
  render(
    <MenuHotspotImage image={image} points={points} rootId={IDS.fahrerhaus} depth={3} click={click} loadTree={loader} />,
  );
  await act(async () => undefined);
  return loader;
}

const marker = (menuId: string): HTMLElement => screen.getByTestId(`menu-marker-${menuId}`);
const row = (menuId: string): HTMLElement => screen.getByTestId(`menu-row-${menuId}`);
const pointer = { pointerType: "mouse" };

describe("MenuHotspotImage", () => {
  it("zeigt nichts ohne Startknoten, Bild oder Punkt und fragt dann auch nicht", () => {
    const load = jest.fn(async () => buildTree());
    const { container, rerender } = render(
      <MenuHotspotImage image={image} points={POINTS} rootId={null} depth={3} click="open" loadTree={load} />,
    );
    expect(container).toBeEmptyDOMElement();

    rerender(<MenuHotspotImage image={null} points={POINTS} rootId={IDS.fahrerhaus} depth={3} click="open" loadTree={load} />);
    expect(container).toBeEmptyDOMElement();

    rerender(<MenuHotspotImage image={image} points={[]} rootId={IDS.fahrerhaus} depth={3} click="open" loadTree={load} />);
    expect(container).toBeEmptyDOMElement();
    expect(load).not.toHaveBeenCalled();
  });

  it("zeigt das Bild schon, während das Menü lädt", () => {
    render(
      <MenuHotspotImage
        image={image}
        points={POINTS}
        rootId={IDS.fahrerhaus}
        depth={4}
        click="open"
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

  it("setzt Punkte nur für Einträge, die im Baum stehen", async () => {
    await renderReady();

    expect(screen.getAllByTestId(/^menu-marker-/)).toHaveLength(5);
    expect(screen.queryByTestId("menu-marker-000000000000000000000000")).not.toBeInTheDocument();
  });

  it("bietet nach einem Fehlschlag einen neuen Versuch an", async () => {
    const tree = buildTree();
    const load = jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce(tree);
    await renderReady({ load });

    expect(screen.getByRole("alert")).toHaveTextContent(MENU_STATUS.failed);
    expect(screen.queryByTestId(/^menu-marker-/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: MENU_STATUS.retry }));
    await act(async () => undefined);

    expect(load).toHaveBeenCalledTimes(2);
    expect(marker(IDS.ruhe)).toBeInTheDocument();
  });

  describe("Klick „Seite öffnen“", () => {
    it("macht den Punkt zum Link auf die Seite", async () => {
      await renderReady();

      expect(marker(IDS.lenkrad).tagName).toBe("A");
      expect(marker(IDS.lenkrad)).toHaveAttribute("href", `/openlink/content/page/${IDS.lenkrad}`);
      expect(marker(IDS.lenkrad)).not.toHaveAttribute("target");
      expect(marker(IDS.lenkrad)).toHaveAccessibleName("Lenkrad");
    });

    it("öffnet ein externes Ziel in neuem Tab und sagt das an", async () => {
      await renderReady();

      expect(marker(IDS.haendler)).toHaveAttribute("target", "_blank");
      expect(marker(IDS.haendler)).toHaveAttribute("rel", "noopener noreferrer");
      expect(marker(IDS.haendler)).toHaveAccessibleName(`Händlersuche${MENU_MESSAGES.newTab}`);
    });

    it("zeigt einen Ordner ohne Seite stattdessen im Menü", async () => {
      await renderReady();

      expect(marker(IDS.ausstattung).tagName).toBe("BUTTON");
      fireEvent.click(marker(IDS.ausstattung));

      expect(row(IDS.ausstattung)).toHaveClass("man-hi-menu__item--marked");
    });
  });

  describe("Klick „Im Menü zeigen“", () => {
    it("blättert zur Ebene des Eintrags, markiert ihn und setzt den Fokus darauf", async () => {
      await renderReady({ click: "reveal" });

      expect(marker(IDS.lenkrad).tagName).toBe("BUTTON");
      fireEvent.click(marker(IDS.lenkrad));

      expect(screen.getByRole("button", { name: `${MENU_MESSAGES.back}Fahrerarbeitsplatz` })).toBeInTheDocument();
      expect(row(IDS.lenkrad)).toHaveClass("man-hi-menu__item--marked");
      expect(within(row(IDS.lenkrad)).getByRole("link")).toHaveFocus();
    });

    it("blättert für den Startknoten nach oben und markiert die Kopfzeile", async () => {
      await renderReady({ click: "reveal" });
      fireEvent.click(marker(IDS.lenkrad));

      fireEvent.click(marker(IDS.fahrerhaus));

      expect(screen.getByRole("heading", { name: "Fahrerhaus" }).parentElement).toHaveClass("man-hi-menu__header--marked");
    });

    it("vergisst die Markierung, sobald jemand selbst blättert", async () => {
      await renderReady({ click: "reveal" });
      fireEvent.click(marker(IDS.lenkrad));

      fireEvent.click(screen.getByRole("button", { name: `${MENU_MESSAGES.back}Fahrerarbeitsplatz` }));

      expect(document.querySelector(".man-hi-menu__item--marked")).toBeNull();
    });
  });

  describe("Hover", () => {
    it("markiert über dem Punkt die Zeile seines Vorfahren, ohne zu blättern", async () => {
      await renderReady();

      fireEvent.pointerEnter(marker(IDS.lenkrad), pointer);

      expect(row(IDS.arbeitsplatz)).toHaveClass("man-hi-menu__item--marked");
      expect(screen.getByRole("heading", { name: "Fahrerhaus" })).toBeInTheDocument();

      fireEvent.pointerLeave(marker(IDS.lenkrad), pointer);
      expect(row(IDS.arbeitsplatz)).not.toHaveClass("man-hi-menu__item--marked");
    });

    it("markiert auch im Fokus", async () => {
      await renderReady();

      fireEvent.focus(marker(IDS.ruhe));

      expect(row(IDS.ruhe)).toHaveClass("man-hi-menu__item--marked");
    });

    it("hebt über einer Zeile den Punkt des Eintrags und die seiner Nachfahren hervor", async () => {
      await renderReady();

      fireEvent.pointerEnter(row(IDS.arbeitsplatz), pointer);

      expect(marker(IDS.lenkrad)).toHaveClass("man-hi__marker--highlighted");
      expect(marker(IDS.lenkrad)).not.toHaveClass("man-hi__marker--named");
      expect(marker(IDS.ruhe)).not.toHaveClass("man-hi__marker--highlighted");
    });

    it("zeigt das Namensschild nur am Punkt genau dieser Zeile", async () => {
      await renderReady();

      fireEvent.pointerEnter(row(IDS.ruhe), pointer);

      expect(marker(IDS.ruhe)).toHaveClass("man-hi__marker--named");
      expect(within(marker(IDS.ruhe)).getByText("Ruhebereich")).toBeInTheDocument();
    });

    it("lässt Touch das Hervorheben aus", async () => {
      await renderReady();

      fireEvent.pointerEnter(marker(IDS.ruhe), { pointerType: "touch" });

      expect(row(IDS.ruhe)).not.toHaveClass("man-hi-menu__item--marked");
    });
  });

  it("richtet das Namensschild am Rand des Bildes nach innen aus", async () => {
    await renderReady({ points: [point(IDS.ruhe, 5, 5), point(IDS.lenkrad, 95, 50)] });

    expect(within(marker(IDS.ruhe)).getByText("Ruhebereich")).toHaveClass("man-hi__tag--start", "man-hi__tag--below");
    expect(within(marker(IDS.lenkrad)).getByText("Lenkrad")).toHaveClass("man-hi__tag--end");
  });
});
