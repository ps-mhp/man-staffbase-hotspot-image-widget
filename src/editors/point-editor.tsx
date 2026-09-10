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
 * Der Redaktionsdialog des Punkte-Editors.
 *
 * Setzt die Bausteine der vorigen Aufgaben zusammen: Bildwahl, Bühne zum
 * Setzen und Schieben, Liste der Punkte zum Umsortieren und das Formular des
 * ausgewählten Punkts. Fachlichen Zustand außer der Auswahl trägt er nicht --
 * das Modell steckt in `HotspotPoint[]`, das Bild lebt in seinem eigenen
 * Attribut.
 *
 * Das Bild geht nicht durch `onChange`: dieser Editor hängt am Feld `points`,
 * `onChange`/`onSave` schreiben nur dorthin zurück. Ein zweites, eigenes
 * Attribut fürs Bild bedeutet, dass ein Bildwechsel sofort geschrieben werden
 * muss -- über `writeImageAttribute` --, statt auf das „Übernehmen" dieses
 * Formulars zu warten.
 */

import * as React from "react";
import { ReactElement, useState } from "react";

import { FieldModalContentProps } from "@shared/config-modal";
import { useHotStyle } from "@shared/hot-style";

import { HotspotImage, HotspotPoint, MAX_POINTS, emptyPoint } from "../points-model";
import { ImageField } from "./image-field";
import { PlacementCanvas } from "./placement-canvas";
import { PointForm } from "./point-form";
import { readImageAttribute, writeImageAttribute } from "./use-image-attribute";
import pointEditorCss from "../styles/point-editor.scss";

// Kein eigenes Feld: `interface ... extends ... {}` wäre nach der hiesigen
// ESLint-Regel `no-empty-object-type` ein Fehler, weil eine leere Schnittstelle
// nichts zu ihrem Obertyp beiträgt. Ein Alias sagt dasselbe ohne den Verstoß.
export type PointEditorProps = FieldModalContentProps<HotspotPoint[]>;

export function PointEditor({ value, onChange, onSave, onClose }: PointEditorProps): ReactElement {
  const css = useHotStyle(pointEditorCss, "hotspot-image-widget", "styles/point-editor.scss");

  const [image, setImage] = useState<HotspotImage | null>(() => readImageAttribute());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [full, setFull] = useState(false);

  const changeImage = (next: HotspotImage | null): void => {
    setImage(next);
    writeImageAttribute(next);
  };

  const selectedIndex = value.findIndex((point) => point.id === selectedId);
  const selected = selectedIndex === -1 ? null : value[selectedIndex];

  const onAdd = (x: number, y: number): void => {
    if (value.length >= MAX_POINTS) {
      setFull(true);
      return;
    }
    const point = emptyPoint(x, y);
    onChange([...value, point]);
    setSelectedId(point.id);
  };

  const onMove = (pointId: string, x: number, y: number): void => {
    onChange(value.map((point) => (point.id === pointId ? { ...point, x, y } : point)));
  };

  const swap = (offset: 1 | -1): void => {
    if (selected === null) return;
    const otherIndex = selectedIndex + offset;
    if (otherIndex < 0 || otherIndex >= value.length) return;
    const next = [...value];
    next[selectedIndex] = next[otherIndex];
    next[otherIndex] = selected;
    onChange(next);
  };

  const onRemove = (): void => {
    if (selected === null) return;
    onChange(value.filter((point) => point.id !== selected.id));
    setSelectedId(null);
  };

  const onFormChange = (point: HotspotPoint): void => {
    onChange(value.map((entry) => (entry.id === point.id ? point : entry)));
  };

  return (
    <div className="man-hie">
      {css}
      <div className="man-hie__layout">
        <div className="man-hie__left">
          <ImageField image={image} onChange={changeImage} />
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
                points={value}
                selectedId={selectedId}
                onAdd={onAdd}
                onMove={onMove}
                onSelect={setSelectedId}
              />
            </>
          )}
        </div>
        <div className="man-hie__right">
          <ul className="man-hie__list">
            {value.map((point, index) => (
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
                  disabled={selectedIndex >= value.length - 1}
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
      <div className="man-hie__image-actions">
        <button type="button" className="man-hie__button" onClick={onClose}>
          Abbrechen
        </button>
        <button type="button" className="man-hie__button man-hie__button--primary" onClick={onSave}>
          Übernehmen
        </button>
      </div>
    </div>
  );
}
