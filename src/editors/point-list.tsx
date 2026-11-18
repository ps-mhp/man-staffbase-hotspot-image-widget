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
 * Die Punkte des manuellen Modus in der Seitenleiste: Griff, rote Nummer wie
 * auf dem Bild, Titel und wohin der Punkt führt. Sortierbar per Ziehen und
 * Tastatur (react-aria), die Reihenfolge ist die Nummerierung.
 *
 * Gebaut aus den Teilen von `ItemList` (`item-parts`, `reorderIds`):
 * `ItemList` selbst kennt nur ein Vorschaubild von 56 × 36 px, keine Nummer
 * im Kreis wie im Screen. Leer gewählt heisst: rechts steht das Bild.
 */

import * as React from "react";
import { ReactElement } from "react";
import { GridList, GridListItem, useDragAndDrop } from "react-aria-components";
import {
  DragHandle,
  EmptyState,
  ItemText,
  firstKey,
  renderDropLine,
  rowClassName,
} from "@man/config-ui/sidebar/item-parts";
import { reorderIds } from "@man/config-ui/sidebar/reorder";

import { isUntitled } from "../editor-rules";
import { HotspotPoint } from "../points-model";
import { linkSummary } from "./manual-points";

export interface PointListProps {
  points: readonly HotspotPoint[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReorder: (ids: string[]) => void;
  /** Ob Punkte ohne Titel schon als Fehler erscheinen (nach gescheitertem „Übernehmen“). */
  issuesVisible: boolean;
}

const EMPTY = "Noch keine Punkte. Ein Klick ins Bild setzt den ersten.";

export function PointList({ points, selectedId, onSelect, onReorder, issuesVisible }: PointListProps): ReactElement {
  const items = points.map((point, index) => ({ point, index }));
  const { dragAndDropHooks } = useDragAndDrop<{ point: HotspotPoint; index: number }>({
    getItems: (keys) => Array.from(keys, (key) => ({ "text/plain": String(key) })),
    onReorder: (event) => {
      const ids = points.map((point) => point.id);
      const position = event.target.dropPosition === "before" ? "before" : "after";
      const next = reorderIds(ids, Array.from(event.keys, String), String(event.target.key), position);
      // Ein Zug ohne Wirkung wäre ein leerer Schritt in „Rückgängig“.
      if (next.some((id, index) => id !== ids[index])) onReorder(next);
    },
    renderDropIndicator: renderDropLine,
  });

  return (
    <GridList
      aria-label="Punkte"
      items={items}
      selectionMode="single"
      selectedKeys={selectedId === null ? [] : [selectedId]}
      onSelectionChange={(keys) => {
        const next = firstKey(keys);
        if (next !== undefined && next !== selectedId) onSelect(String(next));
      }}
      dragAndDropHooks={dragAndDropHooks}
      renderEmptyState={() => <EmptyState>{EMPTY}</EmptyState>}
      className="flex flex-col gap-1 outline-none"
      data-testid="point-list"
    >
      {({ point, index }) => {
        const invalid = issuesVisible && isUntitled(point);
        return (
          <GridListItem
            id={point.id}
            textValue={point.title === "" ? `Punkt ${index + 1}` : point.title}
            className={rowClassName}
            data-testid={`point-row-${point.id}`}
          >
            <DragHandle />
            <span
              aria-hidden="true"
              className="grid size-7 shrink-0 place-items-center rounded-full bg-brand text-xs font-semibold text-white"
            >
              {index + 1}
            </span>
            <ItemText
              label={point.title.trim() === "" ? "Ohne Titel" : point.title}
              description={invalid ? "Titel fehlt" : linkSummary(point.link)}
              invalid={invalid}
            />
          </GridListItem>
        );
      }}
    </GridList>
  );
}
