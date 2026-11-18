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
 * Was die Liste und die Aktionen des manuellen Modus mit den Punkten tun –
 * rein und unveränderlich, damit es ohne Oberfläche prüfbar ist.
 */

import { HotspotLink, HotspotPoint, MAX_POINTS, clampPercent, newPointId } from "../points-model";

/** Abstand in Prozent, ab dem ein neuer Punkt nicht mehr auf einem alten liegt. */
const NEAR = 3;
/** Schritt, um den „Neuer Punkt“ ausweicht, wenn die Mitte belegt ist. */
const STEP = 6;

const near = (point: HotspotPoint, x: number, y: number): boolean =>
  Math.abs(point.x - x) < NEAR && Math.abs(point.y - y) < NEAR;

/** Wohin „Neuer Punkt“ ohne Klick ins Bild setzt: die Mitte, sonst schräg daneben. */
export function freeSpot(points: readonly HotspotPoint[]): { x: number; y: number } {
  for (let step = 0; step < 8; step += 1) {
    const x = clampPercent(50 + step * STEP);
    const y = clampPercent(50 + step * STEP);
    if (!points.some((point) => near(point, x, y))) return { x, y };
  }
  return { x: 50, y: 50 };
}

/** Tauscht einen Punkt mit seinem Nachbarn; die Reihenfolge bestimmt die Nummern. */
export function movePoint(points: readonly HotspotPoint[], id: string, offset: 1 | -1): HotspotPoint[] {
  const index = points.findIndex((point) => point.id === id);
  const other = index + offset;
  if (index === -1 || other < 0 || other >= points.length) return [...points];
  const next = [...points];
  next[index] = points[other];
  next[other] = points[index];
  return next;
}

/** Die Punkte in der Reihenfolge dieser Kennungen; unbekannte fallen weg, fehlende bleiben hinten. */
export function reorderPoints(points: readonly HotspotPoint[], ids: readonly string[]): HotspotPoint[] {
  const byId = new Map(points.map((point) => [point.id, point]));
  const ordered = ids.flatMap((id) => {
    const point = byId.get(id);
    return point === undefined ? [] : [point];
  });
  return [...ordered, ...points.filter((point) => !ids.includes(point.id))];
}

/** Eine Kopie gleich hinter dem Punkt, leicht versetzt; `null` an der Höchstzahl. */
export function duplicatePoint(points: readonly HotspotPoint[], id: string): { points: HotspotPoint[]; copy: HotspotPoint } | null {
  const index = points.findIndex((point) => point.id === id);
  if (index === -1 || points.length >= MAX_POINTS) return null;
  const original = points[index];
  const copy: HotspotPoint = {
    ...original,
    id: newPointId(),
    x: clampPercent(original.x + NEAR),
    y: clampPercent(original.y + NEAR),
  };
  return { points: [...points.slice(0, index + 1), copy, ...points.slice(index + 1)], copy };
}

/** Die Unterzeile in der Liste: wohin der Punkt führt. */
export function linkSummary(link: HotspotLink | undefined): string {
  if (link === undefined || link.href.trim() === "") return "ohne Link";
  if (link.kind === "url") {
    try {
      return `Adresse: ${new URL(link.href).host}`;
    } catch {
      return `Adresse: ${link.href}`;
    }
  }
  return link.title === undefined || link.title === "" ? "Seite" : `Seite: ${link.title}`;
}
