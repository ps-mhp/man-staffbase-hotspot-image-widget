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
 * Was der Rahmen über den Entwurf wissen muss, bevor der Editor geladen ist:
 * ob er sich übernehmen lässt und was am Status steht. Liegt deshalb im
 * Seitenbündel und importiert nichts Schweres.
 */

import type { ValidationIssue } from "@man/config-ui/shell/shell-context";

import { ConfigKey } from "./hotspot-config";
import { HotspotDraft, changedKeys } from "./hotspot-draft";
import { HotspotPoint } from "./points-model";

/** Die Kennung eines Punkts in den Meldungen; so findet der Editor ihn wieder. */
export const pointIssueId = (pointId: string): string => `point:${pointId}`;

/** Ein Punkt ohne Titel überlebt das Speichern nicht: `readPoint` verwirft ihn samt Text und Link. */
export const isUntitled = (point: HotspotPoint): boolean => point.title.trim() === "";

/**
 * Punkte ohne Titel halten „Übernehmen“ auf – auch im Menü-Modus, denn die
 * Punkte des manuellen bleiben gespeichert und gingen sonst still verloren.
 */
export function validateHotspotDraft(draft: HotspotDraft): ValidationIssue[] {
  return draft.config.manual.points.flatMap((point, index) =>
    isUntitled(point)
      ? [{ id: pointIssueId(point.id), message: `Punkt ${index + 1}: Titel fehlt – ohne ihn ginge der Punkt verloren.` }]
      : [],
  );
}

const KEY_MESSAGES: Readonly<Record<Exclude<ConfigKey, "manual.points">, string>> = {
  source: "Modus geändert",
  image: "Bild geändert",
  "manual.mode": "Darstellung geändert",
  "menu.rootId": "Startpunkt geändert",
  "menu.depth": "Tiefe geändert",
  "menu.click": "Klickverhalten geändert",
  "menu.layout": "Menüpunkte geändert",
  color: "Farbe der Punkte geändert",
};

const sameJson = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);

/** „Punkt 2 geändert“, „3 Punkte geändert“ oder „Reihenfolge geändert“. */
export function pointsMessage(draft: readonly HotspotPoint[], saved: readonly HotspotPoint[]): string | undefined {
  const before = new Map(saved.map((point) => [point.id, point]));
  const after = new Set(draft.map((point) => point.id));
  const touched = draft.filter((point) => !sameJson(point, before.get(point.id)));
  const removed = saved.filter((point) => !after.has(point.id));
  const count = touched.length + removed.length;
  if (count === 0) {
    const reordered = draft.some((point, index) => saved[index]?.id !== point.id);
    return reordered ? "Reihenfolge geändert" : undefined;
  }
  if (count > 1) return `${count} Punkte geändert`;
  if (removed.length === 1) return "Punkt gelöscht";
  const index = draft.indexOf(touched[0]);
  return before.has(touched[0].id) ? `Punkt ${index + 1} geändert` : `Punkt ${index + 1} neu`;
}

/** Was am Status steht, solange etwas offen ist. */
export function hotspotChangesStatus(draft: HotspotDraft, saved: HotspotDraft): string | undefined {
  const messages = changedKeys(saved.config, draft.config).flatMap((key) => {
    if (key !== "manual.points") return [KEY_MESSAGES[key]];
    const message = pointsMessage(draft.config.manual.points, saved.config.manual.points);
    return message === undefined ? [] : [message];
  });
  if (messages.length === 0) return undefined;
  const more = messages.length - 1;
  return more === 0 ? messages[0] : `${messages[0]} · ${more} ${more === 1 ? "weitere Änderung" : "weitere Änderungen"}`;
}
