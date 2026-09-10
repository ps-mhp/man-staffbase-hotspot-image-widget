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
 * Die Punkte als aufklappbare Liste neben dem Bild.
 *
 * Nur im nummerierten Modus. Sie ist kein Zweitweg zum selben Inhalt, sondern
 * der einzige: in diesem Modus erscheint kein Popover, der Text steht immer
 * hier. Wer über den Marker geht, öffnet denselben Eintrag — deshalb tragen
 * Marker und Listenkopf dasselbe `aria-controls`.
 */

import * as React from "react";
import { ReactElement } from "react";

import { HotspotPoint, linkLabel } from "./points-model";

export interface HotspotListProps {
  points: HotspotPoint[];
  openId: string | null;
  panelId: (pointId: string) => string;
  onToggle: (pointId: string) => void;
  onOpenLink: (point: HotspotPoint) => void;
}

export function HotspotList({
  points,
  openId,
  panelId,
  onToggle,
  onOpenLink,
}: HotspotListProps): ReactElement {
  return (
    <ul className="man-hi__list">
      {points.map((point, index) => {
        const open = point.id === openId;
        return (
          <li key={point.id} className={`man-hi__item${open ? " man-hi__item--open" : ""}`}>
            <button
              type="button"
              className="man-hi__item-head"
              aria-expanded={open}
              aria-controls={panelId(point.id)}
              data-testid={`item-${point.id}`}
              onClick={() => onToggle(point.id)}
            >
              <span className="man-hi__item-number">{index + 1}</span>
              <span className="man-hi__item-title">{point.title}</span>
            </button>
            {open && (
              <div id={panelId(point.id)} className="man-hi__item-body">
                {point.description !== undefined && (
                  <p className="man-hi__item-text">{point.description}</p>
                )}
                {point.link !== undefined && (
                  <button
                    type="button"
                    className="man-hi__popover-action"
                    onClick={() => onOpenLink(point)}
                  >
                    {linkLabel(point.link)}
                  </button>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
