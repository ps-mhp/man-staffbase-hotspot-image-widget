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
import { encodeImageAttribute, encodePointsAttribute } from "./points-model";

const image = encodeImageAttribute({ url: "https://example.test/a.jpg", alt: "Ein Auto" });
const points = encodePointsAttribute([{ id: "p1", x: 10, y: 20, title: "Ladeanschluss" }]);

describe("HotspotImageWidget", () => {
  it("liest Bild und Punkte aus den Attributen", () => {
    render(<HotspotImageWidget image={image} points={points} display-mode="dots" />);
    expect(screen.getByAltText("Ein Auto")).toBeInTheDocument();
    expect(screen.getByTestId("marker-p1")).toBeInTheDocument();
  });

  it("zeigt ohne Attribute nichts, statt zu scheitern", () => {
    const { container } = render(<HotspotImageWidget />);
    expect(container).toBeEmptyDOMElement();
  });

  it("nimmt ohne Angabe die nummerierte Darstellung", () => {
    render(<HotspotImageWidget image={image} points={points} />);
    expect(screen.getByTestId("item-p1")).toBeInTheDocument();
  });
});
