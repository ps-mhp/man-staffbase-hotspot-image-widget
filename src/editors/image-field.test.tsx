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

jest.mock("@shared/media/media-picker", () => ({
  MediaPicker: ({ onSelect, onClose }: { onSelect: (image: unknown) => void; onClose: () => void }) => (
    <div data-testid="media-picker">
      <button type="button" onClick={() => onSelect({ url: "https://example.test/neu.jpg", width: 1600, height: 900 })}>
        Bild wählen
      </button>
      <button type="button" onClick={onClose}>
        Abbrechen
      </button>
    </div>
  ),
}));

describe("ImageField", () => {
  it("zeigt ohne Bild nur die Aufforderung", () => {
    render(<ImageField image={null} onChange={jest.fn()} />);
    expect(screen.getByRole("button", { name: /Bild wählen/ })).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("öffnet die Mediathek und gibt das gewählte Bild weiter", () => {
    const onChange = jest.fn();
    render(<ImageField image={null} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /Bild wählen/ }));
    fireEvent.click(screen.getByRole("button", { name: "Bild wählen" }));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ url: "https://example.test/neu.jpg", width: 1600, height: 900 }),
    );
  });

  it("zeigt das gewählte Bild und lässt den Alternativtext ändern", () => {
    const image = { url: "https://example.test/a.jpg", alt: "Ein Auto" };
    const onChange = jest.fn();
    render(<ImageField image={image} onChange={onChange} />);
    expect(screen.getByRole("img")).toHaveAttribute("src", image.url);
    fireEvent.change(screen.getByLabelText(/Alternativtext/), { target: { value: "Ein Bus" } });
    expect(onChange).toHaveBeenCalledWith({ ...image, alt: "Ein Bus" });
  });

  it("nimmt das Bild wieder heraus", () => {
    const onChange = jest.fn();
    render(<ImageField image={{ url: "https://example.test/a.jpg", alt: "" }} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Bild entfernen" }));
    expect(onChange).toHaveBeenCalledWith(null);
  });
});
