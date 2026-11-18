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
 * Das eigene Bild eines Punkts (Abschnitt „Icon“): aus der Mediathek wählen
 * oder hineinziehen, Größe S/M/L und Hintergrund als Pills, wieder
 * entfernen. Ohne Icon bleibt es beim Punkt.
 */

import * as React from "react";
import { ReactElement } from "react";
import { ChevronDown } from "lucide-react";
import { Field } from "@man/config-ui/form/field";
import { FormSection } from "@man/config-ui/form/form-section";
import type { IconComponent, SegmentedOption } from "@man/config-ui/form/segmented";
import { SegmentedField } from "@man/config-ui/form/segmented-field";
import { Button } from "@man/config-ui/primitives/button";
import { cn } from "@man/config-ui/primitives/utils";
import { PickedMedia } from "@shared/media/media-picker";

import { DEFAULT_ICON_SIZE, ICON_BACKGROUNDS, IconBackground, IconSize, PointIcon } from "../point-icon";
import { MediaDrop, fileNameOf, useEditorMedia } from "./editor-media";

export const ICON_FIELD_MESSAGES = {
  section: "Icon",
  medium: "Medium",
  none: "Kein Icon",
  noneHint: "Ohne Icon erscheint der Punkt. Ein Bild lässt sich auch aus der Mediathek hierher ziehen.",
  size: "Größe",
  sizeHint: "32, 48 oder 72 Pixel – so groß wie auf der Seite.",
  background: "Hintergrund",
  backgroundHint: "Eine runde Fläche hinter dem Icon, in den Farben der Seite.",
  remove: "Icon entfernen",
  backgrounds: {
    none: "Transparent",
    white: "Weiß",
    red: "MAN-Rot",
    dark: "Anthrazit",
    light: "Hellgrau",
  } as Record<IconBackground | "none", string>,
} as const;

/** Das Icon aus der Mediathek; Größe und Hintergrund des bisherigen bleiben. */
export function iconFromPick(picked: PickedMedia, previous: PointIcon | undefined): PointIcon {
  const base = { url: picked.url, size: previous?.size ?? DEFAULT_ICON_SIZE };
  return previous?.background === undefined ? base : { ...base, background: previous.background };
}

const SIZE_OPTIONS: readonly SegmentedOption<IconSize>[] = [
  { id: "s", label: "S" },
  { id: "m", label: "M" },
  { id: "l", label: "L" },
];

type BackgroundChoice = IconBackground | "none";

/** Ein Farbtupfer als Icon einer Pill; die Farben kommen aus `editor-canvas.scss`. */
function swatch(choice: BackgroundChoice): IconComponent {
  return function Swatch(): ReactElement {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "size-3.5 shrink-0 rounded-full ring-1 ring-foreground/30 ring-inset",
          choice === "none" ? "bg-transparent" : `man-hie__icon-bg--${choice}`,
        )}
      />
    );
  };
}

const BACKGROUND_OPTIONS: readonly SegmentedOption<BackgroundChoice>[] = (["none", ...ICON_BACKGROUNDS] as const).map(
  (choice) => ({ id: choice, label: ICON_FIELD_MESSAGES.backgrounds[choice], icon: swatch(choice), iconOnly: true }),
);

export interface PointIconFieldProps {
  icon: PointIcon | undefined;
  onChange: (icon: PointIcon | undefined) => void;
  /** Ein Bild aus der Mediathek; schreibt über den jüngsten Stand, etwa mit {@link iconFromPick}. */
  onPick: (picked: PickedMedia) => void;
  /** Randnotiz am Abschnitt: „statt der Nummer“ oder „statt des Punkts“. */
  aside: string;
  /** Titel der Mediathek-Leiste, etwa „Icon für Punkt 2“. */
  mediaTitle: string;
}

export function PointIconField({ icon, onChange, onPick, aside, mediaTitle }: PointIconFieldProps): ReactElement {
  const media = useEditorMedia();
  return (
    <FormSection title={ICON_FIELD_MESSAGES.section} aside={aside}>
      <MediaDrop className="gap-4" testId="point-icon-drop" onPick={onPick}>
        <Field label={ICON_FIELD_MESSAGES.medium} hint={icon === undefined ? ICON_FIELD_MESSAGES.noneHint : undefined}>
          <button
            type="button"
            aria-haspopup="dialog"
            data-testid="point-icon-medium"
            className="flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-input bg-background px-3 text-left text-sm shadow-xs outline-none hover:bg-accent focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            onClick={() => media.pick(mediaTitle, onPick)}
          >
            <span className="flex min-w-0 items-center gap-2">
              {icon !== undefined && <img className="size-5 shrink-0 object-contain" src={icon.url} alt="" />}
              <span className={cn("truncate", icon === undefined && "text-muted-foreground")}>
                {icon === undefined ? ICON_FIELD_MESSAGES.none : fileNameOf(icon.url)}
              </span>
            </span>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          </button>
        </Field>
        {icon !== undefined && (
          <>
            <SegmentedField
              label={ICON_FIELD_MESSAGES.size}
              hint={ICON_FIELD_MESSAGES.sizeHint}
              options={SIZE_OPTIONS}
              value={icon.size}
              onChange={(size) => onChange({ ...icon, size })}
            />
            <SegmentedField
              label={ICON_FIELD_MESSAGES.background}
              hint={ICON_FIELD_MESSAGES.backgroundHint}
              options={BACKGROUND_OPTIONS}
              value={icon.background ?? "none"}
              onChange={(choice) => {
                const base = { url: icon.url, size: icon.size };
                onChange(choice === "none" ? base : { ...base, background: choice });
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="self-start text-destructive hover:text-destructive"
              data-testid="point-icon-remove"
              onClick={() => onChange(undefined)}
            >
              {ICON_FIELD_MESSAGES.remove}
            </Button>
          </>
        )}
      </MediaDrop>
    </FormSection>
  );
}
