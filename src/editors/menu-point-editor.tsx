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
 * Der Editor des Modus „Menü“: Menüpunkte auf dem Bild platzieren.
 *
 * Rechts der Menübaum ab dem gewählten Startpunkt, links das Bild. Eine Zeile
 * wählen, dann ins Bild klicken: das setzt den Punkt dieses Eintrags oder
 * versetzt ihn. Startpunkt und Tiefe stehen in anderen Feldern des Dialogs;
 * sie werden beim Öffnen gelesen, nach einer Änderung öffnet man neu.
 *
 * Punkte, deren Eintrag nicht im Baum steht, werden nie von selbst entfernt:
 * ein Menü, das gerade nicht lädt, sähe genauso aus wie ein gelöschter Eintrag.
 */

import * as React from "react";
import { ReactElement, useState } from "react";

import { FieldModalContentProps } from "@shared/config-modal";
import { useHotStyle } from "@shared/hot-style";
import { readMenuId } from "@shared/staffbase/menu";
import { MenuTree } from "@shared/staffbase/menu-tree";

import { MENU_DEPTH_ATTRIBUTE, MENU_ID_ATTRIBUTE } from "../configuration-schema";
import { MenuHotspotPoint, readMenuDepth } from "../menu-points-model";
import { MenuTreeLoader, useMenuTree } from "../menu/use-menu-tree";
import { HotspotPoint, MAX_POINTS, clampPercent, newPointId } from "../points-model";
import pointEditorCss from "../styles/point-editor.scss";
import { readConfigValue } from "./config-values";
import { EditorImageField, useEditorImage } from "./editor-image";
import { MenuTreeList } from "./menu-tree-list";
import { PlacementCanvas } from "./placement-canvas";

export const MENU_EDITOR_MESSAGES = {
  noStart: "Wähle zuerst im Formular einen Startpunkt im Menü und öffne dieses Fenster dann erneut.",
  needsImage: "Ohne Bild gibt es keine Fläche, auf der Punkte liegen könnten.",
  loading: "Menü wird geladen …",
  failed: "Das Menü konnte nicht geladen werden.",
  retry: "Erneut versuchen",
  pickFirst: "Wähle rechts einen Menüpunkt; ein Klick ins Bild setzt dann seinen Punkt.",
  full: `Mehr als ${MAX_POINTS} Punkte trägt ein Bild nicht.`,
  fullWithOrphans: (count: number): string =>
    `Mehr als ${MAX_POINTS} Punkte trägt ein Bild nicht. ${count} davon gehören zu Einträgen, die nicht mehr im Menü stehen — unten lassen sie sich entfernen.`,
  remaining: (count: number): string => `Noch ${count} von ${MAX_POINTS} Punkten frei.`,
  orphans: "Nicht mehr im Menü",
  orphansHint: "Diese Punkte gehören zu Einträgen, die im Menü fehlen oder tiefer liegen als eingestellt.",
  remove: "Punkt entfernen",
  removeOrphan: "Entfernen",
  place: (title: string): string => `Ein Klick ins Bild setzt den Punkt für „${title}“.`,
  move: (title: string): string =>
    `„${title}“ liegt auf dem Bild. Ziehen verschiebt den Punkt, ein Klick ins Bild setzt ihn neu.`,
} as const;

export interface MenuPointEditorProps extends FieldModalContentProps<MenuHotspotPoint[]> {
  /** Nur für Tests. */
  loadTree?: MenuTreeLoader;
}

export function MenuPointEditor({ value, onChange, onSave, onClose, loadTree }: MenuPointEditorProps): ReactElement {
  const css = useHotStyle(pointEditorCss, "hotspot-image-widget", "styles/point-editor.scss");
  const editorImage = useEditorImage();
  const [rootId] = useState(() => readMenuId(readConfigValue(MENU_ID_ATTRIBUTE)));
  const [depth] = useState(() => readMenuDepth(readConfigValue(MENU_DEPTH_ATTRIBUTE)));
  const state = useMenuTree(rootId, depth, loadTree);

  return (
    <div className="man-hie">
      <style>{css}</style>
      {state.status === "ready" ? (
        <Placement
          tree={state.tree}
          value={value}
          onChange={onChange}
          left={<EditorImageField editorImage={editorImage} />}
          image={editorImage.image}
        />
      ) : (
        <div className="man-hie__layout">
          <div className="man-hie__left">
            <EditorImageField editorImage={editorImage} />
          </div>
          <div className="man-hie__right">
            <TreeStatus state={state} />
          </div>
        </div>
      )}
      <div className="man-hie__footer">
        <button type="button" className="man-hie__button" onClick={onClose}>
          Abbrechen
        </button>
        <button type="button" className="man-hie__button man-hie__button--primary" onClick={onSave}>
          Übernehmen
        </button>
      </div>
    </div>
  );
}

function TreeStatus({ state }: { state: ReturnType<typeof useMenuTree> }): ReactElement {
  if (state.status === "error") {
    return (
      <div className="man-hie__hint" role="alert" data-testid="menu-editor-failed">
        <p>{MENU_EDITOR_MESSAGES.failed}</p>
        <button type="button" className="man-hie__button" onClick={state.retry}>
          {MENU_EDITOR_MESSAGES.retry}
        </button>
      </div>
    );
  }
  if (state.status === "loading") {
    return (
      <p className="man-hie__hint" role="status">
        {MENU_EDITOR_MESSAGES.loading}
      </p>
    );
  }
  return (
    <p className="man-hie__hint" data-testid="menu-editor-no-start">
      {MENU_EDITOR_MESSAGES.noStart}
    </p>
  );
}

interface PlacementProps {
  tree: MenuTree;
  value: MenuHotspotPoint[];
  onChange: (value: MenuHotspotPoint[]) => void;
  left: React.ReactNode;
  image: ReturnType<typeof useEditorImage>["image"];
}

function Placement({ tree, value, onChange, left, image }: PlacementProps): ReactElement {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [full, setFull] = useState(false);

  const selectedEntry = selectedId === null ? null : (tree.index.get(selectedId)?.node.entry ?? null);
  const selectedPoint = value.find((point) => point.menuId === selectedId) ?? null;
  const orphans = value.filter((point) => !tree.index.has(point.menuId));

  // Die Platzierungsfläche kennt Punkte mit Titel; der Titel kommt aus dem Baum.
  const canvasPoints: HotspotPoint[] = value.map((point) => ({
    id: point.id,
    x: point.x,
    y: point.y,
    title: tree.index.get(point.menuId)?.node.entry.title ?? MENU_EDITOR_MESSAGES.orphans,
  }));

  const onAdd = (x: number, y: number): void => {
    if (selectedId === null) return;
    if (selectedPoint !== null) {
      onChange(value.map((point) => (point === selectedPoint ? { ...point, x, y } : point)));
      return;
    }
    if (value.length >= MAX_POINTS) {
      setFull(true);
      return;
    }
    onChange([...value, { id: newPointId(), menuId: selectedId, x: clampPercent(x), y: clampPercent(y) }]);
  };

  const onMove = (pointId: string, x: number, y: number): void => {
    onChange(value.map((point) => (point.id === pointId ? { ...point, x, y } : point)));
  };

  const onSelectPoint = (pointId: string): void => {
    const point = value.find((candidate) => candidate.id === pointId);
    if (point !== undefined && tree.index.has(point.menuId)) setSelectedId(point.menuId);
  };

  const remove = (pointId: string): void => {
    onChange(value.filter((point) => point.id !== pointId));
    setFull(false);
  };

  return (
    <div className="man-hie__layout">
      <div className="man-hie__left">
        {left}
        {image === null ? (
          <p className="man-hie__hint" data-testid="menu-editor-needs-image">
            {MENU_EDITOR_MESSAGES.needsImage}
          </p>
        ) : (
          <>
            {full && (
              <p className="man-hie__hint" data-testid="menu-editor-full">
                {orphans.length > 0
                  ? MENU_EDITOR_MESSAGES.fullWithOrphans(orphans.length)
                  : MENU_EDITOR_MESSAGES.full}
              </p>
            )}
            <PlacementCanvas
              image={image}
              points={canvasPoints}
              selectedId={selectedPoint?.id ?? null}
              onAdd={onAdd}
              onMove={onMove}
              onSelect={onSelectPoint}
              markerLabel={() => ""}
            />
            <p className="man-hie__hint" data-testid="menu-editor-remaining">
              {MENU_EDITOR_MESSAGES.remaining(MAX_POINTS - value.length)}
            </p>
          </>
        )}
      </div>
      <div className="man-hie__right">
        <MenuTreeList
          root={tree.root}
          placed={new Set(value.map((point) => point.menuId))}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <div className="man-hie__form" data-testid="menu-editor-selection">
          {selectedEntry === null ? (
            <p className="man-hie__hint">{MENU_EDITOR_MESSAGES.pickFirst}</p>
          ) : selectedPoint === null ? (
            <p className="man-hie__hint">{MENU_EDITOR_MESSAGES.place(selectedEntry.title)}</p>
          ) : (
            <>
              <p className="man-hie__hint">{MENU_EDITOR_MESSAGES.move(selectedEntry.title)}</p>
              <button type="button" className="man-hie__button" onClick={() => remove(selectedPoint.id)}>
                {MENU_EDITOR_MESSAGES.remove}
              </button>
            </>
          )}
        </div>
        {orphans.length > 0 && (
          <div className="man-hie__form" data-testid="menu-editor-orphans">
            <p className="man-hie__label">{MENU_EDITOR_MESSAGES.orphans}</p>
            <p className="man-hie__hint">{MENU_EDITOR_MESSAGES.orphansHint}</p>
            <ul className="man-hie__list">
              {orphans.map((point) => (
                <li key={point.id} className="man-hie__list-item">
                  <span className="man-hie__tree-title">{point.menuId}</span>
                  <button type="button" className="man-hie__button" onClick={() => remove(point.id)}>
                    {MENU_EDITOR_MESSAGES.removeOrphan}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
