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
 * Ein Punkt auf dem Bild.
 *
 * Ein echter Button, kein `div` mit Klick-Handler: Fokus, Enter und Leertaste
 * und die Ansage als Schaltfläche kommen dann von selbst. Die Position steht
 * als Inline-Style, weil sie aus den Daten kommt — das Stylesheet könnte sie
 * gar nicht kennen.
 */

import * as React from "react";
import { ReactElement } from "react";

import { DisplayMode, HotspotPoint } from "./points-model";

export interface HotspotMarkerProps {
  point: HotspotPoint;
  /** 0-basiert; sichtbar wird `index + 1`. */
  index: number;
  mode: DisplayMode;
  open: boolean;
  /** Die id des Elements, das dieser Marker auf- und zuklappt. */
  controls: string;
  onToggle: () => void;
}

export function HotspotMarker({
  point,
  index,
  mode,
  open,
  controls,
  onToggle,
}: HotspotMarkerProps): ReactElement {
  return (
    <button
      type="button"
      className={`man-hi__marker man-hi__marker--${mode}${open ? " man-hi__marker--open" : ""}`}
      style={{ left: `${point.x}%`, top: `${point.y}%` }}
      // Der sichtbare Text ist im nummerierten Modus nur eine Ziffer und im
      // Punkte-Modus gar keiner. Der Titel muss deshalb ausdrücklich dazu.
      aria-label={point.title}
      aria-expanded={open}
      aria-controls={controls}
      data-testid={`marker-${point.id}`}
      onClick={onToggle}
    >
      {mode === "numbered" && <span className="man-hi__marker-number">{index + 1}</span>}
    </button>
  );
}
