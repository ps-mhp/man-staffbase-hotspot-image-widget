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
 * Der Modus „Menü“ im Fenster: Startpunkt, Tiefe und Klickverhalten oben,
 * darunter je Menüebene ein Bild und die Punkte ihrer Unterpunkte.
 *
 * Gesteuert von aussen (`hotspot-editor.tsx`). Wechselt der Startpunkt oder
 * die Tiefe, lädt der Baum neu — im selben Fenster, ohne es zu schliessen.
 *
 * Das Bild der Startebene ist das Bild der Konfiguration; die tieferen Ebenen
 * tragen ihr eigenes. Punkte, deren Eintrag nicht mehr unter ihrer Ebene
 * steht, werden nie von selbst entfernt: ein Menü, das gerade nicht lädt,
 * sähe genauso aus wie ein gelöschter Eintrag.
 */

import * as React from "react";
import { ReactElement, useState } from "react";

import { MenuTree } from "@shared/staffbase/menu-tree";

import { HotspotConfig } from "../hotspot-config";
import {
  MAX_MENU_DEPTH,
  MIN_MENU_DEPTH,
  MenuClickMode,
  MenuHotspotPoint,
  MenuLayout,
  levelLayout,
  withLevel,
} from "../menu-points-model";
import { levelNodes, orphanPoints } from "../menu/menu-levels";
import { MenuTreeLoader, useMenuTree } from "../menu/use-menu-tree";
import { HotspotImage, HotspotPoint, MAX_POINTS, clampPercent, newPointId } from "../points-model";
import { ImageField } from "./image-field";
import { MenuLevelList } from "./menu-level-list";
import { PlacementCanvas } from "./placement-canvas";
import { StartPointField } from "./start-point-field";

export const MENU_EDITOR_MESSAGES = {
  noStart: "Wähle oben einen Startpunkt im Menü.",
  loading: "Menü wird geladen …",
  failed: "Das Menü konnte nicht geladen werden.",
  retry: "Erneut versuchen",
  level: "Ebene",
  depth: "Ebenen",
  click: "Klick auf einen Punkt mit Unterpunkten",
  clickEnter: "Ins Untermenü wechseln",
  clickOpen: "Seite öffnen",
  inherits: "Diese Ebene hat kein eigenes Bild und zeigt das Bild der Ebene darüber. Wähle ein Bild, um hier Punkte zu setzen.",
  rootNeedsImage: "Ohne Bild gibt es keine Fläche, auf der Punkte liegen könnten.",
  pickFirst: "Wähle rechts einen Menüpunkt; ein Klick ins Bild setzt dann seinen Punkt.",
  full: `Mehr als ${MAX_POINTS} Punkte trägt eine Ebene nicht.`,
  remaining: (count: number): string => `Noch ${count} von ${MAX_POINTS} Punkten frei.`,
  orphans: "Nicht mehr im Menü",
  orphansHint:
    "Diese Punkte gehören zu Einträgen, die im Menü fehlen, verschoben wurden oder tiefer liegen als eingestellt.",
  remove: "Punkt entfernen",
  removeOrphan: "Entfernen",
  place: (title: string): string => `Ein Klick ins Bild setzt den Punkt für „${title}“.`,
  move: (title: string): string =>
    `„${title}“ liegt auf dem Bild. Ziehen verschiebt den Punkt, ein Klick ins Bild setzt ihn neu.`,
} as const;

/** Die Einrückung je Ebene in der Auswahl; ein Geviertleerzeichen, weil Browser gewöhnliche zusammenziehen. */
const INDENT = "\u2003";

const DEPTHS = Array.from({ length: MAX_MENU_DEPTH - MIN_MENU_DEPTH + 1 }, (_, index) => MIN_MENU_DEPTH + index);

type MenuSettings = HotspotConfig["menu"];

export interface MenuPanelProps {
  rootImage: HotspotImage | null;
  onRootImageChange: (image: HotspotImage | null) => void;
  menu: MenuSettings;
  onMenuChange: (menu: MenuSettings) => void;
  /** Nur für Tests. */
  loadTree?: MenuTreeLoader;
}

export function MenuPanel({ rootImage, onRootImageChange, menu, onMenuChange, loadTree }: MenuPanelProps): ReactElement {
  const state = useMenuTree(menu.rootId, menu.depth, loadTree);
  const set = (patch: Partial<MenuSettings>): void => onMenuChange({ ...menu, ...patch });

  return (
    <>
      <div className="man-hie__settings">
        <StartPointField value={menu.rootId} onChange={(rootId) => set({ rootId })} />
        <label className="man-hie__label">
          {MENU_EDITOR_MESSAGES.depth}
          <select
            className="man-hie__input"
            value={menu.depth}
            data-testid="menu-editor-depth"
            onChange={(event) => set({ depth: Number(event.target.value) })}
          >
            {DEPTHS.map((depth) => (
              <option key={depth} value={depth}>
                {depth}
              </option>
            ))}
          </select>
        </label>
        <label className="man-hie__label">
          {MENU_EDITOR_MESSAGES.click}
          <select
            className="man-hie__input"
            value={menu.click}
            data-testid="menu-editor-click"
            onChange={(event) => set({ click: event.target.value as MenuClickMode })}
          >
            <option value="enter">{MENU_EDITOR_MESSAGES.clickEnter}</option>
            <option value="open">{MENU_EDITOR_MESSAGES.clickOpen}</option>
          </select>
        </label>
      </div>
      {state.status === "ready" ? (
        <LevelEditor
          // Ein anderer Baum fängt wieder oben an.
          key={`${menu.rootId}#${menu.depth}`}
          tree={state.tree}
          layout={menu.layout}
          onChange={(layout) => set({ layout })}
          rootImage={rootImage}
          onRootImageChange={onRootImageChange}
        />
      ) : (
        <TreeStatus state={state} />
      )}
    </>
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

interface LevelEditorProps {
  tree: MenuTree;
  layout: MenuLayout;
  onChange: (layout: MenuLayout) => void;
  rootImage: HotspotImage | null;
  onRootImageChange: (image: HotspotImage | null) => void;
}

function LevelEditor({ tree, layout, onChange, rootImage, onRootImageChange }: LevelEditorProps): ReactElement {
  const rootId = tree.root.entry.id;
  const [levelId, setLevelId] = useState(rootId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [full, setFull] = useState(false);

  const levelNode = tree.index.get(levelId)?.node ?? tree.root;
  const level = levelLayout(layout, levelId);
  const isRoot = levelId === rootId;
  const image = isRoot ? rootImage : (level.image ?? null);


  const openLevel = (id: string): void => {
    setLevelId(id);
    setSelectedId(null);
    setFull(false);
  };

  const setPoints = (points: MenuHotspotPoint[]): void => onChange(withLevel(layout, levelId, { ...level, points }));

  const setLevelImage = (next: HotspotImage | null): void => {
    const rest = { points: level.points };
    onChange(withLevel(layout, levelId, next === null ? rest : { ...rest, image: next }));
  };

  const changeImage = isRoot ? onRootImageChange : setLevelImage;

  const selectedEntry = selectedId === null ? null : (tree.index.get(selectedId)?.node.entry ?? null);
  const selectedPoint = level.points.find((point) => point.menuId === selectedId) ?? null;
  const orphans = orphanPoints(tree, layout);

  const canvasPoints: HotspotPoint[] = level.points.map((point) => ({
    id: point.id,
    x: point.x,
    y: point.y,
    title: tree.index.get(point.menuId)?.node.entry.title ?? MENU_EDITOR_MESSAGES.orphans,
  }));

  const onAdd = (x: number, y: number): void => {
    if (selectedId === null) return;
    if (selectedPoint !== null) {
      setPoints(level.points.map((point) => (point === selectedPoint ? { ...point, x, y } : point)));
      return;
    }
    if (level.points.length >= MAX_POINTS) {
      setFull(true);
      return;
    }
    setPoints([...level.points, { id: newPointId(), menuId: selectedId, x: clampPercent(x), y: clampPercent(y) }]);
  };

  const onMove = (pointId: string, x: number, y: number): void =>
    setPoints(level.points.map((point) => (point.id === pointId ? { ...point, x, y } : point)));

  const onSelectPoint = (pointId: string): void => {
    const point = level.points.find((candidate) => candidate.id === pointId);
    if (point !== undefined && tree.index.has(point.menuId)) setSelectedId(point.menuId);
  };

  const removeOrphan = (orphanLevelId: string, pointId: string): void => {
    const orphanLevel = levelLayout(layout, orphanLevelId);
    onChange(
      withLevel(layout, orphanLevelId, {
        ...orphanLevel,
        points: orphanLevel.points.filter((point) => point.id !== pointId),
      }),
    );
  };

  return (
    <>
      <label className="man-hie__label">
        {MENU_EDITOR_MESSAGES.level}
        <select
          className="man-hie__input"
          value={levelId}
          data-testid="menu-editor-level"
          onChange={(event) => openLevel(event.target.value)}
        >
          {levelNodes(tree).map(({ node, depth }) => (
            <option key={node.entry.id} value={node.entry.id}>
              {`${INDENT.repeat(depth)}${node.entry.title}`}
            </option>
          ))}
        </select>
      </label>
      <div className="man-hie__layout">
        <div className="man-hie__left">
          <ImageField
            image={image}
            alt={image?.alt ?? ""}
            onChange={changeImage}
            // Ohne Bild trägt das neue Bild seinen Text schon selbst (`ImageField.select`).
            onAltChange={(alt) => image !== null && changeImage({ ...image, alt })}
          />
          {image === null ? (
            <p className="man-hie__hint" data-testid="menu-editor-needs-image">
              {isRoot ? MENU_EDITOR_MESSAGES.rootNeedsImage : MENU_EDITOR_MESSAGES.inherits}
            </p>
          ) : (
            <>
              {full && (
                <p className="man-hie__hint" data-testid="menu-editor-full">
                  {MENU_EDITOR_MESSAGES.full}
                </p>
              )}
              <PlacementCanvas
                key={levelId}
                image={image}
                points={canvasPoints}
                selectedId={selectedPoint?.id ?? null}
                onAdd={onAdd}
                onMove={onMove}
                onSelect={onSelectPoint}
                markerLabel={() => ""}
              />
              <p className="man-hie__hint" data-testid="menu-editor-remaining">
                {MENU_EDITOR_MESSAGES.remaining(MAX_POINTS - level.points.length)}
              </p>
            </>
          )}
        </div>
        <div className="man-hie__right">
          <MenuLevelList
            level={levelNode}
            placed={new Set(level.points.map((point) => point.menuId))}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onOpenLevel={openLevel}
          />
          <div className="man-hie__form" data-testid="menu-editor-selection">
            {selectedEntry === null ? (
              <p className="man-hie__hint">{MENU_EDITOR_MESSAGES.pickFirst}</p>
            ) : selectedPoint === null ? (
              <p className="man-hie__hint">{MENU_EDITOR_MESSAGES.place(selectedEntry.title)}</p>
            ) : (
              <>
                <p className="man-hie__hint">{MENU_EDITOR_MESSAGES.move(selectedEntry.title)}</p>
                <button
                  type="button"
                  className="man-hie__button"
                  onClick={() => {
                    setPoints(level.points.filter((point) => point.id !== selectedPoint.id));
                    setFull(false);
                  }}
                >
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
                {orphans.map(({ levelId: orphanLevelId, point }) => (
                  <li key={`${orphanLevelId}-${point.id}`} className="man-hie__list-item">
                    <span className="man-hie__tree-title">
                      {tree.index.get(point.menuId)?.node.entry.title ?? point.menuId}
                    </span>
                    <button
                      type="button"
                      className="man-hie__button"
                      onClick={() => removeOrphan(orphanLevelId, point.id)}
                    >
                      {MENU_EDITOR_MESSAGES.removeOrphan}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
