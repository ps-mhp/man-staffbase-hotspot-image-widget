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
 * Der Modus „Menü“ im Rahmen von `@man/config-ui`, wie im Screen: links die
 * Menü-Ebenen als Baum, in der Mitte das Bild der gezeigten Ebene mit den
 * Punkten ihrer Unterpunkte, rechts das Panel „Menü“ (Startpunkt, Tiefe,
 * Klick, Bild der Ebene) oder der gewählte Eintrag.
 *
 * Im Baum zeigt ein Eintrag mit Unterpunkten seine eigene Ebene; ein Eintrag
 * ohne wählt sich als Ziel auf der Ebene darüber – ein Klick ins Bild setzt
 * dann seinen Punkt. Einträge mit Unterpunkten werden über ihren Punkt im
 * Bild oder „Punkt … setzen“ im Panel zum Ziel.
 *
 * Wechselt Startpunkt oder Tiefe, lädt der Baum neu – im selben Fenster.
 * Punkte, deren Eintrag nicht mehr unter ihrer Ebene steht, werden nie von
 * selbst entfernt: ein Menü, das gerade nicht lädt, sähe genauso aus wie ein
 * gelöschter Eintrag.
 */

import * as React from "react";
import { ReactElement, useState } from "react";
import { InspectorPanel } from "@man/config-ui/inspector/inspector-panel";
import { ConfigWorkspace } from "@man/config-ui/layout/config-workspace";
import { ItemTree } from "@man/config-ui/sidebar/item-tree";
import { SidebarPanel } from "@man/config-ui/sidebar/sidebar-panel";
import { Button } from "@man/config-ui/primitives/button";
import { EntityOption } from "@shared/entity-picker/entity-catalog";
import { PickedMedia } from "@shared/media/media-picker";
import { MenuTree } from "@shared/staffbase/menu-tree";

import { HotspotConfig } from "../hotspot-config";
import { MenuLevelLayout, levelLayout, withLevel } from "../menu-points-model";
import { orphanPoints } from "../menu/menu-levels";
import { MenuTreeLoader, MenuTreeState, useMenuTree } from "../menu/use-menu-tree";
import { HotspotImage, HotspotPoint, MAX_POINTS, clampPercent, newPointId } from "../points-model";
import { CanvasBar } from "./canvas-bar";
import { CanvasStage } from "./canvas-stage";
import { fileNameOf, imageFromPick, useEditorMedia } from "./editor-media";
import { HotspotPreview } from "./hotspot-preview";
import { MenuPointPanel, OrphanPanel } from "./menu-point-panel";
import { LevelContext, MENU_SETTINGS_MESSAGES, MenuSettings } from "./menu-settings";
import {
  expandableIds,
  menuTreeNodes,
  orphanTitle,
  ownLevelImage,
  parentOf,
  parseOrphanKey,
  trailTitle,
} from "./menu-tree-nodes";
import { ModeEditorProps } from "./mode-props";
import { PlacementCanvas } from "./placement-canvas";
import { iconFromPick } from "./point-icon-field";
import { StartPointState, useStartPointState } from "./start-point-field";

export const MENU_EDITOR_MESSAGES = {
  levels: "Menü-Ebenen",
  sidebarHint: (depth: number): string =>
    `Tiefe ${depth}. Jede Ebene hat ein eigenes Bild. Die Punkte kommen aus den Menüeinträgen der Ebene.`,
  noStart: "Wähle rechts einen Startpunkt im Menü.",
  loading: "Menü wird geladen …",
  failed: "Das Menü konnte nicht geladen werden.",
  retry: "Erneut versuchen",
  noMenu: "Kein Menü geladen",
  pickFirst: "Wähle links einen Menüpunkt; ein Klick ins Bild setzt dann seinen Punkt.",
  full: `Mehr als ${MAX_POINTS} Punkte trägt eine Ebene nicht.`,
  remaining: (count: number): string => `Noch ${count} von ${MAX_POINTS} Punkten frei.`,
  place: (title: string): string => `Ein Klick ins Bild setzt den Punkt für „${title}“.`,
  move: (title: string): string => `Ziehen verschiebt „${title}“, ein Klick ins Bild setzt ihn neu.`,
  orphanTitle: "Nicht mehr im Menü",
} as const;

type Menu = HotspotConfig["menu"];

export interface MenuEditorProps extends ModeEditorProps {
  /** Nur für Tests. */
  loadTree?: MenuTreeLoader;
  /** Nur für Tests. */
  loadStartPoints?: () => Promise<EntityOption[]>;
}

function statusText(state: MenuTreeState): string {
  if (state.status === "loading") return MENU_EDITOR_MESSAGES.loading;
  if (state.status === "error") return MENU_EDITOR_MESSAGES.failed;
  return MENU_EDITOR_MESSAGES.noStart;
}

/** Ohne geladenen Baum: Seitenleiste und Bühne sagen, warum, rechts steht das Menü. */
interface InnerProps extends MenuEditorProps {
  startPoint: StartPointState;
}

function MenuWaiting({ state, config, inherited, update, onSourceChange, startPoint }: InnerProps & { state: MenuTreeState }): ReactElement {
  const text = statusText(state);
  const setMenu = (patch: Partial<Menu>): void => update((current) => ({ ...current, menu: { ...current.menu, ...patch } }));
  return (
    <ConfigWorkspace
      className="min-h-0 flex-1"
      sidebar={
        <SidebarPanel title={MENU_EDITOR_MESSAGES.levels}>
          <div className="flex flex-col items-start gap-2 px-2 py-6" role={state.status === "error" ? "alert" : "status"}>
            <p className="text-[13px] text-muted-foreground" data-testid="menu-tree-status">
              {text}
            </p>
            {state.status === "error" && (
              <Button type="button" variant="outline" size="sm" onClick={state.retry} data-testid="menu-tree-retry">
                {MENU_EDITOR_MESSAGES.retry}
              </Button>
            )}
          </div>
        </SidebarPanel>
      }
      inspector={
        <InspectorPanel title={MENU_SETTINGS_MESSAGES.title}>
          <MenuSettings
            menu={config.menu}
            inherited={inherited}
            onMenuChange={setMenu}
            orphanCount={0}
            startPoint={startPoint}
          />
        </InspectorPanel>
      }
      preview={<HotspotPreview config={config} />}
    >
      <div className="flex h-full min-h-0 flex-col" data-testid="menu-editor">
        <CanvasBar
          source="menu"
          onSourceChange={onSourceChange}
          imageLabel={MENU_EDITOR_MESSAGES.noMenu}
          settingsShown
          onShowSettings={() => undefined}
          pickLabel=""
        />
        <CanvasStage empty emptyText={text} status={MENU_EDITOR_MESSAGES.noMenu}>
          {null}
        </CanvasStage>
      </div>
    </ConfigWorkspace>
  );
}

export function MenuEditor(props: MenuEditorProps): ReactElement {
  const { rootId, depth } = props.config.menu;
  const state = useMenuTree(rootId, depth, props.loadTree);
  // Hier, oberhalb des Wechsels zwischen Warten und Baum: das Feld behält
  // so, was getippt ist, und lädt seine Liste nur einmal.
  const startPoint = useStartPointState(rootId, props.loadStartPoints);
  if (state.status !== "ready") return <MenuWaiting {...props} startPoint={startPoint} state={state} />;
  // Ein anderer Baum fängt wieder oben an.
  return <MenuWorkspace key={`${rootId}#${depth}`} {...props} startPoint={startPoint} tree={state.tree} />;
}

/** Ändert eine Ebene der Ablage über den jüngsten Stand. */
function useLevelUpdate(update: ModeEditorProps["update"]) {
  return (levelId: string, change: (level: MenuLevelLayout) => MenuLevelLayout): void =>
    update((current) => ({
      ...current,
      menu: {
        ...current.menu,
        layout: withLevel(current.menu.layout, levelId, change(levelLayout(current.menu.layout, levelId))),
      },
    }));
}

function MenuWorkspace({ tree, config, inherited, update, onSourceChange, startPoint }: InnerProps & { tree: MenuTree }): ReactElement {
  const media = useEditorMedia();
  const rootId = tree.root.entry.id;
  const [levelId, setLevelId] = useState(rootId);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [full, setFull] = useState(false);
  const setLevel = useLevelUpdate(update);

  const layout = config.menu.layout;
  const shownId = tree.index.has(levelId) ? levelId : rootId;
  const levelNode = tree.index.get(shownId)?.node ?? tree.root;
  const isRoot = shownId === rootId;
  const level = levelLayout(layout, shownId);
  const image = ownLevelImage(tree, layout, config.image, shownId);
  const orphan = targetId === null ? null : parseOrphanKey(targetId);
  const target = targetId === null || orphan !== null ? null : (tree.index.get(targetId)?.node ?? null);
  const targetPoint = target === null ? null : (level.points.find((point) => point.menuId === target.entry.id) ?? null);

  const show = (nextLevel: string, nextTarget: string | null): void => {
    setLevelId(nextLevel);
    setTargetId(nextTarget);
    setFull(false);
  };
  const select = (id: string): void => {
    const orphanRef = parseOrphanKey(id);
    if (orphanRef !== null) return show(tree.index.has(orphanRef.levelId) ? orphanRef.levelId : rootId, id);
    const node = tree.index.get(id)?.node;
    if (node === undefined) return;
    if (id === rootId || node.children.length > 0) return show(id, null);
    show(parentOf(tree, id) ?? rootId, id);
  };

  const setLevelImage = (id: string, next: HotspotImage | null): void => {
    if (id === rootId) {
      update((current) => ({ ...current, image: next }));
      return;
    }
    setLevel(id, (current) => (next === null ? { points: current.points } : { ...current, image: next }));
  };
  const pickLevelImage = (id: string) => (picked: PickedMedia): void => {
    if (id === rootId) {
      update((current) => ({ ...current, image: imageFromPick(picked, current.image) }));
      return;
    }
    setLevel(id, (current) => ({ ...current, image: imageFromPick(picked, current.image) }));
  };
  const imageLabel = MENU_SETTINGS_MESSAGES.levelImage(levelNode.entry.title);

  const onAdd = (x: number, y: number): void => {
    if (target === null || parentOf(tree, target.entry.id) !== shownId) return;
    const menuId = target.entry.id;
    if (targetPoint !== null) {
      setLevel(shownId, (current) => ({
        ...current,
        points: current.points.map((point) => (point.menuId === menuId ? { ...point, x, y } : point)),
      }));
      return;
    }
    if (level.points.length >= MAX_POINTS) {
      setFull(true);
      return;
    }
    const point = { id: newPointId(), menuId, x: clampPercent(x), y: clampPercent(y) };
    setLevel(shownId, (current) => ({ ...current, points: [...current.points, point] }));
  };

  const removePoint = (fromLevel: string, pointId: string): void => {
    setLevel(fromLevel, (current) => ({ ...current, points: current.points.filter((point) => point.id !== pointId) }));
    setFull(false);
  };

  const canvasPoints: HotspotPoint[] = level.points.map((point) => ({
    id: point.id,
    x: point.x,
    y: point.y,
    title: tree.index.get(point.menuId)?.node.entry.title ?? MENU_EDITOR_MESSAGES.orphanTitle,
    ...(point.icon === undefined ? {} : { icon: point.icon }),
  }));

  const orphans = orphanPoints(tree, layout);
  const parentId = parentOf(tree, shownId);
  const levelContext: LevelContext = {
    id: shownId,
    title: levelNode.entry.title,
    isRoot,
    image,
    onImageChange: (next) => setLevelImage(shownId, next),
    onImagePick: pickLevelImage(shownId),
    ...(parentId === null
      ? {}
      : { parent: { title: tree.index.get(parentId)?.node.entry.title ?? "", onPlace: () => show(parentId, shownId) } }),
  };

  const inspector = ((): ReactElement => {
    if (orphan !== null && targetId !== null) {
      const entry = layout[orphan.levelId]?.points.find((point) => point.id === orphan.pointId);
      return (
        <OrphanPanel
          title={entry === undefined ? MENU_EDITOR_MESSAGES.orphanTitle : orphanTitle(tree, entry)}
          onRemove={() => {
            removePoint(orphan.levelId, orphan.pointId);
            setTargetId(null);
          }}
        />
      );
    }
    if (target !== null) {
      const menuId = target.entry.id;
      const changeIcon = (change: (point: (typeof level.points)[number]) => (typeof level.points)[number]): void =>
        setLevel(shownId, (current) => ({
          ...current,
          points: current.points.map((point) => (point.menuId === menuId ? change(point) : point)),
        }));
      return (
        <MenuPointPanel
          key={menuId}
          title={target.entry.title}
          levelTitle={levelNode.entry.title}
          levelHasImage={image !== null}
          point={targetPoint}
          onIconChange={(icon) =>
            changeIcon((point) => {
              const rest = { ...point };
              delete rest.icon;
              return icon === undefined ? rest : { ...rest, icon };
            })
          }
          onIconPick={(picked) => changeIcon((point) => ({ ...point, icon: iconFromPick(picked, point.icon) }))}
          onRemove={() => targetPoint !== null && removePoint(shownId, targetPoint.id)}
          onOpenLevel={target.children.length > 0 ? () => show(menuId, null) : undefined}
        />
      );
    }
    return (
      <InspectorPanel title={MENU_SETTINGS_MESSAGES.title}>
        <MenuSettings
          menu={config.menu}
          inherited={inherited}
          onMenuChange={(patch) => update((current) => ({ ...current, menu: { ...current.menu, ...patch } }))}
          level={levelContext}
          orphanCount={orphans.length}
          startPoint={startPoint}
        />
      </InspectorPanel>
    );
  })();

  const nodes = menuTreeNodes(tree, layout, config.image);
  const stageHint =
    target === null
      ? MENU_EDITOR_MESSAGES.pickFirst
      : targetPoint === null
        ? MENU_EDITOR_MESSAGES.place(target.entry.title)
        : MENU_EDITOR_MESSAGES.move(target.entry.title);

  return (
    <ConfigWorkspace
      className="min-h-0 flex-1"
      sidebar={
        <SidebarPanel
          title={MENU_EDITOR_MESSAGES.levels}
          footer={<p className="text-[13px] leading-normal text-muted-foreground">{MENU_EDITOR_MESSAGES.sidebarHint(config.menu.depth)}</p>}
        >
          <ItemTree
            aria-label={MENU_EDITOR_MESSAGES.levels}
            nodes={nodes}
            selectedId={targetId ?? shownId}
            onSelect={select}
            defaultExpandedIds={expandableIds(nodes)}
          />
        </SidebarPanel>
      }
      inspector={inspector}
      preview={<HotspotPreview config={config} />}
    >
      <div className="flex h-full min-h-0 flex-col" data-testid="menu-editor">
        <CanvasBar
          source="menu"
          onSourceChange={onSourceChange}
          imageLabel={`Ebene: ${trailTitle(tree, shownId)} · ${image === null ? "kein eigenes Bild" : `Bild: ${fileNameOf(image.url)}`}`}
          settingsShown={targetId === null}
          onShowSettings={() => setTargetId(null)}
          pickLabel={image === null ? "Bild wählen" : "Bild ändern"}
          onPick={() => media.pick(imageLabel, pickLevelImage(shownId))}
        />
        <CanvasStage
          empty={image === null}
          emptyText={isRoot ? MENU_SETTINGS_MESSAGES.rootNeedsImage : MENU_SETTINGS_MESSAGES.inherits}
          onPickClick={() => media.pick(imageLabel, pickLevelImage(shownId))}
          onDrop={pickLevelImage(shownId)}
          status={full ? MENU_EDITOR_MESSAGES.full : MENU_EDITOR_MESSAGES.remaining(MAX_POINTS - level.points.length)}
          hint={image === null ? undefined : stageHint}
        >
          {image !== null && (
            <PlacementCanvas
              // Je Ebene eine eigene Bühne: ein Zug soll nicht in die nächste Ebene hinüberreichen.
              key={shownId}
              image={image}
              points={canvasPoints}
              selectedId={targetPoint?.id ?? null}
              tone="menu"
              showTitles
              label={`${levelNode.entry.title} mit ${canvasPoints.length} Punkten aus dem Menü`}
              markerLabel={() => ""}
              onAdd={onAdd}
              onMove={(pointId, x, y) =>
                setLevel(shownId, (current) => ({
                  ...current,
                  points: current.points.map((point) => (point.id === pointId ? { ...point, x, y } : point)),
                }))
              }
              onSelect={(pointId) => {
                const point = level.points.find((candidate) => candidate.id === pointId);
                if (point !== undefined && tree.index.has(point.menuId)) setTargetId(point.menuId);
              }}
            />
          )}
        </CanvasStage>
      </div>
    </ConfigWorkspace>
  );
}
