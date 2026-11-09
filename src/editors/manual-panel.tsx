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
 * Der manuelle Modus im Fenster: Bild, Bühne zum Setzen und Schieben, Liste
 * der Punkte zum Umsortieren und das Formular des ausgewählten Punkts.
 *
 * Gesteuert von aussen: Bild und Punkte gehören der Konfiguration des
 * Fensters (`hotspot-editor.tsx`), hier liegt nur die Auswahl.
 */

import * as React from "react";
import { ReactElement, useState } from "react";

import { HotspotImage, HotspotPoint, MAX_POINTS, emptyPoint } from "../points-model";
import { ImageField } from "./image-field";
import { PlacementCanvas } from "./placement-canvas";
import { PointForm } from "./point-form";

export interface ManualPanelProps {
  image: HotspotImage | null;
  onImageChange: (image: HotspotImage | null) => void;
  points: HotspotPoint[];
  onPointsChange: (points: HotspotPoint[]) => void;
}

/** Wie viele Punkte noch keinen Titel tragen — ohne ihn gingen sie beim Übernehmen verloren. */
export const untitledCount = (points: readonly HotspotPoint[]): number =>
  points.filter((point) => point.title.trim() === "").length;

export function ManualPanel({ image, onImageChange, points, onPointsChange }: ManualPanelProps): ReactElement {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [full, setFull] = useState(false);

  const selectedIndex = points.findIndex((point) => point.id === selectedId);
  const selected = selectedIndex === -1 ? null : points[selectedIndex];

  const onAdd = (x: number, y: number): void => {
    if (points.length >= MAX_POINTS) {
      setFull(true);
      return;
    }
    const point = emptyPoint(x, y);
    onPointsChange([...points, point]);
    setSelectedId(point.id);
  };

  const onMove = (pointId: string, x: number, y: number): void => {
    onPointsChange(points.map((point) => (point.id === pointId ? { ...point, x, y } : point)));
  };

  const swap = (offset: 1 | -1): void => {
    if (selected === null) return;
    const otherIndex = selectedIndex + offset;
    if (otherIndex < 0 || otherIndex >= points.length) return;
    const next = [...points];
    next[selectedIndex] = next[otherIndex];
    next[otherIndex] = selected;
    onPointsChange(next);
  };

  const onRemove = (): void => {
    if (selected === null) return;
    onPointsChange(points.filter((point) => point.id !== selected.id));
    setSelectedId(null);
  };

  const onFormChange = (point: HotspotPoint): void => {
    onPointsChange(points.map((entry) => (entry.id === point.id ? point : entry)));
  };

  // Ohne Bild trägt das neue Bild seinen Text schon selbst (`ImageField.select`).
  const changeAlt = (alt: string): void => {
    if (image !== null) onImageChange({ ...image, alt });
  };

  return (
      <div className="man-hie__layout">
        <div className="man-hie__left">
          <ImageField image={image} alt={image?.alt ?? ""} onChange={onImageChange} onAltChange={changeAlt} />
          {image === null ? (
            <p className="man-hie__hint" data-testid="point-editor-needs-image">
              Ohne Bild gibt es keine Fläche, auf der Punkte liegen könnten.
            </p>
          ) : (
            <>
              {full && (
                <p className="man-hie__hint" data-testid="point-editor-full">
                  Mehr als {MAX_POINTS} Punkte trägt ein Bild nicht.
                </p>
              )}
              <PlacementCanvas
                image={image}
                points={points}
                selectedId={selectedId}
                onAdd={onAdd}
                onMove={onMove}
                onSelect={setSelectedId}
              />
            </>
          )}
        </div>
        <div className="man-hie__right">
          {/* Leer gerendert zeichnete der Rahmen der Liste nur eine Linie
              neben das Bild -- am 29.09.2026 im Content Designer gesehen. */}
          {points.length === 0 ? (
            <p className="man-hie__hint" data-testid="point-editor-no-points">
              {image === null ? "Noch keine Punkte." : "Noch keine Punkte. Ein Klick ins Bild setzt den ersten."}
            </p>
          ) : (
            <ul className="man-hie__list">
              {points.map((point, index) => (
                <li key={point.id}>
                  <button
                    type="button"
                    className={`man-hie__list-item${point.id === selectedId ? " man-hie__list-item--active" : ""}`}
                    onClick={() => setSelectedId(point.id)}
                  >
                    {index + 1}. {point.title === "" ? "Ohne Titel" : point.title}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {selected !== null && (
            <>
              <div className="man-hie__image-actions">
                <button
                  type="button"
                  className="man-hie__button"
                  disabled={selectedIndex <= 0}
                  onClick={() => swap(-1)}
                >
                  Nach oben
                </button>
                <button
                  type="button"
                  className="man-hie__button"
                  disabled={selectedIndex >= points.length - 1}
                  onClick={() => swap(1)}
                >
                  Nach unten
                </button>
              </div>
              <PointForm point={selected} onChange={onFormChange} onRemove={onRemove} />
            </>
          )}
        </div>
      </div>
  );
}
