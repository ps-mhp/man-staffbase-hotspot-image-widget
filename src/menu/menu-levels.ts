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
 * Welche Ebene welches Bild und welche Punkte zeigt.
 *
 * Eine Ebene ist ein Eintrag mit Unterpunkten; auf ihrem Bild liegen die
 * Punkte ihrer direkten Unterpunkte. Hat eine Ebene kein eigenes Bild, bleibt
 * das der nächsthöheren Ebene samt deren Punkten stehen (Vorgabe 09.11.2026).
 * Oben steht das Bild aus dem Attribut `image`.
 */

import { MenuTree, MenuTreeNode } from "@shared/staffbase/menu-tree";

import { MenuHotspotPoint, MenuLayout, levelLayout } from "../menu-points-model";
import { HotspotImage } from "../points-model";

export interface ImageLevel {
  levelId: string;
  image: HotspotImage;
}

export interface PlacedPoint {
  point: MenuHotspotPoint;
  node: MenuTreeNode;
}

export interface OrphanPoint {
  levelId: string;
  point: MenuHotspotPoint;
}

/** Die gezeigte Ebene: das Ende des Pfads, oben der Startknoten. */
export function shownLevelId(tree: MenuTree, trail: readonly string[]): string {
  return trail.length > 0 ? trail[trail.length - 1] : tree.root.entry.id;
}

/** Der Pfad, auf dem dieser Eintrag die gezeigte Ebene ist; `null`, wenn er nicht im Baum steht. */
export function trailOf(tree: MenuTree, entryId: string): string[] | null {
  return tree.index.get(entryId)?.path.slice(1) ?? null;
}

/** Das Bild für die gezeigte Ebene: ihr eigenes oder das der nächsthöheren mit Bild. */
export function imageLevelFor(
  tree: MenuTree,
  levelId: string,
  rootImage: HotspotImage | null,
  layout: MenuLayout,
): ImageLevel | null {
  const path = tree.index.get(levelId)?.path ?? [tree.root.entry.id];
  for (const id of [...path].reverse()) {
    const image = id === tree.root.entry.id ? rootImage : (levelLayout(layout, id).image ?? null);
    if (image !== null) return { levelId: id, image };
  }
  return null;
}

/** Ob der Eintrag im Baum direkt unter dieser Ebene steht. */
function isChildOf(tree: MenuTree, menuId: string, levelId: string): boolean {
  const path = tree.index.get(menuId)?.path;
  return path !== undefined && path.length >= 2 && path[path.length - 2] === levelId;
}

/** Die Punkte einer Ebene, deren Eintrag im Baum direkt unter ihr steht. */
export function levelPoints(tree: MenuTree, layout: MenuLayout, levelId: string): PlacedPoint[] {
  return levelLayout(layout, levelId).points.flatMap((point) => {
    const location = tree.index.get(point.menuId);
    return location !== undefined && isChildOf(tree, point.menuId, levelId) ? [{ point, node: location.node }] : [];
  });
}

/** Alle gespeicherten Punkte, die nirgends gezeigt würden — gelöscht, verschoben, zu tief. */
export function orphanPoints(tree: MenuTree, layout: MenuLayout): OrphanPoint[] {
  return Object.entries(layout).flatMap(([levelId, level]) =>
    level.points.filter((point) => !isChildOf(tree, point.menuId, levelId)).map((point) => ({ levelId, point })),
  );
}

/** Jede Ebene des Baums — jeder Eintrag mit Unterpunkten — in Menüreihenfolge, mit Tiefe ab 0. */
export function levelNodes(tree: MenuTree): Array<{ node: MenuTreeNode; depth: number }> {
  const walk = (node: MenuTreeNode, depth: number): Array<{ node: MenuTreeNode; depth: number }> =>
    node.children.length === 0 ? [] : [{ node, depth }, ...node.children.flatMap((child) => walk(child, depth + 1))];
  return walk(tree.root, 0);
}
