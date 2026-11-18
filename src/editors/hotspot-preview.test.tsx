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

import { DEFAULT_CONFIG } from "../hotspot-config";
import { HotspotPreview } from "./hotspot-preview";

const image = { url: "https://example.test/werksplan.jpg", alt: "Werksplan" };

describe("HotspotPreview", () => {
  it("zeigt die echte Leseansicht, unbedienbar", () => {
    render(
      <HotspotPreview
        config={{ ...DEFAULT_CONFIG, image, manual: { mode: "numbered", points: [{ id: "a", x: 1, y: 1, title: "Empfang" }] } }}
      />,
    );

    const preview = screen.getByTestId("hotspot-preview");
    expect(preview).toHaveAttribute("inert");
    expect(preview.querySelector("img")).toHaveAttribute("src", image.url);
    expect(preview).toHaveTextContent("Empfang");
  });

  it("sagt ohne Bild oder Punkte, dass die Seite nichts zeigt", () => {
    render(<HotspotPreview config={{ ...DEFAULT_CONFIG, image }} />);

    expect(screen.getByTestId("hotspot-preview-empty")).toHaveTextContent("zeigt das Widget auf der Seite nichts");
  });
});
