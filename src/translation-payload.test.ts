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

import { HotspotPoint } from "./points-model";
import { pointsFromTranslated, pointsToTranslatable } from "./translation-payload";

const points: HotspotPoint[] = [
  {
    id: "p1",
    x: 25,
    y: 60,
    title: "Ladeanschluss",
    description: "CCS, bis 350 kW.",
    link: { kind: "page", href: "/content/pages/1", title: "Laden", label: "Mehr dazu" },
  },
  { id: "p2", x: 80, y: 30, title: "Kofferraum" },
];

describe("Übersetzung der Punkte", () => {
  it("verpackt jeden Text als eigenen Knoten — Attribute übersetzt das System nicht", () => {
    const html = pointsToTranslatable(points);
    expect(html).toContain("Ladeanschluss");
    expect(html).toContain("CCS, bis 350 kW.");
    expect(html).toContain("Mehr dazu");
    expect(html).toContain('data-point="p1"');
    expect(html).toContain('data-field="title"');
  });

  it("lässt Koordinaten und Adressen draußen", () => {
    const html = pointsToTranslatable(points);
    expect(html).not.toContain("/content/pages/1");
    expect(html).not.toContain(">25<");
  });

  it("überlebt den Rundlauf unverändert, wenn nichts übersetzt wurde", () => {
    expect(pointsFromTranslated(pointsToTranslatable(points), points)).toEqual(points);
  });

  it("übernimmt die übersetzten Texte und behält Koordinaten und Adresse", () => {
    const translated = pointsToTranslatable(points)
      .replace("Ladeanschluss", "Charging port")
      .replace("CCS, bis 350 kW.", "CCS, up to 350 kW.")
      .replace("Mehr dazu", "Learn more");

    const [first] = pointsFromTranslated(translated, points);
    expect(first).toEqual({
      ...points[0],
      title: "Charging port",
      description: "CCS, up to 350 kW.",
      link: { ...points[0].link, label: "Learn more" },
    });
  });

  it("behält den Originaltext, wenn im übersetzten Dokument ein Punkt fehlt", () => {
    expect(pointsFromTranslated("<div></div>", points)).toEqual(points);
  });
});
