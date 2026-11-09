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
 * Was ein Klick tut, hängt am Eintrag und an der Einstellung:
 *
 * - Hat er im Baum Unterpunkte und steht die Einstellung auf „Ins Untermenü
 *   wechseln“ — oder hat er keine eigene Seite —, blättert das Widget in
 *   sein Untermenü. Dann ist der Punkt ein Knopf.
 * - Sonst führt er auf seine Seite und ist ein echter Link: mittlere
 *   Maustaste, „In neuem Tab öffnen“ und die Ansage als Link kommen von selbst.
 * - Ein Ordner ohne Seite und ohne Unterpunkte auf dieser Tiefe führt nirgends
 *   hin; er bleibt ein Knopf ohne Wirkung, damit Fokus und Namensschild gehen.
 *
 * Das Namensschild ist für Sehende; Bildschirmleser bekommen den Titel über
 * `aria-label`. Es erscheint unter dem Zeiger, im Fokus und wenn rechts genau
 * die Zeile dieses Eintrags unter dem Zeiger steht.
 */

import * as React from "react";
import { ReactElement } from "react";

import { MenuTreeNode } from "@shared/staffbase/menu-tree";

import { MenuClickMode, MenuHotspotPoint } from "../menu-points-model";
import { MENU_MESSAGES } from "./menu-browser";

/** Unterhalb dieses Abstands zum Rand richtet sich das Schild nach innen aus. */
const EDGE = 20;

export interface MenuMarkerProps {
  point: MenuHotspotPoint;
  node: MenuTreeNode;
  click: MenuClickMode;
  /** Hervorgehoben, weil rechts eine Zeile unter dem Zeiger steht, die ihn umfasst. */
  highlighted: boolean;
  /** Das Schild zeigen, weil rechts genau seine Zeile unter dem Zeiger steht. */
  named: boolean;
  onHover: (menuId: string | null) => void;
  onEnter: (menuId: string) => void;
}

function tagPlacement(point: MenuHotspotPoint): string {
  const horizontal = point.x < EDGE ? " man-hi__tag--start" : point.x > 100 - EDGE ? " man-hi__tag--end" : "";
  const vertical = point.y < EDGE ? " man-hi__tag--below" : "";
  return `man-hi__tag${horizontal}${vertical}`;
}

/** Was ein Klick auf diesen Punkt tut. */
export function markerAction(node: MenuTreeNode, click: MenuClickMode): "enter" | "link" | "none" {
  const hasChildren = node.children.length > 0;
  if (hasChildren && (click === "enter" || node.entry.href === null)) return "enter";
  return node.entry.href === null ? "none" : "link";
}

export function MenuMarker({
  point,
  node,
  click,
  highlighted,
  named,
  onHover,
  onEnter,
}: MenuMarkerProps): ReactElement {
  const { entry } = node;
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

  const action = markerAction(node, click);
  if (action === "link" && entry.href !== null) {
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
    <button
      {...common}
      type="button"
      aria-label={action === "enter" ? `${entry.title}${MENU_MESSAGES.enterSuffix}` : entry.title}
      aria-disabled={action === "none" ? true : undefined}
      onClick={action === "enter" ? () => onEnter(point.menuId) : undefined}
    >
      {tag}
    </button>
  );
}
