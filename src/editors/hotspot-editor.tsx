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
 * Das Fenster des Widgets im gemeinsamen Rahmen von `@man/config-ui`:
 * Kopf, Übernehmen, Rückgängig, Hilfe und Vorschau kommen vom Rahmen, hier
 * steht der Rumpf – je nach Quelle der Punkte der manuelle Modus
 * (`manual-editor.tsx`) oder der Menü-Modus (`menu-editor.tsx`).
 *
 * Der Entwurf ist ein {@link HotspotDraft}: die Konfiguration und die
 * Schlüssel, deren alten Wert das Fenster nicht lesen konnte. Jede Änderung
 * geht durch `changeConfig`, damit ein geänderter Schlüssel nicht mehr
 * geerbt ist. Nachgeladen wird das alles nur im Studio
 * (`hotspot-dialog.tsx`).
 */

import * as React from "react";
import { ReactElement, useCallback, useLayoutEffect, useMemo, useRef } from "react";
import { FieldModalContentProps } from "@shared/config-modal";
import { useHotStyle } from "@shared/hot-style";
import { MediaClient, createMediaClient } from "@shared/media/media-client";
import { useMediaPanel } from "@shared/media/use-media-panel";

import { HotspotDraft, changeConfig } from "../hotspot-draft";
import { MenuTreeLoader } from "../menu/use-menu-tree";
import canvasCss from "../styles/editor-canvas.scss";
import { EditorMedia, EditorMediaContext } from "./editor-media";
import { PageLoader } from "./link-field";
import { ManualEditor } from "./manual-editor";
import { MenuEditor } from "./menu-editor";
import { ConfigUpdate } from "./mode-props";

export { HotspotEditorHelp } from "./hotspot-editor-help";

export interface HotspotEditorProps extends Pick<FieldModalContentProps<HotspotDraft>, "value" | "onChange"> {
  /** Vorgabe ist ein Client auf dieselbe Herkunft; für Tests austauschbar. */
  mediaClient?: MediaClient;
  /** Nur für Tests. */
  loadTree?: MenuTreeLoader;
  /** Nur für Tests. */
  loadPages?: PageLoader;
}

/**
 * Ändert die Konfiguration über den jüngsten Entwurf. Rückrufe, die die
 * Mediathek-Leiste beim Öffnen festhält, sähen sonst einen alten Stand und
 * schrieben ihn zurück.
 */
function useConfigUpdate(value: HotspotDraft, onChange: (draft: HotspotDraft) => void): ConfigUpdate {
  const latest = useRef(value);
  useLayoutEffect(() => {
    latest.current = value;
  }, [value]);
  return useCallback(
    (change) => {
      const next = changeConfig(latest.current, change(latest.current.config));
      latest.current = next;
      onChange(next);
    },
    [onChange],
  );
}

export function HotspotEditor({ value, onChange, mediaClient, loadTree, loadPages }: HotspotEditorProps): ReactElement {
  const css = useHotStyle(canvasCss, "hotspot-image-widget", "styles/editor-canvas.scss");
  const client = useMemo(() => mediaClient ?? createMediaClient(), [mediaClient]);
  const panel = useMediaPanel(client);
  const { openMedia } = panel;
  const media = useMemo<EditorMedia>(
    () => ({ client, pick: (title, onPick) => openMedia({ title, onSelect: onPick }) }),
    [client, openMedia],
  );
  const update = useConfigUpdate(value, onChange);
  const modeProps = {
    config: value.config,
    inherited: value.inherited,
    update,
    onSourceChange: (source: HotspotDraft["config"]["source"]) => update((current) => ({ ...current, source })),
  };

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col" data-testid="hotspot-editor">
      <style>{css}</style>
      <EditorMediaContext.Provider value={media}>
        {value.config.source === "manual" ? (
          <ManualEditor {...modeProps} loadPages={loadPages} />
        ) : (
          <MenuEditor {...modeProps} loadTree={loadTree} />
        )}
      </EditorMediaContext.Provider>
      {panel.overlay}
    </div>
  );
}
