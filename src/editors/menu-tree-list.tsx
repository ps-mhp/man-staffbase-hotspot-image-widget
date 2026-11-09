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
 * Der Menübaum im Editor: alle Einträge bis zur Tiefe, eingerückt.
 *
 * Anders als in der Leseansicht wird hier nicht geblättert: wer Punkte setzt,
 * will den ganzen Baum auf einmal sehen und erkennen, was schon liegt.
 */

import * as React from "react";
import { ReactElement } from "react";

import { MenuTreeNode } from "@shared/staffbase/menu-tree";

/** So viel rückt jede Ebene ein. */
const INDENT_PX = 16;

export const PLACED_LABEL = "auf dem Bild";

export interface MenuTreeListProps {
  root: MenuTreeNode;
  placed: ReadonlySet<string>;
  selectedId: string | null;
  onSelect: (menuId: string) => void;
}

function flatten(node: MenuTreeNode, depth: number): Array<{ node: MenuTreeNode; depth: number }> {
  return [{ node, depth }, ...node.children.flatMap((child) => flatten(child, depth + 1))];
}

export function MenuTreeList({ root, placed, selectedId, onSelect }: MenuTreeListProps): ReactElement {
  return (
    <ul className="man-hie__list man-hie__tree" data-testid="menu-tree-list">
      {flatten(root, 0).map(({ node, depth }) => {
        const { id, title } = node.entry;
        const selected = id === selectedId;
        const isPlaced = placed.has(id);
        return (
          <li key={id}>
            <button
              type="button"
              className={`man-hie__list-item${selected ? " man-hie__list-item--active" : ""}`}
              style={{ paddingInlineStart: `${8 + depth * INDENT_PX}px` }}
              aria-current={selected ? "true" : undefined}
              data-testid={`menu-tree-item-${id}`}
              onClick={() => onSelect(id)}
            >
              <span
                className={`man-hie__tree-dot${isPlaced ? " man-hie__tree-dot--placed" : ""}`}
                aria-hidden="true"
              />
              <span className="man-hie__tree-title">{title}</span>
              {isPlaced && <span className="man-hie__tree-badge">{PLACED_LABEL}</span>}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
