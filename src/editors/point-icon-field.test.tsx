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

import { ICON_FIELD_MESSAGES, PointIconField } from "./point-icon-field";

jest.mock("@shared/media/media-client", () => ({ createMediaClient: () => ({}) }));
jest.mock("@shared/media/media-picker", () => ({
  MediaPicker: ({ onSelect }: { onSelect: (media: unknown) => void }) => (
    <button type="button" onClick={() => onSelect({ url: "https://example.test/neu.png", id: "m", fileName: "neu.png", kind: "image" })}>
      Aus Mediathek nehmen
    </button>
  ),
}));

const icon = { url: "https://example.test/alt.png", size: "s" as const };

describe("PointIconField", () => {
  it("wählt ein Bild aus der Mediathek in mittlerer Grösse", () => {
    const onChange = jest.fn();
    render(<PointIconField icon={undefined} onChange={onChange} />);

    expect(screen.getByText(ICON_FIELD_MESSAGES.hint)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: ICON_FIELD_MESSAGES.choose }));
    fireEvent.click(screen.getByRole("button", { name: "Aus Mediathek nehmen" }));

    expect(onChange).toHaveBeenCalledWith({ url: "https://example.test/neu.png", size: "m" });
  });

  it("behält beim Austausch die gewählte Grösse", () => {
    const onChange = jest.fn();
    render(<PointIconField icon={icon} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: ICON_FIELD_MESSAGES.change }));
    fireEvent.click(screen.getByRole("button", { name: "Aus Mediathek nehmen" }));

    expect(onChange).toHaveBeenCalledWith({ url: "https://example.test/neu.png", size: "s" });
  });

  it("ändert die Grösse und entfernt das Bild", () => {
    const onChange = jest.fn();
    render(<PointIconField icon={icon} onChange={onChange} />);

    fireEvent.change(screen.getByTestId("point-icon-size"), { target: { value: "l" } });
    expect(onChange).toHaveBeenCalledWith({ ...icon, size: "l" });

    fireEvent.click(screen.getByRole("button", { name: ICON_FIELD_MESSAGES.remove }));
    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it("setzt einen Hintergrund und kehrt zu transparent zurück", () => {
    const onChange = jest.fn();
    const { rerender } = render(<PointIconField icon={icon} onChange={onChange} />);

    fireEvent.change(screen.getByTestId("point-icon-background"), { target: { value: "red" } });
    expect(onChange).toHaveBeenLastCalledWith({ ...icon, background: "red" });

    rerender(<PointIconField icon={{ ...icon, background: "red" }} onChange={onChange} />);
    fireEvent.change(screen.getByTestId("point-icon-background"), { target: { value: "" } });
    expect(onChange).toHaveBeenLastCalledWith(icon);
  });

  it("behält beim Austausch des Bildes den Hintergrund", () => {
    const onChange = jest.fn();
    render(<PointIconField icon={{ ...icon, background: "white" }} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: ICON_FIELD_MESSAGES.change }));
    fireEvent.click(screen.getByRole("button", { name: "Aus Mediathek nehmen" }));

    expect(onChange).toHaveBeenCalledWith({ url: "https://example.test/neu.png", size: "s", background: "white" });
  });
});
