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

  it("lässt dem Puls den Schatten, statt ihn festzunageln", () => {
    // Eine Animation kommt gegen `!important` nicht an: stünde der Schatten
    // mit Nachdruck, liefe der Puls unsichtbar.
    const rule = hotspotStyles.match(outshineRule(hotspotStyles, "man-hi__marker"))?.[0] ?? "";
    expect(rule).toContain("box-shadow:");
    expect(rule).not.toMatch(/box-shadow:[^;]*!important/);
  });
});
