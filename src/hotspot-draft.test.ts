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

import { decodePayload } from "@shared/payload";

import { DEFAULT_CONFIG, HotspotConfig, encodeConfig, resolveConfig } from "./hotspot-config";
import { HotspotDraft, changeConfig, draftFromSources, parseDraft, serializeDraft } from "./hotspot-draft";
import { LegacyRead } from "./legacy-fields";
import { encodePointsAttribute } from "./points-model";

const FAHRERHAUS = "6a58dd4eefeacc1239d9fd09";
const points = [{ id: "p1", x: 10, y: 20, title: "Kabine" }];

/** Was ein Content Designer typischerweise lesen lässt: Textfelder ja, Auswahlfelder und Upload nicht. */
const designerRead: LegacyRead = {
  attrs: { points: encodePointsAttribute(points), "image-alt": "", "menu-id": FAHRERHAUS, "menu-points": "" },
  unreadable: ["image", "source", "display-mode", "menu-depth", "menu-click"],
  previewImage: { url: "https://www.mti.man/api/media/a.jpg", alt: "" },
};

const decoded = (raw: string): Record<string, unknown> => JSON.parse(decodePayload(raw) ?? "") as Record<string, unknown>;

describe("draftFromSources", () => {
  it("übernimmt lesbare alte Werte und erbt die übrigen", () => {
    const draft = draftFromSources(null, designerRead);

    expect(draft.config.manual.points).toEqual(points);
    expect(draft.config.menu.rootId).toBe(FAHRERHAUS);
    expect(draft.inherited).toEqual(["source", "image", "manual.mode", "menu.depth", "menu.click"]);
  });

  it("zeigt das Vorschaubild des Designers, erbt das Bild aber weiter", () => {
    const draft = draftFromSources(null, designerRead);

    expect(draft.config.image).toEqual(designerRead.previewImage);
    expect(draft.inherited).toContain("image");
  });

  it("erbt nichts, was schon im gemeinsamen Feld steht", () => {
    const draft = parseDraft(encodeConfig({ ...DEFAULT_CONFIG, source: "menu" }, ["menu.depth"]), designerRead);

    expect(draft.config.source).toBe("menu");
    expect(draft.inherited).toEqual(["menu.depth"]);
  });
});

describe("Öffnen und Übernehmen", () => {
  // Der alte Block: Menü-Modus, fünf Ebenen, Seite öffnen – im Designer
  // nicht lesbar. Das Fenster zeigt Vorgaben, darf sie aber nicht schreiben.
  const block = {
    source: "menu",
    "menu-depth": "5",
    "menu-click": "open",
    image: "https://www.mti.man/api/media/a.jpg",
    "display-mode": "dots",
    points: designerRead.attrs.points,
    "menu-id": FAHRERHAUS,
  };

  it("verändert einen alten Block nicht", () => {
    const config = serializeDraft(draftFromSources(null, designerRead));

    expect(resolveConfig({ ...block, config })).toEqual(resolveConfig(block));
  });

  it("schreibt die geerbten Schlüssel nicht", () => {
    const written = decoded(serializeDraft(draftFromSources(null, designerRead)));

    expect(written).not.toHaveProperty("source");
    expect(written).not.toHaveProperty("image");
    expect(written.menu).toEqual({ rootId: FAHRERHAUS, layout: {} });
  });
});

describe("changeConfig", () => {
  const draft: HotspotDraft = draftFromSources(null, designerRead);

  it("macht einen geänderten Schlüssel zum eigenen", () => {
    const next: HotspotConfig = { ...draft.config, menu: { ...draft.config.menu, depth: 4 } };

    const changed = changeConfig(draft, next);

    expect(changed.inherited).not.toContain("menu.depth");
    expect(changed.inherited).toContain("menu.click");
    expect(decoded(serializeDraft(changed)).menu).toMatchObject({ depth: 4 });
  });

  it("lässt unberührte Schlüssel geerbt", () => {
    const next: HotspotConfig = { ...draft.config, manual: { ...draft.config.manual, points: [] } };

    expect(changeConfig(draft, next).inherited).toEqual(draft.inherited);
  });

  it("lässt die Vorlage unverändert", () => {
    const before = [...draft.inherited];

    changeConfig(draft, { ...draft.config, source: "menu" });

    expect(draft.inherited).toEqual(before);
  });
});
