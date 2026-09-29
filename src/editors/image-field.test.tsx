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
import { ImageField } from "./image-field";

/** Was die Mediathek im jeweiligen Test zurueckgibt. */
// Jest verlangt fuer Variablen, die eine Mock-Fabrik liest, das Praefix `mock`.
let mockPicked: Record<string, unknown> = {
  url: "https://example.test/neu.jpg",
  width: 1600,
  height: 900,
};

jest.mock("@shared/media/media-picker", () => ({
  MediaPicker: ({ onSelect, onClose }: { onSelect: (image: unknown) => void; onClose: () => void }) => (
    <div data-testid="media-picker">
      <button type="button" onClick={() => onSelect(mockPicked)}>
        Bild wählen
      </button>
      <button type="button" onClick={onClose}>
        Abbrechen
      </button>
    </div>
  ),
}));

/** Oeffnet die Mediathek und waehlt darin das vorbereitete Bild. */
const chooseFromLibrary = (): void => {
  fireEvent.click(screen.getByRole("button", { name: /Bild wählen …/ }));
  fireEvent.click(screen.getByRole("button", { name: "Bild wählen" }));
};

beforeEach(() => {
  mockPicked = { url: "https://example.test/neu.jpg", width: 1600, height: 900 };
});

type Props = React.ComponentProps<typeof ImageField>;

const renderField = (overrides: Partial<Props> = {}) => {
  const props: Props = {
    image: null,
    alt: "",
    source: "field",
    onChange: jest.fn(),
    onAltChange: jest.fn(),
    ...overrides,
  };
  render(<ImageField {...props} />);
  return props;
};

describe("ImageField", () => {
  it("zeigt ohne Bild nur die Aufforderung", () => {
    renderField();
    expect(screen.getByRole("button", { name: /Bild wählen/ })).toBeInTheDocument();
    expect(screen.queryByTestId("image-preview")).not.toBeInTheDocument();
  });

  it("öffnet die Mediathek und gibt das gewählte Bild weiter", () => {
    const { onChange } = renderField();
    chooseFromLibrary();
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ url: "https://example.test/neu.jpg", width: 1600, height: 900 }),
    );
  });

  it("lässt den Alternativtext des gewählten Bildes ändern", () => {
    const image = { url: "https://example.test/a.jpg", alt: "Ein Auto" };
    const { onAltChange } = renderField({ image, alt: "Ein Auto" });
    // Keine eigene Vorschau: die Bühne im Editor zeigt dasselbe Bild.
    expect(screen.queryByTestId("image-preview")).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Alternativtext/)).toHaveValue("Ein Auto");
    fireEvent.change(screen.getByLabelText(/Alternativtext/), { target: { value: "Ein Bus" } });
    expect(onAltChange).toHaveBeenCalledWith("Ein Bus");
  });

  it("übernimmt den Alternativtext aus der Mediathek, wenn es noch keinen gibt", () => {
    mockPicked = { url: "https://example.test/neu.jpg", alt: "Aus der Mediathek" };
    const { onChange, onAltChange } = renderField();
    chooseFromLibrary();
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ alt: "Aus der Mediathek" }));
    expect(onAltChange).toHaveBeenCalledWith("Aus der Mediathek");
  });

  it("lässt einen vorhandenen Alternativtext beim Bildwechsel stehen", () => {
    // Der Text wurde für dieses Widget geschrieben; der aus der Mediathek
    // beschreibt nur die Datei. Ihn zu überschreiben nähme der Redaktion
    // unbemerkt ihre Arbeit weg.
    mockPicked = { url: "https://example.test/neu.jpg", alt: "Aus der Mediathek" };
    const { onChange, onAltChange } = renderField({
      image: { url: "https://example.test/alt.jpg", alt: "Ein Auto" },
      alt: "Ein Auto",
    });
    fireEvent.click(screen.getByRole("button", { name: /Anderes Bild wählen/ }));
    fireEvent.click(screen.getByRole("button", { name: "Bild wählen" }));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ alt: "Ein Auto" }));
    expect(onAltChange).not.toHaveBeenCalled();
  });

  it("achtet auch einen bewusst leer gelassenen Alternativtext", () => {
    // Leer heißt „dieses Bild ist schmückend" -- eine Aussage, kein Versäumnis.
    mockPicked = { url: "https://example.test/neu.jpg", alt: "Aus der Mediathek" };
    const { onChange } = renderField({ image: { url: "https://example.test/alt.jpg", alt: "" }, alt: "" });
    fireEvent.click(screen.getByRole("button", { name: /Anderes Bild wählen/ }));
    fireEvent.click(screen.getByRole("button", { name: "Bild wählen" }));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ alt: "" }));
  });

  it("nimmt das Bild wieder heraus", () => {
    const { onChange } = renderField({ image: { url: "https://example.test/a.jpg", alt: "" } });
    fireEvent.click(screen.getByRole("button", { name: "Bild entfernen" }));
    expect(onChange).toHaveBeenCalledWith(null);
  });
});

describe("ImageField im Content Designer", () => {
  // Dort wählt Staffbase das Bild im Formular; der Editor kann es nicht setzen.
  it("verweist ohne Bild auf das Formular statt auf die Mediathek", () => {
    renderField({ source: "designer" });
    expect(screen.queryByRole("button", { name: /Bild wählen/ })).not.toBeInTheDocument();
    expect(screen.getByTestId("image-field-designer-hint")).toHaveTextContent(/Formular/);
  });

  it("bietet mit Bild nur den Alternativtext an", () => {
    const { onAltChange } = renderField({
      source: "designer",
      image: { url: "https://example.test/a.jpg", alt: "" },
    });
    expect(screen.queryByRole("button", { name: /Anderes Bild wählen/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Bild entfernen" })).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/Alternativtext/), { target: { value: "Ein Bus" } });
    expect(onAltChange).toHaveBeenCalledWith("Ein Bus");
  });
});
