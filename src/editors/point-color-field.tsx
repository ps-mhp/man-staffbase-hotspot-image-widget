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
 * Die Farbe der Punkte im Fenster: einmal für alle in der Leiste über der
 * Bühne, einmal je Punkt im Panel rechts. Beide mit dem Farbwerkzeug aus
 * `@man/config-ui` – derselben Wahl wie „Schriftfarbe“ in Tabelle und USP,
 * mit den MAN-CI-Farben und „Eigene Farbe …“.
 */

import * as React from "react";
import { ReactElement } from "react";
import { Square } from "lucide-react";
import { ColorTool } from "@man/config-ui/toolbar/color-tool";
import { colorName } from "@man/config-ui/toolbar/colors";

/** MAN-Rot: die Farbe der Punkte, solange niemand eine wählt. */
export const DEFAULT_MARKER_COLOR = "#e40045";

export const COLOR_FIELD_MESSAGES = {
  all: "Farbe aller Punkte",
  standard: "MAN Rot (Standard)",
  point: "Farbe",
  inherit: "Wie alle Punkte",
  inherits: (global: string | null): string => `Wie alle Punkte: ${global === null ? "MAN Rot" : colorName(global)}`,
  own: (color: string): string => `Eigene Farbe: ${colorName(color)}`,
} as const;

const glyph = <Square className="size-4" aria-hidden />;

export interface MarkerColorToolProps {
  value: string | null;
  onChange: (color: string | null) => void;
}

/** Die Farbe aller Punkte, als Werkzeug in der Leiste über der Bühne. */
export function MarkerColorTool({ value, onChange }: MarkerColorToolProps): ReactElement {
  return (
    <ColorTool
      testId="marker-color"
      label={COLOR_FIELD_MESSAGES.all}
      value={value ?? undefined}
      onChange={onChange}
      onClear={() => onChange(null)}
      clearLabel={COLOR_FIELD_MESSAGES.standard}
      glyph={glyph}
      standardBar={DEFAULT_MARKER_COLOR}
    />
  );
}

export interface PointColorFieldProps {
  /** Die eigene Farbe des Punkts, oder `undefined`. */
  color: string | undefined;
  /** Die Farbe aller Punkte – was ohne eigene gilt. */
  global: string | null;
  onChange: (color: string | undefined) => void;
}

/** Die eigene Farbe eines Punkts; ohne sie gilt die aller Punkte. */
export function PointColorField({ color, global, onChange }: PointColorFieldProps): ReactElement {
  return (
    <div className="flex flex-col gap-2" data-testid="point-color-field">
      <span className="text-sm font-medium">{COLOR_FIELD_MESSAGES.point}</span>
      <div className="flex items-center gap-2">
        <ColorTool
          testId="point-color"
          label={COLOR_FIELD_MESSAGES.point}
          value={color}
          onChange={onChange}
          onClear={() => onChange(undefined)}
          clearLabel={COLOR_FIELD_MESSAGES.inherit}
          glyph={glyph}
          standardBar={global ?? DEFAULT_MARKER_COLOR}
        />
        <span className="text-[13px] text-muted-foreground" data-testid="point-color-state">
          {color === undefined ? COLOR_FIELD_MESSAGES.inherits(global) : COLOR_FIELD_MESSAGES.own(color)}
        </span>
      </div>
    </div>
  );
}
