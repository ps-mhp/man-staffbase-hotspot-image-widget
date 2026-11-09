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

import { DEFAULT_CONFIG, HotspotConfig } from "../hotspot-config";
import { EDITOR_MESSAGES, HotspotEditor } from "./hotspot-editor";

jest.mock("./manual-panel", () => ({
  ...jest.requireActual("./manual-panel"),
  ManualPanel: ({ onPointsChange }: { onPointsChange: (points: unknown[]) => void }) => (
    <div data-testid="manual-panel">
      <button type="button" onClick={() => onPointsChange([{ id: "n", x: 1, y: 1, title: "Neu" }])}>
        Punkt setzen
      </button>
    </div>
  ),
}));
jest.mock("./menu-panel", () => ({
  MenuPanel: ({ onMenuChange, menu }: { onMenuChange: (menu: unknown) => void; menu: object }) => (
    <div data-testid="menu-panel">
      <button type="button" onClick={() => onMenuChange({ ...menu, depth: 5 })}>
        Tiefe setzen
      </button>
    </div>
  ),
}));

function renderEditor(value: HotspotConfig = DEFAULT_CONFIG) {
  const props = { value, onChange: jest.fn(), onSave: jest.fn(), onClose: jest.fn(), dirty: false };
  const view = render(<HotspotEditor {...props} />);
  return { ...props, ...view };
}

describe("HotspotEditor", () => {
  it("zeigt im manuellen Modus Darstellung und manuelles Panel", () => {
    renderEditor();

    expect(screen.getByTestId("manual-panel")).toBeInTheDocument();
    expect(screen.getByTestId("editor-display-mode")).toHaveValue("numbered");
    expect(screen.getByRole("radio", { name: EDITOR_MESSAGES.manual })).toHaveAttribute("aria-checked", "true");
  });

  it("schaltet den Modus im Entwurf um", () => {
    const { onChange } = renderEditor();

    fireEvent.click(screen.getByRole("radio", { name: EDITOR_MESSAGES.menu }));

    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT_CONFIG, source: "menu" });
  });

  it("zeigt im Menü-Modus das Menü-Panel ohne Darstellung", () => {
    const { onChange } = renderEditor({ ...DEFAULT_CONFIG, source: "menu" });

    expect(screen.getByTestId("menu-panel")).toBeInTheDocument();
    expect(screen.queryByTestId("editor-display-mode")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Tiefe setzen" }));
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT_CONFIG, source: "menu", menu: { ...DEFAULT_CONFIG.menu, depth: 5 } });
  });

  it("ändert die Darstellung und die Punkte im Entwurf", () => {
    const { onChange } = renderEditor();

    fireEvent.change(screen.getByTestId("editor-display-mode"), { target: { value: "dots" } });
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT_CONFIG, manual: { mode: "dots", points: [] } });

    fireEvent.click(screen.getByRole("button", { name: "Punkt setzen" }));
    expect(onChange).toHaveBeenCalledWith({
      ...DEFAULT_CONFIG,
      manual: { mode: "numbered", points: [{ id: "n", x: 1, y: 1, title: "Neu" }] },
    });
  });

  it("speichert und schliesst", () => {
    const { onSave, onClose } = renderEditor();

    fireEvent.click(screen.getByRole("button", { name: EDITOR_MESSAGES.save }));
    fireEvent.click(screen.getByRole("button", { name: EDITOR_MESSAGES.cancel }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("lässt einen manuellen Punkt ohne Titel nicht übernehmen — auch im Menü-Modus", () => {
    const { onSave } = renderEditor({
      ...DEFAULT_CONFIG,
      source: "menu",
      manual: { mode: "numbered", points: [{ id: "p", x: 1, y: 1, title: "" }] },
    });

    expect(screen.getByTestId("point-editor-untitled")).toHaveTextContent(EDITOR_MESSAGES.untitled(1));
    fireEvent.click(screen.getByRole("button", { name: EDITOR_MESSAGES.save }));
    expect(onSave).not.toHaveBeenCalled();
  });

  it("legt das Stylesheet als Stil an, nicht als Text ins Fenster", () => {
    const { container } = renderEditor();

    expect(container.querySelector("style")).not.toBeNull();
    expect(screen.queryByText(/man-hie__layout/)).not.toBeInTheDocument();
  });
});
