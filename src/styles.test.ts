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

/**
 * Wachen über das übersetzte Stylesheet.
 *
 * Am 10.09.2026 sahen die Punkte im Frontend aus wie flache, dunkelgraue
 * Rechtecke: `man-theme` macht aus jedem blanken `button` im Inhaltsbereich
 * einen Handlungsknopf über die volle Breite. Keine der 152 Prüfungen merkte
 * etwas davon, weil jsdom kein fremdes Stylesheet kennt und Aussehen ohnehin
 * nicht prüfbar ist.
 *
 * Was sich prüfen lässt, ist die Abwehr selbst: dass jeder blanke `button`
 * seinen Grundriss mit erhöhter Spezifität durchsetzt und dass die Punkte die
 * Hausfarbe tragen. Das fängt den Rückfall, nicht das Aussehen.
 */

import hotspotStyles from "./styles/hotspot-image.scss";

/**
 * Der fünffach wiederholte Selektor, den `man-outshine-host` erzeugt.
 *
 * Die Leerstelle vor der Klammer ist offen gehalten: Jest übersetzt das
 * Stylesheet ausgeschrieben, der Build presst es zusammen.
 */
function outshineRule(css: string, className: string): RegExp {
  const selector = `\\.${className.replace(/-/g, "\\-")}`.repeat(5);
  return new RegExp(`${selector}\\s*\\{[^}]*\\}`);
}

describe("Stylesheet", () => {
  it("trägt die Hausfarbe statt eines eigenen Graus", () => {
    expect(hotspotStyles).toContain("--man-hi-accent: var(--man-red, #e40045)");
  });

  it.each([
    ["man-hi__marker", hotspotStyles],
    ["man-hi__marker--dots", hotspotStyles],
    ["man-hi__popover-close", hotspotStyles],
    ["man-hi__popover-action", hotspotStyles],
    ["man-hi__item-head", hotspotStyles],
    ["man-hi__popover-title", hotspotStyles],
  ])("setzt %s gegen die Regeln der Wirtsseite durch", (className, css) => {
    expect(css).toMatch(outshineRule(css, className));
  });

  // Die Marke rundet nichts ab: `man("radius")` ist 0. Erfundene Rundungen
  // fielen am 10.09.2026 im Frontend als CI-Verstoss auf -- der Handlungsknopf
  // trug 6px. Die Rundung des Punktes kommt aus `radius-round`, ist also
  // ebenfalls ein Token und kein eigener Einfall.
  it.each([
    ["hotspot-image.scss", hotspotStyles],
  ])("rundet in %s nur nach den MAN-Tokens", (_name, css) => {
    const invented = [...css.matchAll(/border-radius:\s*([^;}]+)/g)]
      .map((match) => match[1].trim())
      .filter((value) => !value.startsWith("var(--man-radius") && !value.startsWith("0"));

    expect(invented).toEqual([]);
  });

  // Die Nummerierung kommt aus dem Zaehler der geordneten Liste. Ginge eines
  // der drei Stuecke verloren, blieben die Kreise leer, ohne dass eine
  // Komponentenpruefung etwas merkte -- jsdom rechnet Zaehler nicht aus.
  it("nummeriert die Liste aus dem Zähler statt aus dem Markup", () => {
    expect(hotspotStyles).toMatch(/counter-reset:\s*man-hi-item/);
    expect(hotspotStyles).toMatch(/counter-increment:\s*man-hi-item/);
    expect(hotspotStyles).toMatch(/content:\s*counter\(man-hi-item\)/);
  });

  // Der eigene Zähler darf den eingebauten nicht verdrängen: `counter-increment`
  // ersetzt, was der Browser dem Listenpunkt sonst mitgibt. Ohne `list-item`
  // blieb dessen Zähler auf 0 stehen, und die Wirtsseite schrieb eine rote 0
  // vor jeden Eintrag.
  it("lässt dem Listenpunkt seinen eingebauten Zähler", () => {
    const rule = hotspotStyles.match(outshineRule(hotspotStyles, "man-hi__item"))?.[0];
    expect(rule).toMatch(/counter-increment:\s*man-hi-item\s+list-item/);
  });

  // Beide Wege, auf denen eine Wirtsseite etwas vor einen Listeneintrag setzen
  // kann. `list-style: none` allein genuegt nicht: ein `content` auf `::marker`
  // fuellt die Markierung, statt sie abzuschalten.
  it.each([
    ["::marker", /(\.man-hi__item){5}::marker\s*\{[^}]*content:\s*""\s*!important/],
    ["::before", /(\.man-hi__item){5}::before\s*\{[^}]*content:\s*none\s*!important/],
  ])("unterdrückt %s der Wirtsseite am Eintrag", (_name, pattern) => {
    expect(hotspotStyles).toMatch(pattern);
  });

  it("unterdrückt die Listenpunkte der Wirtsseite am Eintrag selbst", () => {
    // Am Container allein genügt es nicht: `list-style` wird von dort nur
    // vererbt, und eine Regel der Wirtsseite auf dem `li` sticht sie aus.
    const rule = hotspotStyles.match(outshineRule(hotspotStyles, "man-hi__item"))?.[0];
    expect(rule).toContain("list-style: none !important");
  });

  // Craft-Knopf m primary: 40px, Rand 2px, MAN-Rot, gemischt geschrieben und
  // ohne Laufweite -- mit Nachdruck, weil `man-theme` jedem blanken `button`
  // seinen eigenen Grundriss gibt.
  it("setzt den Handlungsknopf als Craft-Knopf m primary", () => {
    const rule = hotspotStyles.match(outshineRule(hotspotStyles, "man-hi__popover-action"))?.[0] ?? "";
    expect(rule).toMatch(/height:\s*40px\s*!important/);
    expect(rule).toMatch(/border-width:\s*2px\s*!important/);
    expect(rule).toMatch(/background-color:\s*var\(--man-red, #e40045\)\s*!important/);
    expect(rule).toContain("text-transform: none !important");
    expect(rule).toContain("letter-spacing: normal !important");
  });

  it("schreibt keine Versalien, keine Laufweite, keine alten Schriftnamen und Gewichte", () => {
    // Das neue MAN-CI kennt keine Versalien und keine Laufweiten (Vorgabe MAN,
    // 02.10.2026); Man Europe hat nur 400 und 700, `MANEurope …` liefert
    // man-theme nicht mehr aus.
    expect(hotspotStyles).not.toMatch(/uppercase/);
    expect(hotspotStyles).not.toMatch(/letter-spacing:(?!\s*(?:normal|0)(?![\w.%]))/);
    expect(hotspotStyles).not.toMatch(/MANEurope/);
    expect(hotspotStyles).not.toMatch(/font-weight:\s*(?:300|500|600)\b/);
  });

  // Craft-Overlays tragen keinen Schatten; getrennt wird über 1px Haarlinie.
  it("setzt das Fenster als Craft-Popover: Haarlinie statt Schatten", () => {
    const rule = hotspotStyles.match(/\.man-hi__popover\s*\{[^}]*\}/)?.[0] ?? "";
    expect(rule).toMatch(/border:\s*var\(--man-border-width, 1px\) solid var\(--man-border, #cbd3dc\)/);
    expect(rule).toMatch(/box-shadow:\s*none/);
  });

  it("zeigt den Fokus des Punktes als Craft-Ring", () => {
    const rule = hotspotStyles.match(/\.man-hi__marker:focus-visible\s*\{[^}]*\}/)?.[0] ?? "";
    expect(rule).toMatch(/outline:\s*var\(--man-focus-width, 2px\) solid var\(--man-focus-color, #3875b2\)\s*!important/);
    expect(rule).toMatch(/outline-offset:\s*var\(--man-focus-offset, 2px\)/);
  });

  it("gibt dem Schliessen-Kreuz auch bei Hover und gedrückt keine Fläche", () => {
    // Icon-Knöpfe tragen nach Craft in keinem Zustand einen Hintergrund.
    const close = "\\.man\\-hi__popover\\-close".repeat(5);
    expect(hotspotStyles).toMatch(
      new RegExp(`${close}:hover,\\s*${close}:active\\s*\\{[^}]*background:\\s*none\\s*!important`),
    );
  });

  it("lässt dem Puls den Schatten, statt ihn festzunageln", () => {
    // Eine Animation kommt gegen `!important` nicht an: stünde der Schatten
    // mit Nachdruck, liefe der Puls unsichtbar.
    const rule = hotspotStyles.match(outshineRule(hotspotStyles, "man-hi__marker"))?.[0] ?? "";
    expect(rule).toContain("box-shadow:");
    expect(rule).not.toMatch(/box-shadow:[^;]*!important/);
  });

  // Auf dem Telefon lagen die nummerierten Punkte bei vielen Stellen
  // übereinander, die Ziffern waren nicht mehr zu lesen. Unter der Umbruch-
  // breite werden sie deshalb klein und ziffernlos; wer welcher ist, zeigt
  // die Liste darunter.
  it("macht die nummerierten Punkte auf schmalen Bildschirmen klein und ohne Ziffer", () => {
    const narrow = hotspotStyles.match(/@media \(max-width: 767px\)\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
    expect(narrow).toMatch(outshineRule(narrow, "man-hi__marker--numbered"));
    expect(narrow).toMatch(/\.man-hi__marker-number\s*\{[^}]*display:\s*none/);
  });

  it("zieht den hervorgehobenen Punkt nach vorn, statt ihn unter den anderen zu lassen", () => {
    expect(hotspotStyles).toMatch(/\.man-hi__marker--highlighted[^{]*\{[^}]*z-index:/);
    expect(hotspotStyles).toMatch(/\.man-hi__marker--open[^{]*\{[^}]*z-index:/);
  });

  // Der weisse Ring um den Punkt ist nicht CI-konform (beanstandet am
  // 29.09.2026). Vom Bild ab hebt ihn stattdessen ein Schatten.
  it("setzt den Punkt ohne weissen Rand, nur mit Schatten ab", () => {
    const rule = hotspotStyles.match(outshineRule(hotspotStyles, "man-hi__marker"))?.[0] ?? "";
    expect(rule).toContain("border: 0 !important");
    expect(rule).toMatch(/box-shadow:\s*var\(--man-hi-shadow\)/);
  });

  it("lässt den hervorgehobenen Punkt schweben: angehoben, mit tieferem Schatten", () => {
    for (const className of ["man-hi__marker--open", "man-hi__marker--highlighted"]) {
      const rule = hotspotStyles.match(outshineRule(hotspotStyles, className))?.[0] ?? "";
      expect(rule).toMatch(/--man-hi-shadow:/);
      expect(rule).toMatch(/transform:[^;]*var\(--man-hi-lift\)/);
    }
  });

  it("behält den Schatten auch während des Pulses", () => {
    // Die Animation ersetzt `box-shadow` ganz. Stünde der Schatten nicht in
    // den Keyframes, verlöre der pulsierende Punkt seine Abhebung vom Bild.
    const keyframes = hotspotStyles.match(/@keyframes man-hi-pulse\s*\{[\s\S]*?\n\}/)?.[0] ?? "";
    const frames = [...keyframes.matchAll(/box-shadow:[^;]*/g)].map((match) => match[0]);
    expect(frames).toHaveLength(2);
    frames.forEach((frame) => expect(frame).toContain("var(--man-hi-shadow)"));
  });
});
