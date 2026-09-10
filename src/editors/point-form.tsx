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
 * Was an einem Punkt steht: Titel, Beschreibung, Ziel.
 *
 * Der Titel ist Pflicht -- `parsePoints` verwirft beim Lesen jeden Punkt ohne
 * ihn. Das darf die Redaktion nicht erst am leeren Bild bemerken, deshalb der
 * Hinweis unmittelbar am Feld.
 */

import * as React from "react";
import { ReactElement } from "react";

import { HotspotPoint } from "../points-model";
import { LinkField } from "./link-field";

export interface PointFormProps {
  point: HotspotPoint;
  onChange: (point: HotspotPoint) => void;
  onRemove: () => void;
}

export function PointForm({ point, onChange, onRemove }: PointFormProps): ReactElement {
  const setDescription = (value: string): void => {
    // Ein leeres Feld ist keine leere Beschreibung, sondern gar keine.
    // `parsePoints` wirft sie beim Lesen ohnehin weg; sie hier zu speichern
    // blähte nur das Attribut auf.
    const rest: HotspotPoint = { ...point };
    delete rest.description;
    onChange(value === "" ? rest : { ...rest, description: value });
  };

  const titleMissing = point.title.trim() === "";
  const warningId = `man-hie-title-warning-${point.id}`;

  return (
    <div className="man-hie__form">
      <label className="man-hie__label">
        Titel
        <input
          className="man-hie__input"
          type="text"
          value={point.title}
          // Der Hinweis steht neben dem Feld; ohne diese Verknüpfung liest ein
          // Screenreader ihn beim Betreten des Feldes nicht mit vor.
          aria-invalid={titleMissing}
          aria-describedby={titleMissing ? warningId : undefined}
          onChange={(event) => onChange({ ...point, title: event.target.value })}
        />
      </label>
      {titleMissing && (
        <p className="man-hie__hint" id={warningId} data-testid="point-form-warning">
          Ohne Titel lässt sich der Punkt nicht übernehmen.
        </p>
      )}

      <label className="man-hie__label">
        Beschreibung
        <textarea
          className="man-hie__textarea"
          value={point.description ?? ""}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>

      <LinkField
        link={point.link}
        onChange={(link) => {
          const rest: HotspotPoint = { ...point };
          delete rest.link;
          onChange(link === undefined ? rest : { ...rest, link });
        }}
      />

      <button type="button" className="man-hie__button" onClick={onRemove}>
        Punkt löschen
      </button>
    </div>
  );
}
