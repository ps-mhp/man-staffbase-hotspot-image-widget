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
 * Das Panel rechts für einen gewählten Menüeintrag: wo sein Punkt liegt
 * (bzw. dass ein Klick ins Bild ihn setzt), seine Farbe, sein Icon, „Punkt entfernen“ –
 * und für einen Eintrag mit Unterpunkten der Weg zu seiner eigenen Ebene.
 * Dazu das Panel für einen Punkt, dessen Eintrag nicht mehr im Menü steht.
 */

import * as React from "react";
import { ReactElement } from "react";
import { InspectorPanel } from "@man/config-ui/inspector/inspector-panel";
import { ItemActions } from "@man/config-ui/sidebar/item-actions";
import { Button } from "@man/config-ui/primitives/button";
import { PickedMedia } from "@shared/media/media-picker";

import { MenuHotspotPoint } from "../menu-points-model";
import { PointIcon } from "../point-icon";
import { PointColorField } from "./point-color-field";
import { PointIconField } from "./point-icon-field";

export const MENU_POINT_MESSAGES = {
  place: (title: string, level: string): string => `Ein Klick ins Bild der Ebene „${level}“ setzt den Punkt für „${title}“.`,
  move: (title: string): string => `„${title}“ liegt auf dem Bild. Ziehen verschiebt den Punkt, ein Klick ins Bild setzt ihn neu.`,
  needsImage: (level: string): string => `Die Ebene „${level}“ hat kein eigenes Bild. Wähle zuerst eines – im Panel „Menü“ oder über „Bild wählen“.`,
  openLevel: (title: string): string => `Ebene „${title}“ öffnen`,
  iconAside: "statt des Punkts",
  orphan:
    "Dieser Punkt gehört zu einem Eintrag, der im Menü fehlt, verschoben wurde oder tiefer liegt als eingestellt. Er wird nicht angezeigt. Ein Menü, das gerade nicht lädt, sähe genauso aus – deshalb wird er nie von selbst entfernt.",
} as const;

const HINT = "text-[13px] leading-normal text-muted-foreground";

export interface MenuPointPanelProps {
  title: string;
  levelTitle: string;
  /** Ob die Ebene ein eigenes Bild hat, auf das der Punkt kann. */
  levelHasImage: boolean;
  point: MenuHotspotPoint | null;
  /** Die Farbe aller Punkte – was gilt, solange der Punkt keine eigene hat. */
  globalColor: string | null;
  onColorChange: (color: string | undefined) => void;
  onIconChange: (icon: PointIcon | undefined) => void;
  onIconPick: (picked: PickedMedia) => void;
  onRemove: () => void;
  /** Für einen Eintrag mit Unterpunkten: seine eigene Ebene zeigen. */
  onOpenLevel?: () => void;
}

export function MenuPointPanel({
  title,
  levelTitle,
  levelHasImage,
  point,
  globalColor,
  onColorChange,
  onIconChange,
  onIconPick,
  onRemove,
  onOpenLevel,
}: MenuPointPanelProps): ReactElement {
  const status = !levelHasImage
    ? MENU_POINT_MESSAGES.needsImage(levelTitle)
    : point === null
      ? MENU_POINT_MESSAGES.place(title, levelTitle)
      : MENU_POINT_MESSAGES.move(title);
  return (
    <InspectorPanel
      title={title}
      actions={point === null ? undefined : <ItemActions noun="Punkt" onDelete={onRemove} />}
    >
      <div className="flex flex-col gap-6" data-testid="menu-point-panel">
        <p className={HINT} data-testid="menu-point-status">
          {status}
        </p>
        {point !== null && <PointColorField color={point.color} global={globalColor} onChange={onColorChange} />}
        {point !== null && (
          <PointIconField
            icon={point.icon}
            aside={MENU_POINT_MESSAGES.iconAside}
            mediaTitle={`Icon für „${title}“`}
            onChange={onIconChange}
            onPick={onIconPick}
          />
        )}
        {onOpenLevel !== undefined && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="self-start"
            data-testid="menu-point-open-level"
            onClick={onOpenLevel}
          >
            {MENU_POINT_MESSAGES.openLevel(title)}
          </Button>
        )}
      </div>
    </InspectorPanel>
  );
}

export function OrphanPanel({ title, onRemove }: { title: string; onRemove: () => void }): ReactElement {
  return (
    <InspectorPanel title={title} actions={<ItemActions noun="Punkt" onDelete={onRemove} />}>
      <p className={HINT} data-testid="orphan-panel">
        {MENU_POINT_MESSAGES.orphan}
      </p>
    </InspectorPanel>
  );
}
