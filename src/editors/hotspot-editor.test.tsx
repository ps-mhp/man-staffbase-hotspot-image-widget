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

/**
 * Das Fenster als Ganzes, ohne Rahmen: was die Redaktion sieht und was im
 * Entwurf ankommt. Der Rahmen selbst (Übernehmen, Rückgängig) ist in
 * `hotspot-dialog.test.tsx` geprüft.
 */

import * as React from "react";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfigShellProvider, type ConfigShellState } from "@man/config-ui/shell/shell-context";
import { MediaClient } from "@shared/media/media-client";

import { ConfigKey, DEFAULT_CONFIG, HotspotConfig } from "../hotspot-config";
import { HotspotDraft } from "../hotspot-draft";
import { MenuLayout } from "../menu-points-model";
import { IDS, buildTree } from "../menu/menu-tree-test-data";
import { HotspotPoint, MAX_POINTS } from "../points-model";
import { HotspotEditor } from "./hotspot-editor";

jest.mock("@shared/staffbase/menu-start-points", () => ({
  fetchStartPointOptions: jest.fn(async () => [{ id: "6a58dd4eefeacc1239d9fd09", title: "Fahrerhaus" }]),
}));

const image = { url: "https://example.test/werksplan.jpg", alt: "Werksplan" };
const point = (id: string, title: string, extra: Partial<HotspotPoint> = {}): HotspotPoint => ({
  id,
  x: 20,
  y: 30,
  title,
  ...extra,
});

const stubMediaClient = (): MediaClient =>
  ({
    listMedia: jest.fn(async () => ({ items: [], total: 0, nextOffset: null })),
    searchMedia: jest.fn(async () => ({ items: [], nextCursor: null })),
    currentUserId: jest.fn(async () => null),
  }) as unknown as MediaClient;

interface Harness {
  latest: () => HotspotDraft;
  calls: () => number;
}

interface SetupOptions {
  inherited?: ConfigKey[];
  shell?: Partial<ConfigShellState>;
}

function setup(config: Partial<HotspotConfig>, options: SetupOptions = {}): Harness {
  const onChange = jest.fn<void, [HotspotDraft]>();
  const initial: HotspotDraft = { config: { ...DEFAULT_CONFIG, ...config }, inherited: options.inherited ?? [] };
  const loadTree = jest.fn(async () => buildTree());
  const shell: ConfigShellState = { view: "editor", setView: () => undefined, preview: true, issuesVisible: false, ...options.shell };

  function Harnessed(): React.ReactElement {
    const [draft, setDraft] = React.useState(initial);
    return (
      <ConfigShellProvider value={shell}>
        <HotspotEditor
          value={draft}
          onChange={(next) => {
            onChange(next);
            setDraft(next);
          }}
          mediaClient={stubMediaClient()}
          loadTree={loadTree}
          loadPages={async () => []}
        />
      </ConfigShellProvider>
    );
  }

  render(<Harnessed />);
  return { latest: () => onChange.mock.calls[onChange.mock.calls.length - 1]![0], calls: () => onChange.mock.calls.length };
}

/** jsdom misst nicht — die Bühne bekommt feste Maße untergeschoben. */
function clickCanvas(clientX = 200, clientY = 100): void {
  const stage = screen.getByTestId("placement-canvas");
  stage.getBoundingClientRect = () =>
    ({ left: 0, top: 0, width: 400, height: 200, right: 400, bottom: 200, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;
  fireEvent.click(stage, { clientX, clientY });
}

const rows = (name: string): HTMLElement[] => within(screen.getByRole("grid", { name })).getAllByRole("row");
const radio = (name: string): HTMLElement => screen.getByRole("radio", { name });

describe("HotspotEditor – manuell", () => {
  const points = [
    point("a", "Empfang", { link: { kind: "page", href: "/content/page/1", title: "Besucheranmeldung" } }),
    point("b", "Werkhalle"),
  ];

  it("listet die Punkte mit Nummer, Titel und Ziel und zählt sie gegen die Grenze", () => {
    setup({ image, manual: { mode: "numbered", points } });

    expect(screen.getByRole("complementary", { name: "Punkte" })).toHaveTextContent(`2 von ${MAX_POINTS}`);
    const [first, second] = rows("Punkte");
    expect(first).toHaveTextContent("1");
    expect(first).toHaveTextContent("Seite: Besucheranmeldung");
    expect(second).toHaveTextContent("ohne Link");
  });

  it("zeigt rechts das Bild mit seiner Beschreibung, solange kein Punkt gewählt ist", () => {
    setup({ image, manual: { mode: "numbered", points } });

    const panel = screen.getByRole("complementary", { name: "Bild" });
    expect(within(panel).getByLabelText("Bildbeschreibung")).toHaveValue("Werksplan");
    expect(screen.getByTestId("canvas-bar-image")).toHaveTextContent("Bild: werksplan.jpg");
  });

  it("setzt beim Klick ins Bild einen Punkt und zeigt ihn rechts", () => {
    const harness = setup({ image, manual: { mode: "numbered", points } });

    clickCanvas(100, 50);

    expect(harness.latest().config.manual.points).toHaveLength(3);
    expect(harness.latest().config.manual.points[2]).toMatchObject({ x: 25, y: 25, title: "" });
    expect(screen.getByRole("complementary", { name: "Punkt 3" })).toBeInTheDocument();
    expect(screen.getByText("Ohne Titel lässt sich der Punkt nicht übernehmen.")).toBeInTheDocument();
  });

  it("legt über „Neuer Punkt“ einen Punkt in der Mitte an", async () => {
    const harness = setup({ image, manual: { mode: "numbered", points: [] } });

    await userEvent.click(screen.getByRole("button", { name: "Neuer Punkt" }));

    expect(harness.latest().config.manual.points[0]).toMatchObject({ x: 50, y: 50 });
  });

  it("legt nicht mehr Punkte an, als ein Bild trägt, und sagt es", () => {
    const many = Array.from({ length: MAX_POINTS }, (_, index) => point(`p${index}`, `Punkt ${index}`));
    const harness = setup({ image, manual: { mode: "numbered", points: many } });
    const before = harness.calls();

    clickCanvas();

    expect(harness.calls()).toBe(before);
    expect(screen.getByTestId("canvas-status")).toHaveTextContent(`Mehr als ${MAX_POINTS} Punkte`);
  });

  it("verschiebt, dupliziert und löscht den gewählten Punkt über die Aktionen", async () => {
    const harness = setup({ image, manual: { mode: "numbered", points } });
    await userEvent.click(rows("Punkte")[0]);

    await userEvent.click(screen.getByRole("button", { name: "Punkt nach unten" }));
    expect(harness.latest().config.manual.points.map((entry) => entry.id)).toEqual(["b", "a"]);

    await userEvent.click(screen.getByRole("button", { name: "Punkt duplizieren" }));
    expect(harness.latest().config.manual.points.map((entry) => entry.title)).toEqual(["Werkhalle", "Empfang", "Empfang"]);

    await userEvent.click(screen.getByRole("button", { name: "Punkt löschen" }));
    expect(harness.latest().config.manual.points).toHaveLength(2);
    expect(screen.getByRole("complementary", { name: "Bild" })).toBeInTheDocument();
  });

  it("ändert Titel und Beschreibung des gewählten Punkts", async () => {
    const harness = setup({ image, manual: { mode: "numbered", points } });
    await userEvent.click(rows("Punkte")[1]);

    fireEvent.change(screen.getByLabelText(/^Titel/), { target: { value: "Halle 3" } });
    fireEvent.change(screen.getByLabelText("Beschreibung"), { target: { value: "Montage" } });

    expect(harness.latest().config.manual.points[1]).toMatchObject({ title: "Halle 3", description: "Montage" });
  });

  it("zeigt nach gescheitertem Übernehmen den Punkt ohne Titel als Fehler", () => {
    setup({ image, manual: { mode: "numbered", points: [...points, point("c", "")] } }, { shell: { issuesVisible: true } });

    expect(screen.getByRole("complementary", { name: "Punkt 3" })).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Titel fehlt");
    expect(rows("Punkte")[2]).toHaveTextContent("Titel fehlt");
  });

  it("schaltet die Darstellung und die Quelle der Punkte über die Pills", async () => {
    const harness = setup({ image, manual: { mode: "numbered", points } });

    await userEvent.click(radio("Punkte"));
    expect(harness.latest().config.manual.mode).toBe("dots");

    await userEvent.click(radio("Aus dem Menü"));
    expect(harness.latest().config.source).toBe("menu");
  });

  it("macht einen geerbten Schlüssel zum eigenen, sobald er geändert wird", async () => {
    const harness = setup({ image, manual: { mode: "numbered", points } }, { inherited: ["manual.mode", "menu.depth"] });

    expect(screen.getByTestId("inherited-note")).toHaveTextContent("Darstellung, Tiefe");
    await userEvent.click(radio("Punkte"));

    expect(harness.latest().inherited).toEqual(["menu.depth"]);
  });

  it("führt ohne Bild zur Bildwahl statt zu einer leeren Bühne", () => {
    setup({ image: null, manual: { mode: "numbered", points: [] } });

    expect(screen.queryByTestId("placement-canvas")).toBeNull();
    expect(screen.getByTestId("canvas-empty-text")).toHaveTextContent("Ohne Bild gibt es keine Fläche");
    expect(screen.getByTestId("canvas-bar-pick")).toHaveTextContent("Bild wählen");
  });

  it("entfernt das Bild und lässt die Punkte stehen", async () => {
    const harness = setup({ image, manual: { mode: "numbered", points } });

    await userEvent.click(screen.getByRole("button", { name: "Bild entfernen" }));

    expect(harness.latest().config.image).toBeNull();
    expect(harness.latest().config.manual.points).toHaveLength(2);
  });

  it("zeigt nach der Wahl eines Punkts über den Bildnamen wieder das Bild", async () => {
    setup({ image, manual: { mode: "numbered", points } });
    await userEvent.click(rows("Punkte")[0]);
    expect(screen.queryByRole("complementary", { name: "Bild" })).toBeNull();

    await userEvent.click(screen.getByTestId("canvas-bar-image"));

    expect(screen.getByRole("complementary", { name: "Bild" })).toBeInTheDocument();
  });
});

describe("HotspotEditor – Menü", () => {
  const rootImage = { url: "https://example.test/lkw.jpg", alt: "Lkw" };
  const menu = (layout: MenuLayout = {}): HotspotConfig["menu"] => ({ rootId: IDS.fahrerhaus, depth: 4, click: "enter", layout });

  async function setupMenu(layout: MenuLayout = {}, config: Partial<HotspotConfig> = {}): Promise<Harness> {
    const harness = setup({ source: "menu", image: rootImage, menu: menu(layout), ...config });
    await act(async () => undefined);
    return harness;
  }

  const treeRow = (name: RegExp): HTMLElement => screen.getByRole("row", { name });

  it("zeigt die Menü-Ebenen als Baum und rechts das Menü", async () => {
    await setupMenu();

    expect(screen.getByRole("treegrid", { name: "Menü-Ebenen" })).toBeInTheDocument();
    expect(treeRow(/^Fahrerhaus/)).toHaveTextContent("Startpunkt · Bild + 0 Punkte");
    expect(screen.getByRole("complementary", { name: "Menü" })).toBeInTheDocument();
    expect(screen.getByTestId("canvas-bar-image")).toHaveTextContent("Ebene: Fahrerhaus · Bild: lkw.jpg");
  });

  it("setzt den Punkt eines gewählten Eintrags mit einem Klick ins Bild", async () => {
    const harness = await setupMenu();

    await userEvent.click(treeRow(/^Ruhebereich/));
    expect(screen.getByRole("complementary", { name: "Ruhebereich" })).toBeInTheDocument();
    clickCanvas(100, 50);

    expect(harness.latest().config.menu.layout[IDS.fahrerhaus]?.points).toEqual([
      expect.objectContaining({ menuId: IDS.ruhe, x: 25, y: 25 }),
    ]);
  });

  it("setzt keinen Punkt, solange kein Eintrag gewählt ist", async () => {
    const harness = await setupMenu();
    const before = harness.calls();

    clickCanvas();

    expect(harness.calls()).toBe(before);
    expect(screen.getByTestId("canvas-status").textContent).toContain("Wähle links einen Menüpunkt");
  });

  it("zeigt für einen Eintrag mit Unterpunkten seine eigene Ebene", async () => {
    await setupMenu();

    await userEvent.click(treeRow(/^Fahrerarbeitsplatz/));

    expect(screen.getByTestId("canvas-bar-image")).toHaveTextContent("Ebene: Fahrerhaus › Fahrerarbeitsplatz · kein eigenes Bild");
    expect(screen.getByTestId("canvas-empty-text")).toHaveTextContent("kein eigenes Bild");
  });

  it("zeigt verwaiste Punkte als Fehler im Baum und löscht sie nur auf Wunsch", async () => {
    const harness = await setupMenu({ [IDS.fahrerhaus]: { points: [{ id: "x", menuId: IDS.lenkrad, x: 1, y: 1 }] } });

    expect(screen.getByTestId("menu-orphans-note")).toHaveTextContent("Ein Punkt gehört");
    const orphanRow = screen
      .getAllByRole("row", { name: /^Lenkrad/ })
      .find((row) => row.textContent?.includes("Nicht mehr im Menü"));
    expect(orphanRow).toBeDefined();
    await userEvent.click(orphanRow as HTMLElement);
    expect(screen.getByTestId("orphan-panel")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Punkt löschen" }));

    expect(harness.latest().config.menu.layout[IDS.fahrerhaus]?.points).toEqual([]);
  });

  it("ändert Klickverhalten und Tiefe im Entwurf", async () => {
    const harness = await setupMenu();

    await userEvent.click(radio("Seite öffnen"));
    expect(harness.latest().config.menu.click).toBe("open");

    await userEvent.click(screen.getByTestId("menu-depth"));
    await userEvent.click(await screen.findByRole("option", { name: "5 Ebenen" }));
    expect(harness.latest().config.menu.depth).toBe(5);
  });

  it("wählt beim Anfassen eines Punkts seinen Eintrag und entfernt den Punkt", async () => {
    const harness = await setupMenu({ [IDS.fahrerhaus]: { points: [{ id: "r", menuId: IDS.ruhe, x: 10, y: 10 }] } });

    fireEvent.pointerDown(screen.getByTestId("place-marker-r"), { pointerId: 1 });
    expect(screen.getByRole("complementary", { name: "Ruhebereich" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Punkt löschen" }));

    expect(harness.latest().config.menu.layout[IDS.fahrerhaus]?.points).toEqual([]);
  });

  it("verlangt einen Startpunkt, bevor es einen Baum gibt", async () => {
    setup({ source: "menu", menu: { ...menu(), rootId: null } });
    await act(async () => undefined);

    expect(screen.getByTestId("menu-tree-status")).toHaveTextContent("Wähle rechts einen Startpunkt");
    expect(screen.getByRole("complementary", { name: "Menü" })).toBeInTheDocument();
  });
});
