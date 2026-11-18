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
 * Was der Konfigurationsdialog zeigt: ein Vollbild-Fenster im gemeinsamen
 * Rahmen von `@man/config-ui` am Feld `config`, die einzelnen Felder älterer
 * Fassungen ausgeblendet.
 *
 * Steht in `config` noch nicht alles, beginnt das Fenster je Schlüssel mit
 * dem, was das alte Feld des eigenen Dialogs trägt (`hotspot-draft.ts`).
 * Erst „Übernehmen“ schreibt nach `config`; bis dahin gilt für die Seite
 * weiter, was in den alten Feldern steht.
 *
 * Der Editor kommt erst, wenn ein Dialog ihn zeigt: er baut auf
 * `@man/config-ui` (Radix, react-aria, Tailwind) und bringt Mediathek,
 * Menübaum und Vorschau mit – nichts davon gehört ins Seitenbündel, das jede
 * Leserin lädt. Hier bleiben nur Prüfung, Status und das Lesen der alten
 * Felder.
 */

import * as React from "react";
import { MapPin } from "lucide-react";

import { FieldModalShellOptions, startFieldModalInjector } from "@shared/config-modal";

import { CONFIG_ATTRIBUTE, LEGACY_ATTRIBUTES } from "./configuration-schema";
import { hotspotChangesStatus, validateHotspotDraft } from "./editor-rules";
import { HotspotDraft, parseDraft, serializeDraft } from "./hotspot-draft";
import { readLegacyFromDialog, startHiddenFields } from "./legacy-fields";

const loadEditor = () => import("./editors/hotspot-editor");

const LazyHotspotEditor = React.lazy(() => loadEditor().then((module) => ({ default: module.HotspotEditor })));

/** Die Hilfe aus demselben Chunk wie der Editor; ihr Text gehört nicht ins Seitenbündel. */
const LazyHotspotEditorHelp = React.lazy(() =>
  loadEditor().then((module) => ({ default: module.HotspotEditorHelp })),
);

const LOADING = <p className="p-6 text-sm text-muted-foreground">Editor wird geladen …</p>;

/** Was der gemeinsame Rahmen vom Bild mit Punkten wissen muss. Offengelegt für Tests. */
export const hotspotEditorShell: FieldModalShellOptions<HotspotDraft> = {
  widgetName: "Bild mit Punkten",
  title: "Punkte setzen",
  icon: MapPin,
  preview: true,
  help: (
    <React.Suspense fallback={null}>
      <LazyHotspotEditorHelp />
    </React.Suspense>
  ),
  statusText: hotspotChangesStatus,
  validate: validateHotspotDraft,
};

/**
 * Wartet auf den Konfigurationsdialog des Widgets, setzt das Fenster an die
 * Stelle von `config` und blendet die alten Felder aus – beides nur im
 * eigenen Dialog.
 *
 * @param root der zu beobachtende Teilbaum; standardmäßig das Dokument.
 * Offengelegt, damit Tests den Beobachter auf einen Container begrenzen.
 * @returns eine Funktion, die die Beobachtung beendet und alles abbaut.
 */
export function startHotspotDialog(root: ParentNode = document): () => void {
  const stopModal = startFieldModalInjector<HotspotDraft>({
    fieldKey: CONFIG_ATTRIBUTE,
    root,
    reopenLabel: "Bild mit Punkten bearbeiten",
    modalTestId: "hotspot-editor-modal",
    reopenTestId: "hotspot-editor-reopen",
    parse: (raw) => parseDraft(raw, readLegacyFromDialog(root)),
    serialize: serializeDraft,
    shell: hotspotEditorShell,
    render: ({ value, onChange }) => (
      <React.Suspense fallback={LOADING}>
        <LazyHotspotEditor value={value} onChange={onChange} />
      </React.Suspense>
    ),
  });
  const stopHiding = startHiddenFields(LEGACY_ATTRIBUTES, CONFIG_ATTRIBUTE, root);
  return () => {
    stopModal();
    stopHiding();
  };
}
