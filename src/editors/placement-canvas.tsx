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
 *
 * Aussehen wie im Screen: das Bild mit Schatten auf der grauen Bühne, die
 * Punkte als rote Kreise mit weissem Rand (im Menü-Modus anthrazit), der
 * gewählte mit Ring in der Akzentfarbe. Ein Punkt mit eigenem Bild steht so
 * gross wie auf der Seite da.
 */

import * as React from "react";
import { ReactElement, useRef } from "react";
import { cn } from "@man/config-ui/primitives/utils";

import { ICON_SIZES } from "../point-icon";
import { HotspotImage, HotspotPoint, clampPercent } from "../points-model";

export interface PlacementCanvasProps {
  image: HotspotImage;
  points: HotspotPoint[];
  selectedId: string | null;
  onAdd: (x: number, y: number) => void;
  onMove: (pointId: string, x: number, y: number) => void;
  onSelect: (pointId: string) => void;
  /** Was auf dem Marker steht; ohne Angabe die laufende Nummer. */
  markerLabel?: (index: number) => string;
  /** Die Punkte des Menü-Modus sind anthrazit statt rot, wie auf der Seite. */
  tone?: "manual" | "menu";
  /** Name der Bühne für Screenreader, etwa „Werksplan mit 5 Punkten“. */
  label?: string;
  /** Den Titel jedes Punkts als Schild daneben zeigen (Menü-Modus: dort steht keine Nummer). */
  showTitles?: boolean;
}

const MARKER =
  "absolute grid -translate-x-1/2 -translate-y-1/2 cursor-grab place-items-center p-0 text-[13px] font-semibold text-white outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60";
const DOT = "size-8 rounded-full border-2 border-white shadow-md";
const SELECTED = "z-[1] outline-[3px] outline-offset-2 outline-primary outline-solid";

const numberLabel = (index: number): string => String(index + 1);

/** Ein Tastendruck bewegt um ein Prozent. */
const STEP = 1;

export function PlacementCanvas({
  image,
  points,
  selectedId,
  onAdd,
  onMove,
  onSelect,
  markerLabel = numberLabel,
  tone = "manual",
  label,
  showTitles = false,
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
    <div
      role="group"
      aria-label={label}
      className="relative w-full max-w-[680px] cursor-crosshair bg-background shadow-md"
      ref={stageRef}
      data-testid="placement-canvas"
      onClick={onStageClick}
    >
      <img className="block h-auto w-full select-none" src={image.url} alt="" draggable={false} />
      {points.map((point, index) => {
        const selected = point.id === selectedId;
        return (
          <button
            key={point.id}
            type="button"
            data-testid={`place-marker-${point.id}`}
            data-selected={selected || undefined}
            className={cn(
              MARKER,
              point.icon === undefined && DOT,
              point.icon === undefined && (tone === "menu" ? "bg-brand-ink" : "bg-brand"),
              point.icon !== undefined && "rounded-full border-2 border-transparent drop-shadow-md",
              point.icon?.background !== undefined &&
                `man-hie__icon-bg man-hie__icon-bg--${point.icon.background} shadow-md`,
              selected && SELECTED,
            )}
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              // Mit eigenem Bild so gross wie auf der Seite — sonst platzierte man
              // ein 72px-Symbol nach einem 32px-Punkt.
              ...(point.icon === undefined
                ? {}
                : {
                    width: ICON_SIZES[point.icon.size],
                    height: ICON_SIZES[point.icon.size],
                    // Für die Luft im Hintergrund, siehe `editor-canvas.scss`.
                    ["--man-hie-icon" as string]: `${ICON_SIZES[point.icon.size]}px`,
                  }),
            }}
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
            {point.icon === undefined ? (
              markerLabel(index)
            ) : (
              <img
                className="pointer-events-none block size-full object-contain"
                src={point.icon.url}
                alt=""
                draggable={false}
              />
            )}
          </button>
        );
      })}
      {showTitles &&
        points.map((point) => (
          <span
            key={`tag-${point.id}`}
            aria-hidden="true"
            className="pointer-events-none absolute translate-x-5 translate-y-1 bg-background/90 px-1.5 py-0.5 text-[11px] font-semibold whitespace-nowrap text-brand-ink"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          >
            {point.title}
          </span>
        ))}
    </div>
  );
}
