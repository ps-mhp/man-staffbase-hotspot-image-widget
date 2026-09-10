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
import { HotspotImage } from "./hotspot-image";
import { HotspotPoint } from "./points-model";

const image = { url: "https://example.test/auto.jpg", alt: "Ein Auto von der Seite" };

const points: HotspotPoint[] = [
  { id: "p1", x: 25, y: 60, title: "Ladeanschluss", description: "CCS, bis 350 kW." },
  {
    id: "p2",
    x: 80,
    y: 30,
    title: "Kofferraum",
    link: { kind: "page", href: "/content/pages/1", title: "Laden zu Hause" },
  },
  { id: "p3", x: 50, y: 50, title: "Handbuch", link: { kind: "url", href: "https://example.test/pdf" } },
];

describe("HotspotImage", () => {
  it("rendert nichts ohne Bild — ein leerer Rahmen wäre schlimmer als nichts", () => {
    const { container } = render(<HotspotImage image={null} points={points} mode="numbered" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("rendert nichts ohne Punkte", () => {
    const { container } = render(<HotspotImage image={image} points={[]} mode="numbered" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("zeigt das Bild mit seinem Alternativtext", () => {
    render(<HotspotImage image={image} points={points} mode="dots" />);
    expect(screen.getByAltText("Ein Auto von der Seite")).toHaveAttribute("src", image.url);
  });

  it("zeigt im Punkte-Modus keine Liste, im nummerierten schon", () => {
    const { rerender } = render(<HotspotImage image={image} points={points} mode="dots" />);
    expect(screen.queryByTestId("item-p1")).not.toBeInTheDocument();
    rerender(<HotspotImage image={image} points={points} mode="numbered" />);
    expect(screen.getByTestId("item-p1")).toBeInTheDocument();
  });

  it("öffnet im Punkte-Modus das Popover am Marker", () => {
    render(<HotspotImage image={image} points={points} mode="dots" />);
    fireEvent.click(screen.getByTestId("marker-p1"));
    expect(screen.getByRole("dialog", { name: "Ladeanschluss" })).toBeInTheDocument();
  });

  it("hat im nummerierten Modus kein Popover, sondern klappt die Liste auf", () => {
    render(<HotspotImage image={image} points={points} mode="numbered" />);
    fireEvent.click(screen.getByTestId("marker-p1"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByText("CCS, bis 350 kW.")).toBeInTheDocument();
  });

  it("schließt den offenen Punkt beim zweiten Klick", () => {
    render(<HotspotImage image={image} points={points} mode="dots" />);
    fireEvent.click(screen.getByTestId("marker-p1"));
    fireEvent.click(screen.getByTestId("marker-p1"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("hat immer nur einen Punkt offen", () => {
    render(<HotspotImage image={image} points={points} mode="dots" />);
    fireEvent.click(screen.getByTestId("marker-p1"));
    fireEvent.click(screen.getByTestId("marker-p2"));
    expect(screen.getByRole("dialog", { name: "Kofferraum" })).toBeInTheDocument();
    expect(screen.queryByRole("dialog", { name: "Ladeanschluss" })).not.toBeInTheDocument();
  });

  it("öffnet eine Seite des Systems im Modal", () => {
    render(<HotspotImage image={image} points={points} mode="dots" />);
    fireEvent.click(screen.getByTestId("marker-p2"));
    fireEvent.click(screen.getByRole("button", { name: "Seite öffnen" }));
    expect(screen.getByTitle("Laden zu Hause")).toHaveAttribute("src", "/content/pages/1");
  });

  it("gibt den Fokus an das Modal ab, statt ihn hinter dem Modal zu lassen", () => {
    // Das Popover verschwindet beim Öffnen des Modals, und der Effekt des
    // Elternteils holte den Fokus auf den Marker zurück -- hinter das Modal,
    // wo dessen Fokusfang nicht mehr greift. Wer mit der Tastatur arbeitet,
    // tabte dann durch die verdeckte Seite statt durch den Dialog.
    render(<HotspotImage image={image} points={points} mode="dots" />);
    fireEvent.click(screen.getByTestId("marker-p2"));
    fireEvent.click(screen.getByRole("button", { name: "Seite öffnen" }));

    const panel = screen.getByTitle("Laden zu Hause").closest("[role='dialog']");
    expect(panel).not.toBeNull();
    expect(panel).toContainElement(document.activeElement as HTMLElement);
  });

  it("bringt den Fokus nach dem Schliessen des Modals zum Marker zurück", () => {
    render(<HotspotImage image={image} points={points} mode="dots" />);
    fireEvent.click(screen.getByTestId("marker-p2"));
    fireEvent.click(screen.getByRole("button", { name: "Seite öffnen" }));
    fireEvent.keyDown(document, { key: "Escape" });

    expect(document.activeElement).toBe(screen.getByTestId("marker-p2"));
  });

  it("gibt den Fokus auch nach einem Klick daneben zum Marker zurück", () => {
    // Bisher war nur der Weg über Escape abgedeckt. Das Schliessen per Klick
    // daneben läuft über eine andere Ereigniskette und blieb ungeprüft.
    render(<HotspotImage image={image} points={points} mode="dots" />);
    fireEvent.click(screen.getByTestId("marker-p1"));
    fireEvent.mouseDown(document.body);

    expect(document.activeElement).toBe(screen.getByTestId("marker-p1"));
  });

  it("lässt den Fokus in der Liste, wenn ein Eintrag wieder zugeklappt wird", () => {
    // In der nummerierten Darstellung gibt es kein Popover, dem der Fokus
    // zurückzugeben wäre. Ihn trotzdem aufs Bild zu ziehen, risse ihn beim
    // Zuklappen aus der Liste heraus -- gerade dort, wo mit der Tastatur
    // gelesen wird.
    render(<HotspotImage image={image} points={points} mode="numbered" />);
    const item = screen.getByTestId("item-p1");
    item.focus();
    fireEvent.click(item);
    fireEvent.click(item);

    expect(document.activeElement).toBe(item);
  });

  it("nimmt den Titel des Punktes, wenn der Link keinen mitbringt", () => {
    const untitled: HotspotPoint[] = [
      { id: "p4", x: 10, y: 10, title: "Dach", link: { kind: "page", href: "/content/pages/2" } },
    ];
    render(<HotspotImage image={image} points={untitled} mode="dots" />);
    fireEvent.click(screen.getByTestId("marker-p4"));
    fireEvent.click(screen.getByRole("button", { name: "Seite öffnen" }));
    expect(screen.getByRole("dialog", { name: "Dach" })).toBeInTheDocument();
  });

  it("gibt den Fokus an den Marker zurück, wenn das Popover schließt", () => {
    render(<HotspotImage image={image} points={points} mode="dots" />);
    const marker = screen.getByTestId("marker-p1");
    fireEvent.click(marker);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(marker).toHaveFocus();
  });

  it("scrollt den geöffneten Listeneintrag ins Bild", () => {
    const scrollIntoView = jest.fn();
    // jsdom kennt die Methode nicht — sie muss auf dem Prototyp liegen,
    // bevor der Eintrag gerendert wird.
    Element.prototype.scrollIntoView = scrollIntoView;
    render(<HotspotImage image={image} points={points} mode="numbered" />);
    fireEvent.click(screen.getByTestId("marker-p1"));
    expect(scrollIntoView).toHaveBeenCalled();
  });

  it("schickt eine freie URL in einen neuen Tab statt ins iFrame", () => {
    const open = jest.spyOn(window, "open").mockImplementation(() => null);
    render(<HotspotImage image={image} points={points} mode="dots" />);
    fireEvent.click(screen.getByTestId("marker-p3"));
    fireEvent.click(screen.getByRole("button", { name: "Seite öffnen" }));
    expect(open).toHaveBeenCalledWith("https://example.test/pdf", "_blank", "noopener,noreferrer");
    // Der Punkt heißt selbst „Handbuch“, deshalb hier nicht über den Namen:
    // geprüft wird, dass gar kein Modal aufgegangen ist.
    expect(screen.queryByTestId("page-modal-scrim")).not.toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Handbuch" })).toBeInTheDocument();
    open.mockRestore();
  });

  it("lässt den Listeneintrag offen, während das Modal darüber steht", () => {
    render(<HotspotImage image={image} points={points} mode="numbered" />);
    fireEvent.click(screen.getByTestId("item-p2"));
    fireEvent.click(screen.getByRole("button", { name: "Seite öffnen" }));
    expect(screen.getByTestId("page-modal-scrim")).toBeInTheDocument();
    expect(screen.getByTestId("item-p2")).toHaveAttribute("aria-expanded", "true");
  });
});
