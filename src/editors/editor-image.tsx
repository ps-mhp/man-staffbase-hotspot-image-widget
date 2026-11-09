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
 * Das Bild in einem Editor-Fenster — gemeinsam für den Punkte-Editor und den
 * Editor des Modus „Menü“.
 *
 * Das Bild geht nicht durch `onChange` des Fensters: der Editor hängt an
 * einem anderen Feld, `onChange`/`onSave` schreiben nur dorthin zurück. Ein
 * Bildwechsel wird deshalb sofort in sein eigenes Feld geschrieben
 * (`writeImageAttribute`), statt auf das „Übernehmen“ des Fensters zu warten.
 */

import * as React from "react";
import { ReactElement, useState } from "react";

import { HotspotImage } from "../points-model";
import { ImageField } from "./image-field";
import {
  ImageSource,
  imageSource,
  readImageAlt,
  readImageAttribute,
  writeImageAlt,
  writeImageAttribute,
} from "./use-image-attribute";

export interface EditorImage {
  source: ImageSource;
  image: HotspotImage | null;
  alt: string;
  /** Das Bild ließ sich nicht in sein Feld schreiben. */
  failed: boolean;
  change: (next: HotspotImage | null) => void;
  changeAlt: (next: string) => void;
}

export function useEditorImage(): EditorImage {
  // Beim Öffnen einmal gelesen: im Content Designer wählt das Formular das
  // Bild, und der Editor wird danach neu geöffnet.
  const [source] = useState(() => imageSource() ?? "field");
  const [image, setImage] = useState<HotspotImage | null>(() => readImageAttribute());
  const [alt, setAlt] = useState<string>(() => readImageAlt() || image?.alt || "");
  const [failed, setFailed] = useState(false);

  const change = (next: HotspotImage | null): void => {
    // Findet sich das Feld nicht, ist das Bild nirgends gespeichert -- es hier
    // trotzdem anzuzeigen, lüde dazu ein, Punkte auf einer Fläche zu setzen,
    // die nach dem Übernehmen leer wäre.
    if (!writeImageAttribute(next)) {
      setFailed(true);
      return;
    }
    setFailed(false);
    setImage(next);
  };

  const changeAlt = (next: string): void => {
    writeImageAlt(next);
    // Im klassischen Editor steht der Text auch im Bild-JSON. Mitgeführt,
    // damit ältere Leser dort nicht einen veralteten finden.
    if (source === "field" && image !== null) change({ ...image, alt: next });
    setAlt(next);
  };

  return { source, image, alt, failed, change, changeAlt };
}

/** Bildwahl samt Hinweis, wenn das Bild nicht zu speichern war. */
export function EditorImageField({ editorImage }: { editorImage: EditorImage }): ReactElement {
  const { image, alt, source, failed, change, changeAlt } = editorImage;
  return (
    <>
      <ImageField image={image} alt={alt} source={source} onChange={change} onAltChange={changeAlt} />
      {failed && (
        <p className="man-hie__hint" data-testid="point-editor-image-failed" role="alert">
          Das Bild liess sich nicht speichern. Schliesse das Fenster und
          trage es unten im Formular ein.
        </p>
      )}
    </>
  );
}
