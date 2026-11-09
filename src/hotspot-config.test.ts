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

import {
  DEFAULT_CONFIG,
  HotspotConfig,
  LegacyAttributes,
  configFromLegacy,
  encodeConfig,
  parseConfig,
  resolveConfig,
} from "./hotspot-config";
import { encodeMenuLayout } from "./menu-points-model";
import { encodeImageAttribute, encodePointsAttribute } from "./points-model";

const FAHRERHAUS = "6a58dd4eefeacc1239d9fd09";
const RUHE = "6a7358b8340cb013d7f29611";
const image = { url: "https://www.mti.man/api/media/a.jpg", alt: "Ein Lkw", width: 800, height: 600 };

const full: HotspotConfig = {
  source: "menu",
  image,
  manual: { mode: "dots", points: [{ id: "p1", x: 10, y: 20, title: "Kabine" }] },
  menu: {
    rootId: FAHRERHAUS,
    depth: 4,
    click: "open",
    layout: { [FAHRERHAUS]: { points: [{ id: "m1", menuId: RUHE, x: 1, y: 2 }] } },
  },
};

describe("parseConfig und encodeConfig", () => {
  it("geben dieselbe Konfiguration zurück", () => {
    expect(parseConfig(encodeConfig(full))).toEqual(full);
  });

  it("lesen nichts aus einem leeren oder kaputten Feld", () => {
    expect(parseConfig("")).toBeNull();
    expect(parseConfig("kaputt")).toBeNull();
    expect(parseConfig("[]")).toBeNull();
  });

  it("füllen Fehlendes mit den Vorgaben und verwerfen Ungültiges", () => {
    const raw = JSON.stringify({
      source: "irgendwas",
      image: { url: "javascript:alert(1)" },
      manual: { mode: "x", points: [{ id: "a", x: 1, y: 1 }] },
      menu: { rootId: "keine-id", depth: "9", click: "x", layout: "kaputt" },
    });

    expect(parseConfig(raw)).toEqual(DEFAULT_CONFIG);
  });

  it("schreiben die Menü-ID klein und nehmen auch eine Seitenadresse", () => {
    const raw = JSON.stringify({ menu: { rootId: `/content/page/${FAHRERHAUS.toUpperCase()}` } });

    expect(parseConfig(raw)?.menu.rootId).toBe(FAHRERHAUS);
  });

  it("schreiben kodiert, damit der Dialog kein rohes JSON zeigt", () => {
    const encoded = encodeConfig(full);

    expect(encoded).not.toContain("{");
    expect(JSON.parse(decodePayload(encoded) ?? "")).toMatchObject({ source: "menu" });
  });
});

describe("configFromLegacy", () => {
  it("übernimmt die einzelnen Felder älterer Fassungen", () => {
    const legacy: LegacyAttributes = {
      image: encodeImageAttribute({ url: image.url, alt: "" }),
      "image-alt": "Ein Lkw",
      points: encodePointsAttribute([{ id: "p1", x: 10, y: 20, title: "Kabine" }]),
      "display-mode": "dots",
      source: "menu",
      "menu-id": FAHRERHAUS,
      "menu-depth": "4",
      "menu-click": "open",
      "menu-points": encodeMenuLayout({ [FAHRERHAUS]: { points: [{ id: "m1", menuId: RUHE, x: 1, y: 2 }] } }),
    };

    expect(configFromLegacy(legacy)).toEqual({ ...full, image: { url: image.url, alt: "Ein Lkw" } });
  });

  it("nimmt die blosse Adresse, die der Content Designer für das Bild speichert", () => {
    expect(configFromLegacy({ image: "https://www.mti.man/api/media/b.jpg" }).image).toEqual({
      url: "https://www.mti.man/api/media/b.jpg",
      alt: "",
    });
  });

  it("ergibt ohne Felder die Vorgabe", () => {
    expect(configFromLegacy({})).toEqual(DEFAULT_CONFIG);
  });
});

describe("resolveConfig", () => {
  it("bevorzugt das gemeinsame Feld", () => {
    expect(resolveConfig({ config: encodeConfig(full), "display-mode": "numbered" })).toEqual(full);
  });

  it("fällt ohne gemeinsames Feld auf die einzelnen Felder zurück", () => {
    expect(resolveConfig({ "display-mode": "dots" }).manual.mode).toBe("dots");
  });
});

describe("DEFAULT_CONFIG", () => {
  it("beginnt manuell, nummeriert, mit drei Ebenen und dem Wechsel ins Untermenü", () => {
    expect(DEFAULT_CONFIG).toEqual({
      source: "manual",
      image: null,
      manual: { mode: "numbered", points: [] },
      menu: { rootId: null, depth: 3, click: "enter", layout: {} },
    });
  });
});
