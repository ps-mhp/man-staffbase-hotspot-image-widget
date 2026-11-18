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
 * Die Leiste über der Bühne wie im Screen: links die Quelle der Punkte
 * (Manuell · Aus dem Menü), daneben welches Bild gerade bearbeitet wird und
 * „Bild ändern“, rechts im manuellen Modus die Darstellung
 * (Nummern · Punkte).
 *
 * Der Name des Bildes ist selbst ein Knopf: er zeigt rechts die
 * Einstellungen des Bildes (Bildbeschreibung, Entfernen) bzw. des Menüs,
 * statt die des gewählten Punkts.
 */

import * as React from "react";
import { ReactElement } from "react";
import { Segmented, type SegmentedOption } from "@man/config-ui/form/segmented";
import { Button } from "@man/config-ui/primitives/button";
import { ToolSeparator, Toolbar } from "@man/config-ui/toolbar/toolbar";

import { PointSource } from "../menu-points-model";
import { DisplayMode } from "../points-model";

export const BAR_MESSAGES = {
  toolbar: "Bild und Darstellung",
  source: "Quelle der Punkte",
  manual: "Manuell",
  menu: "Aus dem Menü",
  display: "Darstellung der Punkte",
  numbered: "Nummern",
  dots: "Punkte",
  settingsTitle: "Einstellungen des Bildes rechts zeigen",
} as const;

const SOURCE_OPTIONS: readonly SegmentedOption<PointSource>[] = [
  { id: "manual", label: BAR_MESSAGES.manual },
  { id: "menu", label: BAR_MESSAGES.menu },
];

const DISPLAY_OPTIONS: readonly SegmentedOption<DisplayMode>[] = [
  { id: "numbered", label: BAR_MESSAGES.numbered },
  { id: "dots", label: BAR_MESSAGES.dots },
];

export interface CanvasBarProps {
  source: PointSource;
  onSourceChange: (source: PointSource) => void;
  /** Was bearbeitet wird, etwa „Bild: werksplan.jpg“ oder „Ebene: A › B · Bild: b.jpg“. */
  imageLabel: string;
  /** Ob rechts gerade die Einstellungen des Bildes stehen. */
  settingsShown: boolean;
  onShowSettings: () => void;
  /** „Bild ändern“ oder „Bild wählen“. */
  pickLabel: string;
  /** Fehlt, wo es gerade kein Bild zu wählen gibt (etwa ohne Menü). */
  onPick?: () => void;
  display?: { value: DisplayMode; onChange: (mode: DisplayMode) => void };
}

export function CanvasBar({
  source,
  onSourceChange,
  imageLabel,
  settingsShown,
  onShowSettings,
  pickLabel,
  onPick,
  display,
}: CanvasBarProps): ReactElement {
  return (
    <Toolbar aria-label={BAR_MESSAGES.toolbar} data-testid="canvas-bar">
      <Segmented aria-label={BAR_MESSAGES.source} options={SOURCE_OPTIONS} value={source} onChange={onSourceChange} />
      <ToolSeparator />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-10 max-w-[28rem] min-w-0 justify-start font-normal text-muted-foreground"
        aria-pressed={settingsShown}
        title={BAR_MESSAGES.settingsTitle}
        data-testid="canvas-bar-image"
        onClick={onShowSettings}
      >
        <span className="truncate">{imageLabel}</span>
      </Button>
      {onPick !== undefined && (
        <Button type="button" variant="ghost" size="sm" className="h-10" data-testid="canvas-bar-pick" onClick={onPick}>
          {pickLabel}
        </Button>
      )}
      <span className="flex-1" aria-hidden="true" />
      {display !== undefined && (
        <Segmented
          aria-label={BAR_MESSAGES.display}
          options={DISPLAY_OPTIONS}
          value={display.value}
          onChange={display.onChange}
        />
      )}
    </Toolbar>
  );
}
