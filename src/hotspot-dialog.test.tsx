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
 * Das Fenster im gemeinsamen Rahmen, eingehängt in ein echtes RJSF-Formular
 * mit dem Schema des Widgets – so, wie der klassische Studio-Dialog die alten
 * Felder rendert (Auswahlfelder als MUI-Select).
 */

import * as React from "react";
import { act, render } from "@testing-library/react";
import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";

import { clickElement, modalRoot, queryInModal, settleEditor } from "@shared/ui/config-modal.testing";

import { configurationSchema, uiSchema } from "./configuration-schema";
import { DEFAULT_CONFIG, LegacyAttributes, encodeConfig, parseConfigParts, resolveConfig } from "./hotspot-config";
import { hotspotEditorShell, startHotspotDialog } from "./hotspot-dialog";
import { encodeImageAttribute, encodePointsAttribute } from "./points-model";

jest.mock("./menu/use-menu-tree", () => ({
  useMenuTree: () => ({ status: "loading" }),
}));
jest.mock("@shared/staffbase/pages", () => ({
  pageCatalogSource: { fetchList: jest.fn(async () => []), toOption: () => null },
}));

const FAHRERHAUS = "6a58dd4eefeacc1239d9fd09";
const image = { url: "https://www.mti.man/api/media/a.jpg", alt: "" };

/** Ein Block aus der Zeit vor `config`: Menü-Modus, fünf Ebenen, „Seite öffnen“. */
const legacyBlock: LegacyAttributes = {
  image: encodeImageAttribute(image),
  "image-alt": "Ein Lkw",
  source: "menu",
  points: encodePointsAttribute([{ id: "p1", x: 10, y: 20, title: "Kabine" }]),
  "display-mode": "dots",
  "menu-id": FAHRERHAUS,
  "menu-depth": "5",
  "menu-click": "open",
  "menu-points": "",
};

const fieldValue = (container: HTMLElement): string =>
  container.querySelector<HTMLInputElement>("#root_config")?.value ?? "";

async function open(formData: Record<string, string>): Promise<{ container: HTMLElement; stop: () => void }> {
  const { container } = render(
    <Form schema={configurationSchema} uiSchema={uiSchema} validator={validator} formData={formData} />,
  );
  let stop = (): void => {};
  await act(async () => {
    stop = startHotspotDialog(container);
  });
  await settleEditor('[data-testid="hotspot-editor"]', 6);
  return { container, stop };
}

describe("startHotspotDialog", () => {
  it("öffnet den Editor im gemeinsamen Rahmen mit Vorschau-Umschalter", async () => {
    const { stop } = await open({ config: encodeConfig({ ...DEFAULT_CONFIG, image }) });

    expect(modalRoot()?.textContent).toContain("Bild mit Punkten");
    expect(modalRoot()?.querySelector("h1")).toHaveTextContent("Punkte setzen");
    expect(queryInModal('[data-testid="hotspot-editor"]')).not.toBeNull();
    expect(queryInModal('[aria-label="Ansicht"]')).not.toBeNull();

    await act(async () => stop());
  });

  it("verändert einen alten Block durch Öffnen und Übernehmen nicht", async () => {
    const { container, stop } = await open(legacyBlock as Record<string, string>);

    await clickElement(queryInModal('[data-testid="config-shell-apply"]'));

    const config = fieldValue(container);
    expect(config).toBe("");
    expect(resolveConfig({ ...legacyBlock, config })).toEqual(resolveConfig(legacyBlock));
    await act(async () => stop());
  });

  it("übernimmt nach einer Änderung die lesbaren alten Werte, nicht die Vorgaben", async () => {
    const { container, stop } = await open(legacyBlock as Record<string, string>);

    // Der Menü-Modus ist im MUI-Select lesbar – sonst stünde hier „Manuell“.
    expect(queryInModal('[data-testid="menu-editor"]')).not.toBeNull();
    const enter = Array.from(modalRoot()?.querySelectorAll<HTMLElement>('[role="radio"]') ?? []).find(
      (radio) => radio.textContent === "Ins Untermenü wechseln",
    );
    await clickElement(enter);
    await clickElement(queryInModal('[data-testid="config-shell-apply"]'));

    const config = fieldValue(container);
    // MUI schreibt für „5 Ebenen“ die Stelle „3“, die zugleich ein Wert
    // wäre; der gezeigte Titel entscheidet.
    expect(parseConfigParts(config)).toMatchObject({ source: "menu", "menu.depth": 5, "menu.click": "enter" });
    expect(resolveConfig({ ...legacyBlock, config })).toEqual({
      ...resolveConfig(legacyBlock),
      menu: { ...resolveConfig(legacyBlock).menu, click: "enter" },
    });
    await act(async () => stop());
  });

  it("übernimmt keinen Punkt ohne Titel und nennt ihn im Status", async () => {
    const config = encodeConfig({ ...DEFAULT_CONFIG, image });
    const { container, stop } = await open({ config });

    const add = Array.from(modalRoot()?.querySelectorAll<HTMLElement>("button") ?? []).find(
      (button) => button.textContent?.trim() === "Neuer Punkt",
    );
    await clickElement(add);
    await clickElement(queryInModal('[data-testid="config-shell-apply"]'));

    expect(fieldValue(container)).toBe(config);
    expect(queryInModal('[role="status"]')).toHaveTextContent("Punkt 1: Titel fehlt");
    await act(async () => stop());
  });

  it("schreibt beim Übernehmen die geänderte Darstellung", async () => {
    const { container, stop } = await open({ config: encodeConfig({ ...DEFAULT_CONFIG, image }) });

    const dots = Array.from(modalRoot()?.querySelectorAll<HTMLElement>('[role="radio"]') ?? []).find(
      (radio) => radio.textContent === "Punkte",
    );
    await clickElement(dots);
    await clickElement(queryInModal('[data-testid="config-shell-apply"]'));

    expect(parseConfigParts(fieldValue(container))?.["manual.mode"]).toBe("dots");
    await act(async () => stop());
  });

  it("blendet die alten Felder im eigenen Dialog aus", async () => {
    const { container, stop } = await open(legacyBlock as Record<string, string>);

    expect(container.querySelector("#root_points")?.closest('[style*="display: none"]')).not.toBeNull();
    expect(container.querySelector("#root_config")).not.toBeNull();
    await act(async () => stop());
  });
});

describe("hotspotEditorShell", () => {
  it("heisst wie das Widget und zeigt eine Vorschau", () => {
    expect(hotspotEditorShell).toMatchObject({ widgetName: "Bild mit Punkten", title: "Punkte setzen", preview: true });
  });

  it("prüft Punkte ohne Titel und zählt Änderungen", () => {
    const point = { id: "a", x: 1, y: 1, title: "" };
    const draft = { config: { ...DEFAULT_CONFIG, manual: { mode: "numbered" as const, points: [point] } }, inherited: [] };

    expect(hotspotEditorShell.validate?.(draft)).toHaveLength(1);
    expect(hotspotEditorShell.statusText?.(draft, { config: DEFAULT_CONFIG, inherited: [] })).toBe("Punkt 1 neu");
  });
});
