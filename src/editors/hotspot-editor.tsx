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
 * Das eine Fenster des Widgets: Modus, Bild, Darstellung, Menü-Einstellungen
 * und Punkte — alles, was früher auf neun Felder des Staffbase-Dialogs
 * verteilt war. Der Entwurf ist die ganze {@link HotspotConfig}; „Übernehmen“
 * schreibt sie in das eine Feld `config`.
 */

import * as React from "react";
import { ReactElement } from "react";

import { FieldModalContentProps } from "@shared/config-modal";
import { useHotStyle } from "@shared/hot-style";

import { HotspotConfig } from "../hotspot-config";
import { PointSource } from "../menu-points-model";
import { MenuTreeLoader } from "../menu/use-menu-tree";
import { DisplayMode } from "../points-model";
import pointEditorCss from "../styles/point-editor.scss";
import { ManualPanel, untitledCount } from "./manual-panel";
import { MenuPanel } from "./menu-panel";

export const EDITOR_MESSAGES = {
  source: "Modus",
  manual: "Manuell",
  menu: "Menü",
  display: "Darstellung",
  numbered: "Nummeriert, mit Liste neben dem Bild",
  dots: "Punkte, ohne Liste",
  untitled: (count: number): string =>
    count === 1
      ? "Ein Punkt im Modus „Manuell“ hat noch keinen Titel. Ohne Titel ginge er beim Übernehmen verloren."
      : `${count} Punkte im Modus „Manuell“ haben noch keinen Titel. Ohne Titel gingen sie beim Übernehmen verloren.`,
  cancel: "Abbrechen",
  save: "Übernehmen",
} as const;

export interface HotspotEditorProps extends FieldModalContentProps<HotspotConfig> {
  /** Nur für Tests. */
  loadTree?: MenuTreeLoader;
}

const SOURCES: Array<{ value: PointSource; label: string }> = [
  { value: "manual", label: EDITOR_MESSAGES.manual },
  { value: "menu", label: EDITOR_MESSAGES.menu },
];

export function HotspotEditor({ value, onChange, onSave, onClose, loadTree }: HotspotEditorProps): ReactElement {
  const css = useHotStyle(pointEditorCss, "hotspot-image-widget", "styles/point-editor.scss");
  const set = (patch: Partial<HotspotConfig>): void => onChange({ ...value, ...patch });
  const setImage = (image: HotspotConfig["image"]): void => set({ image });

  /**
   * Punkte ohne Titel überleben das Speichern nicht: `readPoint` verwirft sie
   * beim nächsten Lesen, und mit ihnen Beschreibung und Link. Gilt auch, wenn
   * gerade der Menü-Modus gewählt ist — die Punkte des manuellen bleiben ja
   * gespeichert.
   */
  const untitled = untitledCount(value.manual.points);

  return (
    <div className="man-hie">
      <style>{css}</style>
      <div className="man-hie__settings">
        <div className="man-hie__label" role="radiogroup" aria-label={EDITOR_MESSAGES.source}>
          {EDITOR_MESSAGES.source}
          <div className="man-hie__segments">
            {SOURCES.map(({ value: source, label }) => (
              <button
                key={source}
                type="button"
                role="radio"
                aria-checked={value.source === source}
                className={`man-hie__segment${value.source === source ? " man-hie__segment--active" : ""}`}
                data-testid={`editor-source-${source}`}
                onClick={() => set({ source })}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {value.source === "manual" && (
          <label className="man-hie__label">
            {EDITOR_MESSAGES.display}
            <select
              className="man-hie__input"
              value={value.manual.mode}
              data-testid="editor-display-mode"
              onChange={(event) =>
                set({ manual: { ...value.manual, mode: event.target.value as DisplayMode } })
              }
            >
              <option value="numbered">{EDITOR_MESSAGES.numbered}</option>
              <option value="dots">{EDITOR_MESSAGES.dots}</option>
            </select>
          </label>
        )}
      </div>

      {value.source === "manual" ? (
        <ManualPanel
          image={value.image}
          onImageChange={setImage}
          points={value.manual.points}
          onPointsChange={(points) => set({ manual: { ...value.manual, points } })}
        />
      ) : (
        <MenuPanel
          rootImage={value.image}
          onRootImageChange={setImage}
          menu={value.menu}
          onMenuChange={(menu) => set({ menu })}
          loadTree={loadTree}
        />
      )}

      {untitled > 0 && (
        <p className="man-hie__hint man-hie__hint--footer" data-testid="point-editor-untitled" role="alert">
          {EDITOR_MESSAGES.untitled(untitled)}
        </p>
      )}
      <div className="man-hie__footer">
        <button type="button" className="man-hie__button" onClick={onClose}>
          {EDITOR_MESSAGES.cancel}
        </button>
        <button
          type="button"
          className="man-hie__button man-hie__button--primary"
          disabled={untitled > 0}
          onClick={onSave}
        >
          {EDITOR_MESSAGES.save}
        </button>
      </div>
    </div>
  );
}
