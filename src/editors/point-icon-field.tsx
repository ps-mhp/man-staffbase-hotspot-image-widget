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
 * Das eigene Bild eines Punktes im Fenster: aus der Mediathek wählen, Grösse
 * S/M/L setzen, wieder entfernen. Ohne Bild bleibt es beim roten Punkt.
 */

import * as React from "react";
import { ReactElement, useMemo, useState } from "react";

import { createMediaClient } from "@shared/media/media-client";
import { MediaPicker, PickedImage } from "@shared/media/media-picker";

import { DEFAULT_ICON_SIZE, ICON_BACKGROUNDS, ICON_SIZES, IconBackground, IconSize, PointIcon } from "../point-icon";

export const ICON_FIELD_MESSAGES = {
  label: "Bild statt Punkt",
  choose: "Eigenes Bild wählen …",
  change: "Anderes Bild wählen …",
  remove: "Bild entfernen",
  size: "Größe",
  hint: "Ohne eigenes Bild erscheint der rote Punkt.",
  sizes: { s: "S – 32 px", m: "M – 48 px", l: "L – 72 px" } as Record<IconSize, string>,
  background: "Hintergrund",
  transparent: "Transparent",
  backgrounds: { white: "Weiß", red: "MAN-Rot", dark: "Anthrazit", light: "Hellgrau" } as Record<IconBackground, string>,
} as const;

export interface PointIconFieldProps {
  icon: PointIcon | undefined;
  onChange: (icon: PointIcon | undefined) => void;
}

export function PointIconField({ icon, onChange }: PointIconFieldProps): ReactElement {
  const [picking, setPicking] = useState(false);
  const client = useMemo(() => createMediaClient(), []);

  const select = (picked: PickedImage): void => {
    setPicking(false);
    const base = { url: picked.url, size: icon?.size ?? DEFAULT_ICON_SIZE };
    onChange(icon?.background === undefined ? base : { ...base, background: icon.background });
  };

  return (
    <div className="man-hie__form man-hie__icon-field" data-testid="point-icon-field">
      <span className="man-hie__label">{ICON_FIELD_MESSAGES.label}</span>
      {icon === undefined ? (
        <>
          <button type="button" className="man-hie__button" onClick={() => setPicking(true)}>
            {ICON_FIELD_MESSAGES.choose}
          </button>
          <p className="man-hie__hint">{ICON_FIELD_MESSAGES.hint}</p>
        </>
      ) : (
        <div className="man-hie__icon-chosen">
          <span
            className={`man-hie__icon-preview${icon.background === undefined ? "" : ` man-hie__icon-bg man-hie__icon-bg--${icon.background}`}`}
            style={{
              width: ICON_SIZES[icon.size],
              height: ICON_SIZES[icon.size],
              ["--man-hie-icon" as string]: `${ICON_SIZES[icon.size]}px`,
            }}
          >
            <img className="man-hie__canvas-icon" src={icon.url} alt="" />
          </span>
          <label className="man-hie__label">
            {ICON_FIELD_MESSAGES.size}
            <select
              className="man-hie__input"
              value={icon.size}
              data-testid="point-icon-size"
              onChange={(event) => onChange({ ...icon, size: event.target.value as IconSize })}
            >
              {(Object.keys(ICON_SIZES) as IconSize[]).map((size) => (
                <option key={size} value={size}>
                  {ICON_FIELD_MESSAGES.sizes[size]}
                </option>
              ))}
            </select>
          </label>
          <label className="man-hie__label">
            {ICON_FIELD_MESSAGES.background}
            <select
              className="man-hie__input"
              value={icon.background ?? ""}
              data-testid="point-icon-background"
              onChange={(event) => {
                const value = event.target.value as IconBackground | "";
                const base = { url: icon.url, size: icon.size };
                onChange(value === "" ? base : { ...base, background: value });
              }}
            >
              <option value="">{ICON_FIELD_MESSAGES.transparent}</option>
              {ICON_BACKGROUNDS.map((background) => (
                <option key={background} value={background}>
                  {ICON_FIELD_MESSAGES.backgrounds[background]}
                </option>
              ))}
            </select>
          </label>
          <div className="man-hie__image-actions">
            <button type="button" className="man-hie__button" onClick={() => setPicking(true)}>
              {ICON_FIELD_MESSAGES.change}
            </button>
            <button type="button" className="man-hie__button" onClick={() => onChange(undefined)}>
              {ICON_FIELD_MESSAGES.remove}
            </button>
          </div>
        </div>
      )}
      {picking && <MediaPicker client={client} onSelect={select} onClose={() => setPicking(false)} />}
    </div>
  );
}
