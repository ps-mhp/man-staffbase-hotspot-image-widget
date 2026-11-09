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

import { CONFIG_ATTRIBUTE, POINTS_ATTRIBUTE } from "./configuration-schema";
import { DEFAULT_CONFIG, encodeConfig, parseConfig } from "./hotspot-config";
import { encodePointsAttribute, HotspotPoint, parsePoints } from "./points-model";
import { hotspotConfigTranslationProvider, hotspotTranslationProvider as provider } from "./translation-provider";

const points: HotspotPoint[] = [
  {
    id: "p1",
    x: 25,
    y: 60,
    title: "Ladeanschluss",
    link: { kind: "page", href: "/content/pages/1", label: "Mehr dazu" },
  },
  { id: "p2", x: 80, y: 30, title: "Kofferraum" },
];

const stored = encodePointsAttribute(points);

describe("hotspotTranslationProvider", () => {
  it("zeigt auf das Attribut, in dem die Punkte wirklich stehen", () => {
    expect(provider.ref).toEqual({ tagName: "hotspot-image-widget", attribute: POINTS_ATTRIBUTE });
  });

  it("macht aus dem gespeicherten Wert Markup, das der Dienst übersetzt", () => {
    const html = provider.toTranslatable(stored) as string;
    expect(html).toContain("Ladeanschluss");
    expect(provider.acceptsTranslated(html)).toBe(true);
  });

  it("überspringt einen Punkt-Katalog ohne Attribut", () => {
    expect(provider.toTranslatable(null)).toBeNull();
  });

  it("überspringt einen leeren Punkt-Katalog", () => {
    expect(provider.toTranslatable(encodePointsAttribute([]))).toBeNull();
  });

  it("schreibt den übersetzten Text zurück und lässt Koordinaten und Adresse stehen", () => {
    const html = provider.toTranslatable(stored) as string;
    const answer = html.replace("Ladeanschluss", "Charging port").replace("Mehr dazu", "Learn more");

    const next = provider.fromTranslated(answer, stored) as string;
    const [first, second] = parsePoints(next);

    expect(first.title).toBe("Charging port");
    expect(first.x).toBe(25);
    expect(first.y).toBe(60);
    expect(first.link).toEqual({ kind: "page", href: "/content/pages/1", label: "Learn more" });
    expect(second).toEqual(points[1]);
  });

  it("weist eine Antwort ab, die nicht von dieser Anfrage stammt", () => {
    expect(provider.acceptsTranslated("<p>Ein Artikel</p>")).toBe(false);
  });
});

describe("hotspotConfigTranslationProvider", () => {
  const config = { ...DEFAULT_CONFIG, manual: { mode: "dots" as const, points } };
  const storedConfig = encodeConfig(config);

  it("zeigt auf config", () => {
    expect(hotspotConfigTranslationProvider.ref).toEqual({ tagName: "hotspot-image-widget", attribute: CONFIG_ATTRIBUTE });
  });

  it("übersetzt die eigenen Punkte und lässt den Rest der Konfiguration stehen", () => {
    const html = hotspotConfigTranslationProvider.toTranslatable(storedConfig) as string;
    expect(html).toContain("Ladeanschluss");

    const translated = hotspotConfigTranslationProvider.fromTranslated(
      html.replace("Ladeanschluss", "Charging port"),
      storedConfig,
    ) as string;

    const result = parseConfig(translated);
    expect(result?.manual.points[0].title).toBe("Charging port");
    expect(result?.manual.mode).toBe("dots");
  });

  it("hat nichts zu übersetzen ohne config oder ohne eigene Punkte", () => {
    expect(hotspotConfigTranslationProvider.toTranslatable(null)).toBeNull();
    expect(hotspotConfigTranslationProvider.toTranslatable(encodeConfig(DEFAULT_CONFIG))).toBeNull();
  });
});

