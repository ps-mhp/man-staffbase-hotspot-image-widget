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
 * Der Menübaum als Knoten der Seitenleiste (`ItemTree`): jeder Eintrag mit
 * seinem Stand – ob sein Punkt auf der Ebene darüber liegt, ob seine eigene
 * Ebene ein Bild hat und wie viele Punkte –, dazu die Punkte, deren Eintrag
 * nicht mehr im Menü steht, als Fehler unter ihrer Ebene.
 *
 * Rein, damit es ohne Oberfläche prüfbar ist.
 */

import type { TreeNode } from "@man/config-ui/sidebar/reorder";
import { MenuTree, MenuTreeNode } from "@shared/staffbase/menu-tree";

import { MenuHotspotPoint, MenuLayout, levelLayout } from "../menu-points-model";
import { OrphanPoint, levelPoints, orphanPoints } from "../menu/menu-levels";
import { HotspotImage } from "../points-model";

const ORPHAN_PREFIX = "orphan:";

/** Die Kennung eines verwaisten Punkts im Baum. */
export const orphanKey = (levelId: string, pointId: string): string => `${ORPHAN_PREFIX}${levelId}:${pointId}`;

/** Ebene und Punkt aus einer Kennung von {@link orphanKey}; `null` für einen Menüeintrag. */
export function parseOrphanKey(key: string): { levelId: string; pointId: string } | null {
  if (!key.startsWith(ORPHAN_PREFIX)) return null;
  const [levelId, pointId] = key.slice(ORPHAN_PREFIX.length).split(":");
  return levelId === undefined || pointId === undefined ? null : { levelId, pointId };
}

/** Der Eintrag darüber; der Startknoten hat keinen. */
export function parentOf(tree: MenuTree, id: string): string | null {
  const path = tree.index.get(id)?.path;
  return path === undefined || path.length < 2 ? null : path[path.length - 2];
}

/** Ob ein Eintrag eine eigene Ebene ist: der Startknoten und jeder mit Unterpunkten. */
export function isLevel(tree: MenuTree, id: string): boolean {
  const node = tree.index.get(id)?.node;
  return node !== undefined && (id === tree.root.entry.id || node.children.length > 0);
}

/** Das eigene Bild einer Ebene – oben das der Konfiguration. */
export function ownLevelImage(tree: MenuTree, layout: MenuLayout, rootImage: HotspotImage | null, levelId: string): HotspotImage | null {
  return levelId === tree.root.entry.id ? rootImage : (levelLayout(layout, levelId).image ?? null);
}

/** Der Punkt eines Eintrags auf der Ebene darüber, falls gesetzt. */
export function pointOf(tree: MenuTree, layout: MenuLayout, menuId: string): MenuHotspotPoint | null {
  const parent = parentOf(tree, menuId);
  if (parent === null) return null;
  return levelLayout(layout, parent).points.find((point) => point.menuId === menuId) ?? null;
}

/** Der Name eines verwaisten Punkts: der Eintrag, falls er anderswo im Baum steht. */
export function orphanTitle(tree: MenuTree, point: MenuHotspotPoint): string {
  return tree.index.get(point.menuId)?.node.entry.title ?? "Unbekannter Menüpunkt";
}

const countText = (count: number): string => (count === 1 ? "1 Punkt" : `${count} Punkte`);

function levelText(tree: MenuTree, layout: MenuLayout, rootImage: HotspotImage | null, id: string): string {
  const count = levelPoints(tree, layout, id).length;
  if (ownLevelImage(tree, layout, rootImage, id) !== null) return `Bild + ${countText(count)}`;
  return id === tree.root.entry.id ? "noch kein Bild" : "Bild der Ebene darüber";
}

function describe(tree: MenuTree, layout: MenuLayout, rootImage: HotspotImage | null, node: MenuTreeNode): string {
  const id = node.entry.id;
  if (id === tree.root.entry.id) return `Startpunkt · ${levelText(tree, layout, rootImage, id)}`;
  const point = pointOf(tree, layout, id) === null ? "kein Punkt" : "Punkt gesetzt";
  return node.children.length === 0 ? point : `${point} · ${levelText(tree, layout, rootImage, id)}`;
}

function orphanNode(tree: MenuTree, { levelId, point }: OrphanPoint): TreeNode {
  return {
    id: orphanKey(levelId, point.id),
    label: orphanTitle(tree, point),
    description: "Nicht mehr im Menü",
    invalid: true,
  };
}

/** Der Baum für die Seitenleiste; der Startknoten ist der einzige oberste Knoten. */
export function menuTreeNodes(tree: MenuTree, layout: MenuLayout, rootImage: HotspotImage | null): TreeNode[] {
  const rootId = tree.root.entry.id;
  const orphans = orphanPoints(tree, layout);
  // Verwaiste Punkte stehen unter ihrer Ebene – oder oben, wenn auch die nicht mehr im Baum ist.
  const orphansOf = (id: string): OrphanPoint[] =>
    orphans.filter(({ levelId }) => (tree.index.has(levelId) ? levelId === id : id === rootId));

  const build = (node: MenuTreeNode): TreeNode => {
    const children = [...node.children.map(build), ...orphansOf(node.entry.id).map((orphan) => orphanNode(tree, orphan))];
    return {
      id: node.entry.id,
      label: node.entry.title,
      description: describe(tree, layout, rootImage, node),
      ...(children.length === 0 ? {} : { children }),
    };
  };
  return [build(tree.root)];
}

/** Die Kennungen aller Knoten mit Kindern – zum Aufklappen beim Öffnen. */
export function expandableIds(nodes: readonly TreeNode[]): string[] {
  return nodes.flatMap((node) => (node.children === undefined ? [] : [node.id, ...expandableIds(node.children)]));
}

/** „Fahrerhaus › Fahrerarbeitsplatz“: der Weg vom Startknoten zur Ebene. */
export function trailTitle(tree: MenuTree, levelId: string): string {
  const path = tree.index.get(levelId)?.path ?? [tree.root.entry.id];
  return path.map((id) => tree.index.get(id)?.node.entry.title ?? id).join(" › ");
}
