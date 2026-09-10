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
 * Rechtecke: `onetruck-css` macht aus jedem blanken `button` im Inhaltsbereich
 * einen Handlungsknopf über die volle Breite. Keine der 152 Prüfungen merkte
 * etwas davon, weil jsdom kein fremdes Stylesheet kennt und Aussehen ohnehin
 * nicht prüfbar ist.
 *
 * Was sich prüfen lässt, ist die Abwehr selbst: dass jeder blanke `button`
 * seinen Grundriss mit erhöhter Spezifität durchsetzt und dass die Punkte die
 * Hausfarbe tragen. Das fängt den Rückfall, nicht das Aussehen.
 */

import hotspotStyles from "./styles/hotspot-image.scss";
import modalStyles from "./styles/page-modal.scss";

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
    ["man-hi-modal__close", modalStyles],
  ])("setzt %s gegen die Regeln der Wirtsseite durch", (className, css) => {
    expect(css).toMatch(outshineRule(css, className));
  });

  // Die Marke rundet nichts ab: `man("radius")` ist 0. Erfundene Rundungen
  // fielen am 10.09.2026 im Frontend als CI-Verstoss auf -- der Handlungsknopf
  // trug 6px. Die Rundung des Punktes kommt aus `radius-round`, ist also
  // ebenfalls ein Token und kein eigener Einfall.
  it.each([
    ["hotspot-image.scss", hotspotStyles],
    ["page-modal.scss", modalStyles],
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

  it("unterdrückt die Nummer, die die Wirtsseite vor den Eintrag setzt", () => {
    expect(hotspotStyles).toMatch(
      /(\.man-hi__item){5}::before\s*\{[^}]*content:\s*none\s*!important/,
    );
  });

  it("unterdrückt die Listenpunkte der Wirtsseite am Eintrag selbst", () => {
    // Am Container allein genügt es nicht: `list-style` wird von dort nur
    // vererbt, und eine Regel der Wirtsseite auf dem `li` sticht sie aus.
    const rule = hotspotStyles.match(outshineRule(hotspotStyles, "man-hi__item"))?.[0];
    expect(rule).toContain("list-style: none !important");
  });

  it("gibt dem Handlungsknopf die Versalien der Marke", () => {
    const rule = hotspotStyles.match(outshineRule(hotspotStyles, "man-hi__popover-action"))?.[0];
    expect(rule).toContain("text-transform: uppercase !important");
  });

  it("lässt dem Puls den Schatten, statt ihn festzunageln", () => {
    // Eine Animation kommt gegen `!important` nicht an: stünde der Schatten
    // mit Nachdruck, liefe der Puls unsichtbar.
    const rule = hotspotStyles.match(outshineRule(hotspotStyles, "man-hi__marker"))?.[0] ?? "";
    expect(rule).toContain("box-shadow:");
    expect(rule).not.toMatch(/box-shadow:[^;]*!important/);
  });
});
