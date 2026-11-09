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
import { render, screen } from "@testing-library/react";
import { HotspotImageWidget } from "./index";
import { ALL_ATTRIBUTES, configurationSchema, uiSchema } from "./configuration-schema";
import { encodeImageAttribute, encodePointsAttribute } from "./points-model";
import { encodeMenuLayout } from "./menu-points-model";

const image = encodeImageAttribute({ url: "https://example.test/a.jpg", alt: "Ein Auto" });
const points = encodePointsAttribute([{ id: "p1", x: 10, y: 20, title: "Ladeanschluss" }]);

describe("Namen der Attribute", () => {
  it("sind genau die Schlüssel, unter denen der Dialog speichert", () => {
    // Die Wirtsseite schreibt den Wert unter dem Schlüssel des Schemas, und der
    // DOM macht Attributnamen klein. Ein Großbuchstabe hier, und das Widget
    // liest einen Namen, den niemand schreibt — die Konfiguration bliebe stumm
    // weg, ohne Fehlermeldung.
    expect(Object.keys(configurationSchema.properties!)).toEqual(ALL_ATTRIBUTES);
  });

  it("sind durchweg klein geschrieben", () => {
    for (const name of ALL_ATTRIBUTES) {
      expect(name).toBe(name.toLowerCase());
    }
  });

  it("sind auch die Schlüssel, unter denen die Hinweise des Dialogs liegen", () => {
    // Ein Hinweis unter einem Schlüssel, den das Schema nicht kennt, wird still
    // verworfen — der Redakteur verlöre den Hilfetext, ohne dass es auffällt.
    for (const name of Object.keys(uiSchema)) {
      expect(Object.keys(configurationSchema.properties!)).toContain(name);
    }
  });
});

describe("HotspotImageWidget", () => {
  it("liest Bild und Punkte aus den Attributen", () => {
    render(
      <HotspotImageWidget
        contentLanguage="de_DE"
        image={image}
        points={points}
        display-mode="dots"
      />,
    );
    expect(screen.getByAltText("Ein Auto")).toBeInTheDocument();
    expect(screen.getByTestId("marker-p1")).toBeInTheDocument();
  });

  it("zeigt ohne Attribute nichts, statt zu scheitern", () => {
    const { container } = render(<HotspotImageWidget contentLanguage="de_DE" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("nimmt ohne Angabe die nummerierte Darstellung", () => {
    render(<HotspotImageWidget contentLanguage="de_DE" image={image} points={points} />);
    expect(screen.getByTestId("item-p1")).toBeInTheDocument();
  });

  it("wertet den Anzeigemodus wirklich aus", () => {
    // Marker stehen in beiden Modi; nur die Liste hängt am Modus. Ohne diesen
    // Gegensatz bliebe der Test auch dann grün, wenn das Attribut gar nicht
    // gelesen würde.
    const { unmount } = render(
      <HotspotImageWidget
        contentLanguage="de_DE"
        image={image}
        points={points}
        display-mode="dots"
      />,
    );
    expect(screen.queryByTestId("item-p1")).not.toBeInTheDocument();
    unmount();

    render(
      <HotspotImageWidget
        contentLanguage="de_DE"
        image={image}
        points={points}
        display-mode="numbered"
      />,
    );
    expect(screen.getByTestId("item-p1")).toBeInTheDocument();
  });
  it("zeigt im Modus „Menü“ die Menüpunkte statt der eigenen Punkte", async () => {
    const menuId = "6a58dd4eefeacc1239d9fd09";
    globalThis.fetch = jest.fn().mockResolvedValue({ ok: false, status: 404, json: async () => ({}) }) as unknown as typeof fetch;

    render(
      <HotspotImageWidget
        contentLanguage="de_DE"
        image={image}
        points={points}
        source="menu"
        menu-id={`/content/page/${menuId}`}
        menu-points={encodeMenuLayout({ [menuId]: { points: [{ id: "m1", menuId: "6a73580860fe1414378d4660", x: 1, y: 2 }] } })}
      />,
    );

    expect(screen.queryByTestId("item-p1")).not.toBeInTheDocument();
    expect(screen.getByAltText("Ein Auto")).toBeInTheDocument();
    // Das Menü kam nicht: Bild ja, Punkte nein, dafür der Hinweis.
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledWith(`/api/menu/${menuId}`, expect.anything());
  });
});
