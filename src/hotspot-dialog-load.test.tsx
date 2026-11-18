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
 * Der Editor ist ein nachgeladener Teil. Kommt er nicht an – im Studio etwa,
 * weil `serve:watch` das Widget neu gebaut hat und die Kennung des Teils, nach
 * der das schon geladene Bündel fragt, nicht mehr gibt (404) –, darf das
 * Fenster nicht still verschwinden. Nachgestellt am 18.11.2026 im Studio
 * (truck, „Preview | Widgets | Hotspot Image“): ohne Teil kein Fenster, kein
 * Knopf im Feld, nur ein „Uncaught ChunkLoadError“ in der Konsole.
 */

import * as React from "react";
import { act, render } from "@testing-library/react";
import Form from "@rjsf/mui";
import validator from "@rjsf/validator-ajv8";

import { modalRoot, settleModal } from "@shared/ui/config-modal.testing";

import { configurationSchema, uiSchema } from "./configuration-schema";
import { DEFAULT_CONFIG, encodeConfig } from "./hotspot-config";
import { startHotspotDialog } from "./hotspot-dialog";

let mockEditorMissing = false;

jest.mock("./editors/hotspot-editor", () => {
  if (mockEditorMissing) {
    throw Object.assign(new Error("Loading chunk 518 failed."), { name: "ChunkLoadError" });
  }
  return jest.requireActual("./editors/hotspot-editor");
});
jest.mock("./menu/use-menu-tree", () => ({
  useMenuTree: () => ({ status: "loading" }),
}));

const image = { url: "https://www.mti.man/api/media/a.jpg", alt: "" };

/** Länger als die eine Wiederholung, die das Laden von sich aus versucht. */
async function settleLoading(): Promise<void> {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
  });
  await settleModal();
}

const inModal = (selector: string): HTMLElement | null => modalRoot()?.querySelector<HTMLElement>(selector) ?? null;

const buttonInModal = (label: string): HTMLElement | undefined =>
  Array.from(modalRoot()?.querySelectorAll<HTMLElement>("button") ?? []).find(
    (button) => button.textContent?.trim() === label,
  );

async function open(): Promise<() => void> {
  const { container } = render(
    <Form
      schema={configurationSchema}
      uiSchema={uiSchema}
      validator={validator}
      formData={{ config: encodeConfig({ ...DEFAULT_CONFIG, image }) }}
    />,
  );
  let stop = (): void => {};
  await act(async () => {
    stop = startHotspotDialog(container);
  });
  await settleLoading();
  return stop;
}

describe("startHotspotDialog, wenn der Editor nicht lädt", () => {
  // Jedes Laden wartet einmal die Wiederholung ab; unter Last mehr als die
  // fünf Sekunden, die Jest sonst gibt.
  jest.setTimeout(20000);

  afterEach(() => {
    mockEditorMissing = false;
    jest.restoreAllMocks();
  });

  it("lässt das Fenster offen, meldet es und lädt auf „Erneut versuchen“ nach", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockEditorMissing = true;
    const stop = await open();

    expect(inModal('[data-testid="config-shell"]')).not.toBeNull();
    expect(inModal('[role="alert"]')).toHaveTextContent("ließ sich nicht laden");
    expect(inModal('[data-testid="hotspot-editor"]')).toBeNull();

    mockEditorMissing = false;
    await act(async () => buttonInModal("Erneut versuchen")?.click());
    await settleLoading();

    expect(inModal('[role="alert"]')).toBeNull();
    expect(inModal('[data-testid="hotspot-editor"]')).not.toBeNull();
    await act(async () => stop());
  });
});
