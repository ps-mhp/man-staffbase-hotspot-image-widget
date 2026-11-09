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
 * Ein Menüpunkt auf dem Bild.
 *
 * Führt er auf eine Seite und soll ein Klick sie öffnen, ist er ein echter
 * Link: mittlere Maustaste, „In neuem Tab öffnen“ und die Ansage als Link
 * kommen dann von selbst. Sonst — „Im Menü zeigen“ oder ein Ordner ohne
 * Seite — ist er ein Knopf.
 *
 * Das Namensschild ist für Sehende; Bildschirmleser bekommen den Titel über
 * `aria-label`. Es erscheint unter dem Zeiger, im Fokus und wenn rechts genau
 * die Zeile dieses Eintrags unter dem Zeiger steht.
 */

import * as React from "react";
import { ReactElement } from "react";

import { MenuEntry } from "@shared/staffbase/menu";

import { MenuClickMode, MenuHotspotPoint } from "../menu-points-model";
import { MENU_MESSAGES } from "./menu-browser";

/** Unterhalb dieses Abstands zum Rand richtet sich das Schild nach innen aus. */
const EDGE = 20;

export interface MenuMarkerProps {
  point: MenuHotspotPoint;
  entry: MenuEntry;
  click: MenuClickMode;
  /** Hervorgehoben, weil rechts eine Zeile unter dem Zeiger steht, die ihn umfasst. */
  highlighted: boolean;
  /** Das Schild zeigen, weil rechts genau seine Zeile unter dem Zeiger steht. */
  named: boolean;
  onHover: (menuId: string | null) => void;
  onReveal: (menuId: string) => void;
}

function tagPlacement(point: MenuHotspotPoint): string {
  const horizontal = point.x < EDGE ? " man-hi__tag--start" : point.x > 100 - EDGE ? " man-hi__tag--end" : "";
  const vertical = point.y < EDGE ? " man-hi__tag--below" : "";
  return `man-hi__tag${horizontal}${vertical}`;
}

export function MenuMarker({
  point,
  entry,
  click,
  highlighted,
  named,
  onHover,
  onReveal,
}: MenuMarkerProps): ReactElement {
  const className = [
    "man-hi__marker",
    "man-hi__marker--dots",
    "man-hi__marker--menu",
    highlighted && "man-hi__marker--highlighted",
    named && "man-hi__marker--named",
  ]
    .filter(Boolean)
    .join(" ");

  const common = {
    className,
    style: { left: `${point.x}%`, top: `${point.y}%` },
    "data-testid": `menu-marker-${point.menuId}`,
    onPointerEnter: (event: React.PointerEvent) => {
      if (event.pointerType !== "touch") onHover(point.menuId);
    },
    onPointerLeave: () => onHover(null),
    onFocus: () => onHover(point.menuId),
    onBlur: () => onHover(null),
  };
  const tag = (
    <span className={tagPlacement(point)} aria-hidden="true">
      {entry.title}
    </span>
  );

  if (click === "open" && entry.href !== null) {
    return (
      <a
        {...common}
        href={entry.href}
        target={entry.external ? "_blank" : undefined}
        rel={entry.external ? "noopener noreferrer" : undefined}
        aria-label={entry.external ? `${entry.title}${MENU_MESSAGES.newTab}` : entry.title}
      >
        {tag}
      </a>
    );
  }

  return (
    // Der Zusatz sagt an, dass der Fokus gleich ins Menü springt.
    <button
      {...common}
      type="button"
      aria-label={`${entry.title}${MENU_MESSAGES.revealSuffix}`}
      onClick={() => onReveal(point.menuId)}
    >
      {tag}
    </button>
  );
}
