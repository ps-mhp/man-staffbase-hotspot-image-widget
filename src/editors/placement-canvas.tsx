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
  /** Welcher Punkt gerade an welchem Zeiger hängt. */
  const draggingRef = useRef<{ pointId: string; pointerId: number } | null>(null);

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
    draggingRef.current = { pointId, pointerId: event.pointerId };
    // Ohne Capture verliert man den Punkt, sobald der Zeiger den Marker
    // verlässt — und das tut er beim Ziehen sofort.
    event.currentTarget.setPointerCapture?.(event.pointerId);
    // Die Auswahl gehört an den Druck, nicht an das Loslassen: wer einen Punkt
    // anfasst, um ihn zu schieben, meint diesen Punkt -- und das Formular
    // daneben soll ihn schon während des Ziehens zeigen. Auf Touchgeräten
    // unterdrücken Browser nach einer Ziehbewegung ohnehin den `click`; ihn
    // allein zu befragen liesse einen gezogenen Punkt unausgewählt.
    onSelect(pointId);
  };

  const onMarkerPointerMove = (event: React.PointerEvent<HTMLButtonElement>, pointId: string) => {
    // Auch die Zeigerkennung muss stimmen: bleibt der Ziehzustand nach einem
    // abgebrochenen Zug stehen, verschöbe schon das blosse Überfahren des
    // Markers den Punkt -- ohne dass jemand ihn angefasst hätte.
    if (draggingRef.current?.pointId !== pointId || draggingRef.current.pointerId !== event.pointerId) {
      return;
    }
    const spot = toPercent(event.clientX, event.clientY);
    if (spot !== null) onMove(pointId, spot.x, spot.y);
  };

  const endDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    draggingRef.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const onMarkerClick = (event: React.MouseEvent<HTMLButtonElement>, pointId: string) => {
    // Mit dem Zeiger hat `onMarkerPointerDown` längst ausgewählt. Übrig bleibt
    // die Tastatur: Enter und Leertaste erzeugen einen `click` ohne
    // vorangehenden `pointerdown`, kenntlich an `detail === 0`. Ohne diese
    // Unterscheidung wählte ein gewöhnlicher Mausklick zweimal aus.
    if (event.detail === 0) onSelect(pointId);
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
            // Ausgewählt heisst „an diesem Punkt wird gerade gearbeitet" -- eine
            // Auszeichnung innerhalb einer Menge, kein Schalter. `aria-pressed`
            // verspräche ein Umschalten, das es hier nicht gibt: ein zweiter
            // Klick wählt denselben Punkt erneut aus, statt ihn abzuwählen.
            aria-current={selected ? "true" : undefined}
            onClick={(event) => onMarkerClick(event, point.id)}
            onPointerDown={(event) => onMarkerPointerDown(event, point.id)}
            onPointerMove={(event) => onMarkerPointerMove(event, point.id)}
            onPointerUp={endDrag}
            // Ein Zug endet nicht immer im Loslassen: das Betriebssystem kann
            // ihn abbrechen, und die Zeigerbindung kann verlorengehen. Bliebe
            // der Ziehzustand dann stehen, verschöbe die nächste Bewegung über
            // dem Marker den Punkt ungefragt.
            onPointerCancel={endDrag}
            onLostPointerCapture={endDrag}
            onKeyDown={(event) => onMarkerKeyDown(event, point)}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
}
