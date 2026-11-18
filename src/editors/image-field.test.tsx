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
import userEvent from "@testing-library/user-event";
import { MediaClient } from "@shared/media/media-client";
import { PickedMedia } from "@shared/media/media-picker";

import { HotspotImage } from "../points-model";
import { EditorMediaContext, fileNameOf, imageFromPick } from "./editor-media";
import { IMAGE_FIELD_MESSAGES, ImageField } from "./image-field";

const image: HotspotImage = { url: "https://example.test/media/werksplan.jpg?token=1", alt: "Werksplan", width: 1600, height: 900 };

function renderField(current: HotspotImage | null): { onChange: jest.Mock; onPick: jest.Mock; pick: jest.Mock } {
  const onChange = jest.fn();
  const onPick = jest.fn();
  const pick = jest.fn();
  render(
    <EditorMediaContext.Provider value={{ client: {} as MediaClient, pick }}>
      <ImageField label="Bild" image={current} onChange={onChange} onPick={onPick} hint="Hinweis" testId="img" />
    </EditorMediaContext.Provider>,
  );
  return { onChange, onPick, pick };
}

describe("ImageField", () => {
  it("bietet ohne Bild nur die Wahl an", async () => {
    const { pick, onPick } = renderField(null);

    expect(screen.queryByLabelText(IMAGE_FIELD_MESSAGES.alt)).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: `Bild: ${IMAGE_FIELD_MESSAGES.pick}` }));

    expect(pick).toHaveBeenCalledWith("Bild", onPick);
  });

  it("zeigt Dateiname und Maße und ändert die Bildbeschreibung", () => {
    const { onChange } = renderField(image);

    expect(screen.getByText("werksplan.jpg")).toBeInTheDocument();
    expect(screen.getByText("1600 × 900 px")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(IMAGE_FIELD_MESSAGES.alt), { target: { value: "Plan" } });

    expect(onChange).toHaveBeenCalledWith({ ...image, alt: "Plan" });
  });

  it("ersetzt und entfernt das Bild", async () => {
    const { onChange, pick } = renderField(image);

    await userEvent.click(screen.getByRole("button", { name: "Bild ersetzen" }));
    expect(pick).toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Bild entfernen" }));
    expect(onChange).toHaveBeenCalledWith(null);
  });
});

describe("imageFromPick", () => {
  const picked = { url: "https://example.test/neu.jpg", alt: "Aus der Mediathek", width: 800, height: 600 } as PickedMedia;

  it("übernimmt ohne bisheriges Bild den Text aus der Mediathek", () => {
    expect(imageFromPick(picked, null)).toEqual({ url: picked.url, alt: "Aus der Mediathek", width: 800, height: 600 });
  });

  it("behält einen bisherigen Text, auch einen bewusst leeren", () => {
    expect(imageFromPick(picked, { url: "x", alt: "" }).alt).toBe("");
    expect(imageFromPick(picked, image).alt).toBe("Werksplan");
  });

  it("nennt die Datei ohne Pfad und Parameter", () => {
    expect(fileNameOf(image.url)).toBe("werksplan.jpg");
  });
});
