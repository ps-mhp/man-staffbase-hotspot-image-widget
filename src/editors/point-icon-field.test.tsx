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
import userEvent from "@testing-library/user-event";
import { MediaClient } from "@shared/media/media-client";
import { PickedMedia } from "@shared/media/media-picker";

import { PointIcon } from "../point-icon";
import { EditorMedia, EditorMediaContext } from "./editor-media";
import { ICON_FIELD_MESSAGES, PointIconField, iconFromPick } from "./point-icon-field";

const icon: PointIcon = { url: "https://example.test/kantine.png", size: "m" };

function renderField(current: PointIcon | undefined): { onChange: jest.Mock; pick: jest.Mock } {
  const onChange = jest.fn();
  const pick = jest.fn();
  const media: EditorMedia = { client: {} as MediaClient, pick };
  render(
    <EditorMediaContext.Provider value={media}>
      <PointIconField icon={current} onChange={onChange} onPick={jest.fn()} aside="statt der Nummer" mediaTitle="Icon für Punkt 2" />
    </EditorMediaContext.Provider>,
  );
  return { onChange, pick };
}

describe("PointIconField", () => {
  it("zeigt ohne Icon „Kein Icon“ und öffnet die Mediathek mit dem Ziel im Titel", async () => {
    const { pick } = renderField(undefined);

    expect(screen.getByTestId("point-icon-medium")).toHaveTextContent(ICON_FIELD_MESSAGES.none);
    expect(screen.getByTestId("point-icon-medium")).toHaveAttribute("aria-haspopup", "dialog");
    expect(screen.queryByRole("radiogroup", { name: ICON_FIELD_MESSAGES.size })).toBeNull();
    await userEvent.click(screen.getByTestId("point-icon-medium"));

    expect(pick).toHaveBeenCalledWith("Icon für Punkt 2", expect.any(Function));
  });

  it("setzt Größe und Hintergrund über Pills", async () => {
    const { onChange } = renderField(icon);

    expect(screen.getByTestId("point-icon-medium")).toHaveTextContent("kantine.png");
    await userEvent.click(screen.getByRole("radio", { name: "L" }));
    expect(onChange).toHaveBeenLastCalledWith({ ...icon, size: "l" });

    await userEvent.click(screen.getByRole("radio", { name: "MAN-Rot" }));
    expect(onChange).toHaveBeenLastCalledWith({ ...icon, background: "red" });
  });

  it("nimmt den Hintergrund mit „Transparent“ wieder heraus", async () => {
    const { onChange } = renderField({ ...icon, background: "dark" });

    expect(screen.getByRole("radio", { name: "Anthrazit" })).toBeChecked();
    await userEvent.click(screen.getByRole("radio", { name: "Transparent" }));

    expect(onChange).toHaveBeenLastCalledWith(icon);
  });

  it("entfernt das Icon", async () => {
    const { onChange } = renderField(icon);

    await userEvent.click(screen.getByTestId("point-icon-remove"));

    expect(onChange).toHaveBeenCalledWith(undefined);
  });
});

describe("iconFromPick", () => {
  const picked = { url: "https://example.test/neu.png" } as PickedMedia;

  it("behält Größe und Hintergrund des bisherigen Icons", () => {
    expect(iconFromPick(picked, { ...icon, size: "s", background: "white" })).toEqual({
      url: picked.url,
      size: "s",
      background: "white",
    });
  });

  it("beginnt ohne bisheriges Icon mittelgroß ohne Hintergrund", () => {
    expect(iconFromPick(picked, undefined)).toEqual({ url: picked.url, size: "m" });
  });
});
