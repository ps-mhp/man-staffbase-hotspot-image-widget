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

import { encodePayload } from "@shared/payload";
import {
  DEFAULT_LINK_LABEL,
  HotspotPoint,
  clampPercent,
  emptyPoint,
  encodeImageAttribute,
  encodePointsAttribute,
  linkLabel,
  newPointId,
  parseImage,
  readImage,
  parsePoints,
  readDisplayMode,
} from "./points-model";

const point = (extra: Partial<HotspotPoint> = {}): HotspotPoint => ({
  id: "p1",
  x: 25,
  y: 50,
  title: "Ladeanschluss",
  ...extra,
});

describe("parsePoints", () => {
  it("liest rohes JSON, wie es ältere Konfigurationen enthalten", () => {
    expect(parsePoints('[{"id":"p1","x":25,"y":50,"title":"Ladeanschluss"}]')).toEqual([point()]);
  });

  it("liest kodierte Nutzlast", () => {
    const raw = encodePayload('[{"id":"p1","x":25,"y":50,"title":"Ladeanschluss"}]');
    expect(parsePoints(raw)).toEqual([point()]);
  });

  it("gibt bei leerem oder kaputtem Wert eine leere Liste zurück, statt zu werfen", () => {
    expect(parsePoints("")).toEqual([]);
    expect(parsePoints("{")).toEqual([]);
    expect(parsePoints('{"nicht":"eine Liste"}')).toEqual([]);
  });

  it("verwirft Einträge ohne Titel und mit unbrauchbaren Koordinaten", () => {
    const raw = JSON.stringify([
      { id: "a", x: 10, y: 10, title: "" },
      { id: "b", x: -5, y: 10, title: "Zu weit links" },
      { id: "c", x: 10, y: 101, title: "Zu weit unten" },
      { id: "d", x: 10, y: 10, title: "Gut" },
    ]);
    expect(parsePoints(raw).map((entry) => entry.id)).toEqual(["d"]);
  });

  it("vergibt eine Kennung, wenn eine fehlt — sonst wäre der Punkt kein React-Key", () => {
    const [entry] = parsePoints('[{"x":10,"y":10,"title":"Ohne Kennung"}]');
    expect(entry?.id).toEqual(expect.any(String));
    expect(entry?.id).not.toEqual("");
  });

  it("hebt unbekannte Felder auf, damit eine ältere Fassung sie nicht löscht", () => {
    const raw = JSON.stringify([{ id: "p1", x: 25, y: 50, title: "Ladeanschluss", kuenftig: 7 }]);
    expect(parsePoints(raw)[0]?.unknown).toEqual({ kuenftig: 7 });
  });

  it("liest einen Link nur, wenn Art und Ziel stimmen", () => {
    const withLink = JSON.stringify([
      { ...point(), link: { kind: "page", href: "/content/pages/1", title: "Laden" } },
    ]);
    expect(parsePoints(withLink)[0]?.link).toEqual({
      kind: "page",
      href: "/content/pages/1",
      title: "Laden",
    });

    const brokenLink = JSON.stringify([{ ...point(), link: { kind: "irgendwas", href: "" } }]);
    expect(parsePoints(brokenLink)[0]?.link).toBeUndefined();
  });
});

describe("encodePointsAttribute", () => {
  it("überlebt den Rundlauf, inklusive unbekannter Felder", () => {
    const points: HotspotPoint[] = [
      point({ description: "CCS, bis 350 kW.", unknown: { kuenftig: 7 } }),
      point({ id: "p2", x: 80, y: 20, title: "Kofferraum", link: { kind: "url", href: "https://example.test" } }),
    ];
    expect(parsePoints(encodePointsAttribute(points))).toEqual(points);
  });

  it("kodiert die Nutzlast, damit Anführungszeichen das Attribut nicht abschneiden", () => {
    expect(encodePointsAttribute([point()]).startsWith("b64:")).toBe(true);
  });
});

describe("parseImage / encodeImageAttribute", () => {
  it("überlebt den Rundlauf", () => {
    const image = { url: "https://example.test/a.jpg", alt: "Ein Auto", width: 1600, height: 900 };
    expect(parseImage(encodeImageAttribute(image))).toEqual(image);
  });

  it("ist ohne Bild null statt eines halben Objekts", () => {
    expect(parseImage("")).toBeNull();
    expect(parseImage("{")).toBeNull();
    expect(parseImage('{"alt":"Ohne URL"}')).toBeNull();
    expect(encodeImageAttribute(null)).toBe("");
  });
});

describe("Bild aus dem Content Designer", () => {
  // Der Designer speichert für `image` nur die Adresse des hochgeladenen
  // Bildes, kein JSON (live gesehen am 29.09.2026).
  it("liest eine blosse Adresse als Bild ohne Alternativtext", () => {
    const url = "https://www.onetruck.man/api/media/secure/external/v2/image/upload/c1.jpg";
    expect(parseImage(url)).toEqual({ url, alt: "" });
    expect(parseImage("/api/media/x.jpg")).toEqual({ url: "/api/media/x.jpg", alt: "" });
  });

  it("hält Text, der keine Adresse ist, nicht für ein Bild", () => {
    expect(parseImage("kein bild")).toBeNull();
    expect(parseImage("javascript:alert(1)")).toBeNull();
  });
});

describe("readImage", () => {
  const url = "https://example.test/a.jpg";

  it("nimmt den Alternativtext aus seinem eigenen Attribut", () => {
    expect(readImage(url, "Ein Auto")).toEqual({ url, alt: "Ein Auto" });
  });

  it("fällt für ältere Inhalte auf den Text im Bild-JSON zurück", () => {
    const raw = encodeImageAttribute({ url, alt: "Aus dem JSON" });
    expect(readImage(raw, "")).toEqual({ url, alt: "Aus dem JSON" });
    expect(readImage(raw, undefined)).toEqual({ url, alt: "Aus dem JSON" });
    expect(readImage(raw, "Neu")).toEqual({ url, alt: "Neu" });
  });

  it("ist ohne Bild null", () => {
    expect(readImage("", "Ein Auto")).toBeNull();
  });
});

describe("readDisplayMode", () => {
  it("nimmt die bekannten Modi und fällt sonst auf die Vorgabe zurück", () => {
    expect(readDisplayMode("dots")).toBe("dots");
    expect(readDisplayMode("numbered")).toBe("numbered");
    expect(readDisplayMode(undefined)).toBe("numbered");
    expect(readDisplayMode("was auch immer")).toBe("numbered");
  });
});

describe("Kleinkram", () => {
  it("klemmt Prozentwerte auf 0 bis 100 und rundet auf zwei Stellen", () => {
    expect(clampPercent(-3)).toBe(0);
    expect(clampPercent(140)).toBe(100);
    expect(clampPercent(33.333333)).toBe(33.33);
    expect(clampPercent(Number.NaN)).toBe(0);
  });

  it("gibt jedem neuen Punkt eine eigene Kennung", () => {
    expect(newPointId()).not.toBe(newPointId());
  });

  it("legt einen leeren Punkt an der geklickten Stelle an", () => {
    const fresh = emptyPoint(120, 40);
    expect(fresh).toMatchObject({ x: 100, y: 40, title: "" });
  });

  it("nennt den Button beim Namen, sonst bei der Vorgabe", () => {
    expect(linkLabel({ kind: "page", href: "/a", label: "Mehr zum Laden" })).toBe("Mehr zum Laden");
    expect(linkLabel({ kind: "page", href: "/a" })).toBe(DEFAULT_LINK_LABEL);
    expect(linkLabel({ kind: "page", href: "/a", label: "   " })).toBe(DEFAULT_LINK_LABEL);
  });
});
