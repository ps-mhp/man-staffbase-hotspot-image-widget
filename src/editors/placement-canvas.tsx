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
 * Punkte setzen, wo sie hingehören: auf dem Bild selbst.
 *
 * Klick ins Bild legt an, Ziehen verschiebt, Pfeiltasten justieren. Zahlen
 * für x und y einzutippen wäre der offensichtliche Weg, aber niemand weiß,
 * wo „62 % / 41 %“ liegt.
 */

import * as React from "react";
import { ReactElement, useRef } from "react";

import { HotspotImage, HotspotPoint, clampPercent } from "../points-model";

export interface PlacementCanvasProps {
  image: HotspotImage;
  points: HotspotPoint[];
  selectedId: string | null;
  onAdd: (x: number, y: number) => void;
  onMove: (pointId: string, x: number, y: number) => void;
  onSelect: (pointId: string) => void;
}

/** Ein Tastendruck bewegt um ein Prozent. */
const STEP = 1;

export function PlacementCanvas({
  image,
  points,
  selectedId,
  onAdd,
  onMove,
  onSelect,
}: PlacementCanvasProps): ReactElement {
  const stageRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<string | null>(null);

  const toPercent = (clientX: number, clientY: number): { x: number; y: number } | null => {
    const stage = stageRef.current;
    if (stage === null) return null;
    const box = stage.getBoundingClientRect();
    // jsdom liefert ungemessen 0×0; ohne diese Wache teilte toPercent durch
    // Null und ein Klick vor dem ersten Layout würde NaN-Koordinaten anlegen.
    if (box.width === 0 || box.height === 0) return null;
    return {
      x: clampPercent(((clientX - box.left) / box.width) * 100),
      y: clampPercent(((clientY - box.top) / box.height) * 100),
    };
  };

  const onStageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Klicks auf einen Marker sind Auswahl, nicht Anlage.
    if (event.target !== event.currentTarget && (event.target as HTMLElement).tagName !== "IMG") {
      return;
    }
    const spot = toPercent(event.clientX, event.clientY);
    if (spot !== null) onAdd(spot.x, spot.y);
  };

  const onMarkerPointerDown = (event: React.PointerEvent<HTMLButtonElement>, pointId: string) => {
    draggingRef.current = pointId;
    // Ohne Capture verliert man den Punkt, sobald der Zeiger den Marker
    // verlässt — und das tut er beim Ziehen sofort.
    event.currentTarget.setPointerCapture?.(event.pointerId);
    // Die Auswahl selbst passiert bewusst nicht hier, sondern nur in
    // onMarkerClick: pointerdown und click feuern im Browser für einen
    // einfachen Klick beide auf demselben Element, ein zweiter Aufruf hier
    // wäre für einen reinen Zustands-Setter zwar folgenlos, aber unnötig und
    // eine doppelte Zuständigkeit an derselben Stelle.
  };

  const onMarkerPointerMove = (event: React.PointerEvent<HTMLButtonElement>, pointId: string) => {
    if (draggingRef.current !== pointId) return;
    const spot = toPercent(event.clientX, event.clientY);
    if (spot !== null) onMove(pointId, spot.x, spot.y);
  };

  const onMarkerPointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    draggingRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const onMarkerClick = (pointId: string) => {
    onSelect(pointId);
  };

  const onMarkerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, point: HotspotPoint) => {
    const shift: Record<string, [number, number]> = {
      ArrowLeft: [-STEP, 0],
      ArrowRight: [STEP, 0],
      ArrowUp: [0, -STEP],
      ArrowDown: [0, STEP],
    };
    const delta = shift[event.key];
    if (delta === undefined) return;
    event.preventDefault();
    onMove(point.id, clampPercent(point.x + delta[0]), clampPercent(point.y + delta[1]));
  };

  return (
    <div className="man-hie__canvas" ref={stageRef} data-testid="placement-canvas" onClick={onStageClick}>
      <img className="man-hie__canvas-image" src={image.url} alt="" draggable={false} />
      {points.map((point, index) => {
        const selected = point.id === selectedId;
        return (
          <button
            key={point.id}
            type="button"
            data-testid={`place-marker-${point.id}`}
            className={`man-hie__canvas-marker${selected ? " man-hie__canvas-marker--selected" : ""}`}
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            aria-label={`Punkt ${index + 1}${point.title === "" ? "" : `: ${point.title}`}`}
            // Ausgewählt ist ein Umschalt-Zustand des Markers, nicht bloß ein
            // Aussehen: aria-pressed sagt ihn auch an, wenn niemand die Klasse sieht.
            aria-pressed={selected}
            onClick={() => onMarkerClick(point.id)}
            onPointerDown={(event) => onMarkerPointerDown(event, point.id)}
            onPointerMove={(event) => onMarkerPointerMove(event, point.id)}
            onPointerUp={onMarkerPointerUp}
            onKeyDown={(event) => onMarkerKeyDown(event, point)}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
}
