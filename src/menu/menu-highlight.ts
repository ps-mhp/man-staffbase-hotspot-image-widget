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
 * Wie Punkt und Menü einander zeigen.
 *
 * Das Menü neben dem Bild zeigt eine Ebene zur Zeit. Ein Punkt kann also für
 * einen Eintrag stehen, der gerade gar nicht als Zeile zu sehen ist. Statt
 * beim Überfahren zu blättern — die Liste spränge unter dem Zeiger hin und
 * her —, wird markiert, was auf der gezeigten Ebene für ihn steht.
 *
 * Der „Pfad“ des Menüs (`trail`) sind die IDs der Ebenen unterhalb des
 * Startknotens, in die geblättert wurde; leer heißt: oben.
 */

import { MenuTree, MenuTreeNode } from "@shared/staffbase/menu-tree";

/** Was im Menü für einen Eintrag markiert wird. */
export type MenuMark = { kind: "row"; id: string } | { kind: "header" };

const startsWith = (path: readonly string[], prefix: readonly string[]): boolean =>
  prefix.every((id, position) => path[position] === id);

/** Die IDs vom Startknoten bis zur gezeigten Ebene. */
const shownPath = (tree: MenuTree, trail: readonly string[]): string[] => [tree.root.entry.id, ...trail];

/**
 * Die Zeile des Eintrags oder seines Vorfahren auf der gezeigten Ebene; die
 * Kopfzeile, wenn er die Ebene selbst ist; sonst nichts. Ein Eintrag über der
 * Ebene markiert nichts: die Kopfzeile trägt dort einen anderen Namen.
 */
export function menuMarkFor(tree: MenuTree, entryId: string | null, trail: readonly string[]): MenuMark | null {
  if (entryId === null) return null;
  const location = tree.index.get(entryId);
  if (location === undefined) return null;
  const shown = shownPath(tree, trail);
  if (startsWith(location.path, shown) && location.path.length > shown.length) {
    return { kind: "row", id: location.path[shown.length] };
  }
  return location.path.length === shown.length && startsWith(shown, location.path) ? { kind: "header" } : null;
}

/** Der Eintrag und alle seine Nachfahren im Baum. */
export function subtreeIds(tree: MenuTree, entryId: string): Set<string> {
  const ids = new Set<string>();
  const walk = (node: MenuTreeNode): void => {
    ids.add(node.entry.id);
    node.children.forEach(walk);
  };
  const location = tree.index.get(entryId);
  if (location !== undefined) walk(location.node);
  return ids;
}
