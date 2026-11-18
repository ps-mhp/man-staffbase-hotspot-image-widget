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
 * Ein Bild mit Alternativtext im Panel rechts: Kachel (160 × 90), daneben
 * Dateiname und Maße, darunter „Ersetzen“ und „Entfernen“, dann die
 * Bildbeschreibung. Ohne Bild eine gestrichelte Kachel „Bild wählen“.
 *
 * Der Alternativtext steht hier und nicht in der Mediathek: er beschreibt,
 * wozu das Bild in diesem Widget dient, und das weiß nur, wer es einsetzt.
 * Das ganze Feld nimmt Bilder aus der Mediathek-Leiste auch per Ziehen an.
 */

import * as React from "react";
import { ReactElement } from "react";
import { Field } from "@man/config-ui/form/field";
import { Button } from "@man/config-ui/primitives/button";
import { Input } from "@man/config-ui/primitives/input";

import { PickedMedia } from "@shared/media/media-picker";

import { HotspotImage } from "../points-model";
import { MediaDrop, fileNameOf, useEditorMedia } from "./editor-media";

export const IMAGE_FIELD_MESSAGES = {
  pick: "Bild wählen",
  replace: "Ersetzen",
  remove: "Entfernen",
  alt: "Bildbeschreibung",
  altHint: "Beschreibt das Bild für Screenreader. Leer lassen, wenn es nur schmückt.",
  altPlaceholder: "Was ist zu sehen?",
} as const;

export interface ImageFieldProps {
  /** Was das Bild ist, etwa „Bild“ oder „Bild der Ebene „Fahrerhaus““ – auch Titel der Mediathek-Leiste. */
  label: string;
  image: HotspotImage | null;
  /** Alternativtext geändert oder Bild entfernt. */
  onChange: (image: HotspotImage | null) => void;
  /**
   * Ein Bild aus der Mediathek (gewählt oder abgelegt). Wird beim Öffnen der
   * Leiste festgehalten: der Aufrufer schreibt über den jüngsten Stand, etwa
   * mit `imageFromPick`.
   */
  onPick: (picked: PickedMedia) => void;
  /** Ein Satz unter dem Feld, etwa warum es ohne Bild nicht geht. */
  hint?: React.ReactNode;
  testId: string;
}

const HINT = "text-[13px] text-muted-foreground";

function metaOf(image: HotspotImage): string {
  return image.width !== undefined && image.height !== undefined ? `${image.width} × ${image.height} px` : "Bild";
}

export function ImageField({ label, image, onChange, onPick, hint, testId }: ImageFieldProps): ReactElement {
  const media = useEditorMedia();
  const pick = (): void => media.pick(label, onPick);

  return (
    <MediaDrop className="gap-3" testId={`${testId}-drop`} onPick={onPick}>
      <span className="text-[13px] font-semibold text-foreground">{label}</span>
      <div className="flex flex-wrap items-center gap-4">
        {image === null ? (
          <button
            type="button"
            className="flex h-[90px] w-40 shrink-0 cursor-pointer items-center justify-center rounded-md border border-dashed border-primary-soft-border bg-primary-soft px-2 text-center text-[13px] font-semibold text-primary outline-none hover:bg-primary-soft/70 focus-visible:ring-[3px] focus-visible:ring-ring/40"
            aria-label={`${label}: ${IMAGE_FIELD_MESSAGES.pick}`}
            data-testid={`${testId}-pick`}
            onClick={pick}
          >
            {IMAGE_FIELD_MESSAGES.pick}
          </button>
        ) : (
          <img className="h-[90px] w-40 shrink-0 rounded-md border bg-stage object-cover" src={image.url} alt="" />
        )}
        {image !== null && (
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm text-foreground" title={image.url}>
                {fileNameOf(image.url)}
              </span>
              <span className={HINT}>{metaOf(image)}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                aria-label={`${label} ersetzen`}
                data-testid={`${testId}-replace`}
                onClick={pick}
              >
                {IMAGE_FIELD_MESSAGES.replace}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                aria-label={`${label} entfernen`}
                data-testid={`${testId}-clear`}
                onClick={() => onChange(null)}
              >
                {IMAGE_FIELD_MESSAGES.remove}
              </Button>
            </div>
          </div>
        )}
      </div>
      {hint !== undefined && <p className={HINT}>{hint}</p>}
      {image !== null && (
        <Field label={IMAGE_FIELD_MESSAGES.alt} hint={IMAGE_FIELD_MESSAGES.altHint}>
          <Input
            type="text"
            className="h-10"
            data-testid={`${testId}-alt`}
            placeholder={IMAGE_FIELD_MESSAGES.altPlaceholder}
            value={image.alt}
            onChange={(event) => onChange({ ...image, alt: event.target.value })}
          />
        </Field>
      )}
    </MediaDrop>
  );
}
