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
 * Bildauswahl und Alternativtext im Punkte-Editor.
 *
 * Der Alternativtext steht hier und nicht in der Mediathek: er beschreibt,
 * wozu das Bild in diesem Widget dient, und das weiß nur, wer es einsetzt.
 */

import * as React from "react";
import { ReactElement, useMemo, useState } from "react";

import { MediaPicker, PickedImage } from "@shared/media/media-picker";
import { createMediaClient } from "@shared/media/media-client";

import { HotspotImage } from "../points-model";

export interface ImageFieldProps {
  image: HotspotImage | null;
  onChange: (image: HotspotImage | null) => void;
}

export function ImageField({ image, onChange }: ImageFieldProps): ReactElement {
  const [picking, setPicking] = useState(false);
  const client = useMemo(() => createMediaClient(), []);

  const select = (picked: PickedImage) => {
    setPicking(false);
    onChange({
      url: picked.url,
      // Der bisherige Alternativtext hat Vorrang: er wurde für dieses Widget
      // geschrieben, der aus der Mediathek nur fürs Bild.
      alt: image?.alt ?? picked.alt ?? "",
      ...(picked.width !== undefined ? { width: picked.width } : {}),
      ...(picked.height !== undefined ? { height: picked.height } : {}),
    });
  };

  return (
    <div className="man-hie__image">
      {image === null ? (
        <button type="button" className="man-hie__button" onClick={() => setPicking(true)}>
          Bild wählen …
        </button>
      ) : (
        <div className="man-hie__image-chosen">
          {/*
            Keine Vorschau: die Bühne darunter zeigt dasselbe Bild, nur mit den
            Punkten darauf. Beides übereinander schob im Studio den halben
            Dialog aus dem Fenster -- am 10.09.2026 im Studio gesehen.
          */}
          <div className="man-hie__image-actions">
            <button type="button" className="man-hie__button" onClick={() => setPicking(true)}>
              Anderes Bild wählen …
            </button>
            <button type="button" className="man-hie__button" onClick={() => onChange(null)}>
              Bild entfernen
            </button>
          </div>
          <label className="man-hie__label">
            Alternativtext
            <input
              className="man-hie__input"
              type="text"
              value={image.alt}
              onChange={(event) => onChange({ ...image, alt: event.target.value })}
            />
          </label>
        </div>
      )}

      {picking && (
        <MediaPicker client={client} onSelect={select} onClose={() => setPicking(false)} />
      )}
    </div>
  );
}
