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
 * Die Unterpunkte der gewählten Ebene im Editor — das, was sich auf ihrem
 * Bild platzieren lässt. Hat ein Unterpunkt selbst Unterpunkte, führt
 * „Ebene öffnen“ zu seinem eigenen Bild.
 */

import * as React from "react";
import { ReactElement } from "react";

import { MenuTreeNode } from "@shared/staffbase/menu-tree";

export const LEVEL_LIST_MESSAGES = {
  placed: "auf dem Bild",
  openLevel: (title: string): string => `Ebene „${title}“ öffnen`,
} as const;

export interface MenuLevelListProps {
  level: MenuTreeNode;
  placed: ReadonlySet<string>;
  selectedId: string | null;
  onSelect: (menuId: string) => void;
  onOpenLevel: (menuId: string) => void;
}

export function MenuLevelList({ level, placed, selectedId, onSelect, onOpenLevel }: MenuLevelListProps): ReactElement {
  return (
    <ul className="man-hie__list man-hie__tree" data-testid="menu-level-list">
      {level.children.map((child) => {
        const { id, title } = child.entry;
        const selected = id === selectedId;
        const isPlaced = placed.has(id);
        return (
          <li key={id} className="man-hie__tree-row">
            <button
              type="button"
              className={`man-hie__list-item${selected ? " man-hie__list-item--active" : ""}`}
              aria-current={selected ? "true" : undefined}
              data-testid={`menu-level-item-${id}`}
              onClick={() => onSelect(id)}
            >
              <span
                className={`man-hie__tree-dot${isPlaced ? " man-hie__tree-dot--placed" : ""}`}
                aria-hidden="true"
              />
              <span className="man-hie__tree-title">{title}</span>
              {isPlaced && <span className="man-hie__tree-badge">{LEVEL_LIST_MESSAGES.placed}</span>}
            </button>
            {child.children.length > 0 && (
              <button
                type="button"
                className="man-hie__tree-open"
                aria-label={LEVEL_LIST_MESSAGES.openLevel(title)}
                title={LEVEL_LIST_MESSAGES.openLevel(title)}
                onClick={() => onOpenLevel(id)}
              >
                ›
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
