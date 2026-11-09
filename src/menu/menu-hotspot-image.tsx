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
 * Die Leseansicht im Modus „Menü“: das Bild mit den platzierten Menüpunkten,
 * daneben das blätternde Menü.
 *
 * Hier liegt der Zustand: wohin geblättert ist, welcher Punkt und welche
 * Zeile unter dem Zeiger stehen, welcher Eintrag zuletzt gezeigt wurde.
 * Punkte erscheinen nur für Einträge, die im geladenen Baum stehen — wer
 * einen Eintrag nicht sehen darf, sieht auch seinen Punkt nicht.
 */

import * as React from "react";
import { ReactElement, useState } from "react";

import { useHotStyle } from "@shared/hot-style";
import { MenuTree } from "@shared/staffbase/menu-tree";

import { MenuClickMode, MenuHotspotPoint } from "../menu-points-model";
import { HotspotImage as HotspotImageData } from "../points-model";
import baseStyles from "../styles/hotspot-image.scss";
import menuStyles from "../styles/menu-mode.scss";
import { MenuBrowser, MenuDirection, MenuReveal } from "./menu-browser";
import { menuMarkFor, subtreeIds, trailTo } from "./menu-highlight";
import { MenuMarker } from "./menu-marker";
import { MenuTreeLoader, useMenuTree } from "./use-menu-tree";

export const MENU_STATUS = {
  loading: "Menü wird geladen …",
  failed: "Das Menü konnte nicht geladen werden.",
  retry: "Erneut versuchen",
} as const;

export interface MenuHotspotImageProps {
  image: HotspotImageData | null;
  points: MenuHotspotPoint[];
  /** Der Startknoten; `null`, solange keiner gewählt ist. */
  rootId: string | null;
  depth: number;
  click: MenuClickMode;
  /** Nur für Tests. */
  loadTree?: MenuTreeLoader;
}

export function MenuHotspotImage({
  image,
  points,
  rootId,
  depth,
  click,
  loadTree,
}: MenuHotspotImageProps): ReactElement | null {
  const base = useHotStyle(baseStyles, "hotspot-image-widget", "styles/hotspot-image.scss");
  const menu = useHotStyle(menuStyles, "hotspot-image-widget", "styles/menu-mode.scss");
  // Ohne Bild oder Punkt wird nichts gezeigt — und das Menü gar nicht erst gefragt.
  const wanted = image !== null && points.length > 0;
  const state = useMenuTree(wanted ? rootId : null, depth, loadTree);

  // Ohne Bild, Startknoten oder Punkt gibt es nichts zu zeigen; ein leerer
  // Kasten sähe nach einem Fehler aus. Hinter den Hooks, wie in `hotspot-image.tsx`.
  if (image === null || rootId === null || points.length === 0) return null;

  return (
    <>
      <style>
        {base}
        {menu}
      </style>
      {state.status === "ready" ? (
        // Der Schlüssel setzt Blättern und Markierungen zurück, wenn ein anderer Baum kommt.
        <MenuStage key={`${rootId}#${depth}`} image={image} points={points} tree={state.tree} click={click} />
      ) : (
        <div className="man-hi man-hi--menu">
          <Stage image={image} />
          <div className="man-hi-menu man-hi-menu--status">
            {state.status === "error" ? (
              <div className="man-hi-menu__status" role="alert">
                <p className="man-hi-menu__message">{MENU_STATUS.failed}</p>
                <button type="button" className="man-hi-menu__retry" onClick={state.retry}>
                  {MENU_STATUS.retry}
                </button>
              </div>
            ) : (
              <p className="man-hi-menu__status man-hi-menu__status--loading" role="status">
                {MENU_STATUS.loading}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Stage({ image, children }: { image: HotspotImageData; children?: React.ReactNode }): ReactElement {
  return (
    <div className="man-hi__stage">
      <img
        className="man-hi__image"
        src={image.url}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading="lazy"
      />
      {children}
    </div>
  );
}

interface MenuStageProps {
  image: HotspotImageData;
  points: MenuHotspotPoint[];
  tree: MenuTree;
  click: MenuClickMode;
}

interface Navigation {
  trail: string[];
  direction: MenuDirection;
}

function MenuStage({ image, points, tree, click }: MenuStageProps): ReactElement {
  const [navigation, setNavigation] = useState<Navigation>({ trail: [], direction: "none" });
  const [markerHover, setMarkerHover] = useState<string | null>(null);
  const [rowHover, setRowHover] = useState<string | null>(null);
  const [reveal, setReveal] = useState<MenuReveal | null>(null);

  const onNavigate = (trail: string[], direction: MenuDirection): void => {
    setNavigation({ trail, direction });
    setReveal(null);
    // Die Zeile unter Zeiger oder Fokus verschwindet beim Blättern, ohne ein
    // `pointerleave` oder `blur` zu schicken -- ihre Hervorhebung bliebe hängen.
    setRowHover(null);
  };

  const onReveal = (menuId: string): void => {
    const trail = trailTo(tree, menuId);
    if (trail === null) return;
    const before = navigation.trail.length;
    const direction: MenuDirection = trail.length > before ? "forward" : trail.length < before ? "back" : "none";
    setNavigation({ trail, direction });
    setReveal((previous) => ({ id: menuId, seq: (previous?.seq ?? 0) + 1 }));
  };

  const highlighted = rowHover === null ? new Set<string>() : subtreeIds(tree, rowHover);
  const visible = points.flatMap((point) => {
    const location = tree.index.get(point.menuId);
    return location === undefined ? [] : [{ point, entry: location.node.entry }];
  });

  return (
    <div className="man-hi man-hi--menu">
      <Stage image={image}>
        {visible.map(({ point, entry }) => (
          <MenuMarker
            key={point.id}
            point={point}
            entry={entry}
            click={click}
            highlighted={highlighted.has(point.menuId)}
            named={rowHover === point.menuId}
            onHover={setMarkerHover}
            onReveal={onReveal}
          />
        ))}
      </Stage>
      <MenuBrowser
        tree={tree}
        trail={navigation.trail}
        direction={navigation.direction}
        onNavigate={onNavigate}
        mark={menuMarkFor(tree, markerHover, navigation.trail)}
        reveal={reveal}
        onRowHover={setRowHover}
      />
    </div>
  );
}
