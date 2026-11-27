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
 * Was an einem Punkt steht: Titel, Beschreibung, Link, Farbe und Icon – der Rumpf
 * des Panels „Punkt N“ rechts.
 *
 * Der Titel ist Pflicht: `parsePoints` verwirft beim Lesen jeden Punkt ohne
 * ihn. Das darf die Redaktion nicht erst am leeren Bild bemerken, deshalb der
 * Hinweis gleich am Feld; nach einem gescheiterten „Übernehmen“ wird er zum
 * Fehler.
 */

import * as React from "react";
import { ReactElement } from "react";
import { Field } from "@man/config-ui/form/field";
import { Input } from "@man/config-ui/primitives/input";
import { Textarea } from "@man/config-ui/primitives/textarea";
import { PickedMedia } from "@shared/media/media-picker";

import { isUntitled } from "../editor-rules";
import { HotspotPoint } from "../points-model";
import { LinkField, PageLoader } from "./link-field";
import { PointColorField } from "./point-color-field";
import { PointIconField } from "./point-icon-field";

export const POINT_FORM_MESSAGES = {
  title: "Titel",
  titleHint: "Ohne Titel lässt sich der Punkt nicht übernehmen.",
  titleError: "Titel fehlt – ohne ihn ginge der Punkt beim Übernehmen verloren.",
  description: "Beschreibung",
  iconAside: "statt der Nummer",
} as const;

export interface PointFormProps {
  point: HotspotPoint;
  /** Die laufende Nummer, ab 1 – für Titel der Mediathek-Leiste. */
  number: number;
  onChange: (point: HotspotPoint) => void;
  onPickIcon: (picked: PickedMedia) => void;
  issuesVisible: boolean;
  /** Die Farbe aller Punkte – was gilt, solange der Punkt keine eigene hat. */
  globalColor?: string | null;
  /** Nur für Tests. */
  loadPages?: PageLoader;
}

/** Ein Feld ohne Wert ist kein leerer Wert, sondern gar keiner – so bleibt das Attribut schlank. */
function without<K extends "description" | "link" | "icon" | "color">(point: HotspotPoint, key: K): HotspotPoint {
  const rest: HotspotPoint = { ...point };
  delete rest[key];
  return rest;
}

export function PointForm({
  point,
  number,
  onChange,
  onPickIcon,
  issuesVisible,
  globalColor = null,
  loadPages,
}: PointFormProps): ReactElement {
  const untitled = isUntitled(point);
  return (
    <div className="flex flex-col gap-6" data-testid="point-form">
      <Field
        label={POINT_FORM_MESSAGES.title}
        required
        error={untitled && issuesVisible ? POINT_FORM_MESSAGES.titleError : undefined}
        hint={untitled && !issuesVisible ? POINT_FORM_MESSAGES.titleHint : undefined}
      >
        <Input
          type="text"
          className="h-10"
          data-testid="point-form-title"
          value={point.title}
          onChange={(event) => onChange({ ...point, title: event.target.value })}
        />
      </Field>
      <Field label={POINT_FORM_MESSAGES.description}>
        <Textarea
          rows={3}
          data-testid="point-form-description"
          value={point.description ?? ""}
          onChange={(event) => {
            const value = event.target.value;
            onChange(value === "" ? without(point, "description") : { ...point, description: value });
          }}
        />
      </Field>
      <LinkField
        link={point.link}
        load={loadPages}
        onChange={(link) => onChange(link === undefined ? without(point, "link") : { ...point, link })}
      />
      <PointColorField
        color={point.color}
        global={globalColor}
        onChange={(color) => onChange(color === undefined ? without(point, "color") : { ...point, color })}
      />
      <PointIconField
        icon={point.icon}
        aside={POINT_FORM_MESSAGES.iconAside}
        mediaTitle={`Icon für Punkt ${number}`}
        onPick={onPickIcon}
        onChange={(icon) => onChange(icon === undefined ? without(point, "icon") : { ...point, icon })}
      />
    </div>
  );
}
