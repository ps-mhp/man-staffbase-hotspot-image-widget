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
import { PageModal } from "./page-modal";

const renderModal = (overrides: Partial<React.ComponentProps<typeof PageModal>> = {}) =>
  render(
    <PageModal href="/content/pages/1" title="Laden zu Hause" onClose={jest.fn()} {...overrides} />,
  );

describe("PageModal", () => {
  it("zeigt die Seite in einem iFrame", () => {
    renderModal();
    const frame = screen.getByTitle("Laden zu Hause");
    expect(frame.tagName).toBe("IFRAME");
    expect(frame).toHaveAttribute("src", "/content/pages/1");
  });

  it("meldet sich als modaler Dialog an", () => {
    renderModal();
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
  });

  it("bietet immer den Weg in einen neuen Tab — manche Seiten lassen sich nicht einbetten", () => {
    renderModal();
    const link = screen.getByRole("link", { name: /neuem Tab/i });
    expect(link).toHaveAttribute("href", "/content/pages/1");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("schließt über den Knopf, über Escape und über den Hintergrund", () => {
    const onClose = jest.fn();
    renderModal({ onClose });
    fireEvent.click(screen.getByRole("button", { name: "Schließen" }));
    fireEvent.keyDown(document, { key: "Escape" });
    fireEvent.click(screen.getByTestId("page-modal-scrim"));
    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it("schließt nicht, wenn im Dialog selbst geklickt wird", () => {
    const onClose = jest.fn();
    renderModal({ onClose });
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("hält den Fokus im Dialog — sonst tabbte man hinter das Modal", () => {
    renderModal();
    const close = screen.getByRole("button", { name: "Schließen" });
    const external = screen.getByRole("link", { name: /neuem Tab/i });

    expect(close).toHaveFocus();

    // Rückwärts vom ersten Element springt der Fokus ans letzte.
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Tab", shiftKey: true });
    expect(external).toHaveFocus();

    // Und vorwärts vom letzten wieder ans erste.
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Tab" });
    expect(close).toHaveFocus();
  });

  it("gibt den Fokus beim Schließen dorthin zurück, wo er herkam", () => {
    const opener = document.createElement("button");
    document.body.appendChild(opener);
    opener.focus();

    const { unmount } = renderModal();
    expect(opener).not.toHaveFocus();
    unmount();
    expect(opener).toHaveFocus();

    opener.remove();
  });

  it("gibt den Hintergrund beim Schließen wieder zum Scrollen frei", () => {
    const { unmount } = renderModal();
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("");
  });
});
