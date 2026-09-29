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
import { ReactElement, useState } from "react";
import { act, render, screen } from "@testing-library/react";

import { encodeImageAttribute, parseImage } from "../points-model";
import {
  imageSource,
  readImageAlt,
  readImageAttribute,
  writeImageAlt,
  writeImageAttribute,
} from "./use-image-attribute";

const mountField = (value = ""): HTMLInputElement => {
  const field = document.createElement("input");
  field.id = "root_image";
  field.value = value;
  document.body.appendChild(field);
  return field;
};

describe("Zugriff auf das Bildfeld des Dialogs", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("liest das Bild aus dem Feld des Dialogs", () => {
    const image = { url: "https://example.test/a.jpg", alt: "Ein Auto" };
    mountField(encodeImageAttribute(image));
    expect(readImageAttribute()).toEqual(image);
  });

  it("ist ohne Feld null, statt zu werfen — der Dialog kann anders aufgebaut sein", () => {
    expect(readImageAttribute()).toBeNull();
  });

  it("schreibt den Wert ins Feld und meldet die Änderung an", () => {
    const field = mountField();
    const changes = jest.fn();
    field.addEventListener("input", changes);

    const image = { url: "https://example.test/b.jpg", alt: "" };
    expect(writeImageAttribute(image)).toBe(true);
    expect(parseImage(field.value)).toEqual(image);
    expect(changes).toHaveBeenCalled();
  });

  it("meldet false, wenn das Feld fehlt", () => {
    expect(writeImageAttribute(null)).toBe(false);
  });
});

/**
 * So baut der Content Designer das Feld `image` auf (live gesehen am
 * 29.09.2026): kein Eingabefeld, sondern ein eigener Bild-Upload mit
 * Vorschaukarte. Nur die Beschriftung verweist noch auf `root_image`.
 */
const mountDesignerImage = (src: string | null): void => {
  document.body.innerHTML = `
    <div>
      <label for="root_image">Bild</label>
      <div class="relative w-full">
        <div data-c13y-component="field" class="ds-field__root">
          ${src === null ? "<button>Datei hochladen</button>" : `<div data-c13y-component="card"><img src="${src}" alt="x.jpg"></div>`}
        </div>
      </div>
      <span aria-describedby="root_image">Hilfe</span>
    </div>`;
};

describe("Bildfeld des Content Designers", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("erkennt, woher das Bild kommt", () => {
    expect(imageSource()).toBeNull();
    mountDesignerImage(null);
    expect(imageSource()).toBe("designer");
    document.body.innerHTML = "";
    mountField();
    expect(imageSource()).toBe("field");
  });

  it("liest das Bild aus der Vorschau des Designers", () => {
    mountDesignerImage("https://example.test/upload/a.jpg");
    expect(readImageAttribute()).toEqual({ url: "https://example.test/upload/a.jpg", alt: "" });
  });

  it("ist null, solange im Designer kein Bild gewählt ist", () => {
    mountDesignerImage(null);
    expect(readImageAttribute()).toBeNull();
  });

  it("schreibt nicht in den Upload des Designers — der gehört Staffbase", () => {
    mountDesignerImage("https://example.test/upload/a.jpg");
    expect(writeImageAttribute({ url: "https://example.test/b.jpg", alt: "" })).toBe(false);
  });
});

describe("Feld für den Alternativtext", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("liest und schreibt das Feld image-alt", () => {
    const field = document.createElement("input");
    field.id = "root_image-alt";
    field.value = "Ein Auto";
    document.body.appendChild(field);

    expect(readImageAlt()).toBe("Ein Auto");
    expect(writeImageAlt("Ein Bus")).toBe(true);
    expect(field.value).toBe("Ein Bus");
  });

  it("ist ohne Feld null bzw. false", () => {
    expect(readImageAlt()).toBeNull();
    expect(writeImageAlt("x")).toBe(false);
  });
});

/**
 * Ein von React gefuehrtes Feld, wie es der Konfigurationsdialog aufbaut --
 * und daneben, was React davon mitbekommen hat.
 *
 * Ohne dieses Gegenstueck taugt der Test nichts: gegen einen nackten
 * DOM-Input bliebe auch ein schlichtes `field.value = …` gruen, waehrend der
 * Dialog in Wahrheit den alten Wert speicherte. Der Schaden zeigt sich erst
 * dort, wo React den Wert haelt.
 */
const ControlledField = (): ReactElement => {
  const [value, setValue] = useState("");
  return React.createElement(
    React.Fragment,
    null,
    React.createElement("input", {
      id: "root_image",
      value,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value),
    }),
    React.createElement("output", null, value),
  );
};

describe("Schreiben in ein Feld, das React fuehrt", () => {
  it("laesst den Wert wirklich bei React ankommen", () => {
    render(React.createElement(ControlledField));
    const image = { url: "https://example.test/c.jpg", alt: "Ein Auto" };

    act(() => {
      expect(writeImageAttribute(image)).toBe(true);
    });

    expect(parseImage(screen.getByRole("status").textContent ?? "")).toEqual(image);
  });
});
