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
 * Die Leseansicht im Modus „Menü“: das Bild der gezeigten Menüebene mit den
 * Punkten ihrer Unterpunkte, daneben das blätternde Menü. Blättert das Menü,
 * wechselt das Bild mit — hat eine Ebene keines, bleibt das der Ebene darüber.
 *
 * Hier liegt der Zustand: wohin geblättert ist und welcher Punkt und welche
 * Zeile unter dem Zeiger stehen. Punkte erscheinen nur für Einträge, die im
 * geladenen Baum stehen — wer einen Eintrag nicht sehen darf, sieht auch
 * seinen Punkt nicht.
 */

import * as React from "react";
import { ReactElement, useEffect, useState } from "react";

import { useHotStyle } from "@shared/hot-style";
import { MenuTree } from "@shared/staffbase/menu-tree";

import { MenuClickMode, MenuLayout } from "../menu-points-model";
import { HotspotImage as HotspotImageData } from "../points-model";
import baseStyles from "../styles/hotspot-image.scss";
import menuStyles from "../styles/menu-mode.scss";
import { MenuBrowser, MenuDirection } from "./menu-browser";
import { menuMarkFor, subtreeIds } from "./menu-highlight";
import { ImageLevel, imageLevelFor, levelPoints, shownLevelId, trailOf } from "./menu-levels";
import { MenuMarker } from "./menu-marker";
import { MenuTreeLoader, useMenuTree } from "./use-menu-tree";
import { prefetchImages, useSettledImageLevel } from "./use-settled-image";

export const MENU_STATUS = {
  loading: "Menü wird geladen …",
  failed: "Das Menü konnte nicht geladen werden.",
  retry: "Erneut versuchen",
} as const;

export interface MenuHotspotImageProps {
  /** Das Bild der Startebene, aus dem Attribut `image`. */
  image: HotspotImageData | null;
  layout: MenuLayout;
  /** Der Startknoten; `null`, solange keiner gewählt ist. */
  rootId: string | null;
  depth: number;
  click: MenuClickMode;
  /** Nur für Tests. */
  loadTree?: MenuTreeLoader;
}

export function MenuHotspotImage({
  image,
  layout,
  rootId,
  depth,
  click,
  loadTree,
}: MenuHotspotImageProps): ReactElement | null {
  const base = useHotStyle(baseStyles, "hotspot-image-widget", "styles/hotspot-image.scss");
  const menu = useHotStyle(menuStyles, "hotspot-image-widget", "styles/menu-mode.scss");
  // Ohne ein einziges Bild gibt es nichts zu zeigen — dann wird das Menü gar nicht erst gefragt.
  const anyImage = image !== null || Object.values(layout).some((level) => level.image !== undefined);
  const state = useMenuTree(anyImage ? rootId : null, depth, loadTree);

  // Ein leerer Kasten sähe nach einem Fehler aus. Hinter den Hooks, wie in `hotspot-image.tsx`.
  if (!anyImage || rootId === null) return null;

  return (
    <>
      <style>
        {base}
        {menu}
      </style>
      {state.status === "ready" ? (
        // Der Schlüssel setzt Blättern und Markierungen zurück, wenn ein anderer Baum kommt.
        <MenuStage key={`${rootId}#${depth}`} image={image} layout={layout} tree={state.tree} click={click} />
      ) : (
        <div className="man-hi man-hi--menu">
          {image !== null && <Stage image={image} />}
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
  image: HotspotImageData | null;
  layout: MenuLayout;
  tree: MenuTree;
  click: MenuClickMode;
}

interface Navigation {
  trail: string[];
  direction: MenuDirection;
}

function MenuStage({ image, layout, tree, click }: MenuStageProps): ReactElement {
  const [navigation, setNavigation] = useState<Navigation>({ trail: [], direction: "none" });
  const [markerHover, setMarkerHover] = useState<string | null>(null);
  const [rowHover, setRowHover] = useState<string | null>(null);
  const [focusRequest, setFocusRequest] = useState(0);

  const onNavigate = (trail: string[], direction: MenuDirection): void => {
    setNavigation({ trail, direction });
    // Zeile und Punkt unter Zeiger oder Fokus verschwinden beim Blättern, ohne
    // ein `pointerleave` oder `blur` zu schicken -- ihre Hervorhebung bliebe hängen.
    setRowHover(null);
    setMarkerHover(null);
  };

  const onEnter = (menuId: string): void => {
    const trail = trailOf(tree, menuId);
    if (trail === null) return;
    onNavigate(trail, "forward");
    setFocusRequest((value) => value + 1);
  };

  // Alle Bilder gleich vorladen: dann kommt der spätere Wechsel aus dem Cache.
  // Nach Adressen verglichen: `layout` ist bei jedem Rendern ein neues Objekt.
  const imageUrls = [image?.url, ...Object.values(layout).map((level) => level.image?.url)]
    .filter((url): url is string => url !== undefined)
    .join("\n");
  useEffect(() => {
    if (imageUrls !== "") prefetchImages(imageUrls.split("\n"));
  }, [imageUrls]);

  const target = imageLevelFor(tree, shownLevelId(tree, navigation.trail), image, layout);
  // Das alte Bild bleibt stehen, bis das neue dekodiert ist — siehe `use-settled-image.ts`.
  const shown = useSettledImageLevel(target);
  const leaving = useLeavingImage(shown);
  const placed = shown === null ? [] : levelPoints(tree, layout, shown.levelId);
  const highlighted = rowHover === null ? new Set<string>() : subtreeIds(tree, rowHover);

  return (
    <div className={`man-hi man-hi--menu${shown === null ? " man-hi--menu-only" : ""}`}>
      {(shown !== null || leaving.image !== null) && (
        <div className="man-hi__stage-wrap">
          {shown !== null && (
            // Der Schlüssel tauscht die Bühne, wenn das Bild wechselt: sonst stünde
            // das neue Bild kurz mit den Punkten des alten da.
            <Stage key={shown.levelId} image={shown.image}>
              {placed.map(({ point, node }) => (
                <MenuMarker
                  key={point.id}
                  point={point}
                  node={node}
                  click={click}
                  highlighted={highlighted.has(point.menuId)}
                  named={rowHover === point.menuId}
                  onHover={setMarkerHover}
                  onEnter={onEnter}
                />
              ))}
            </Stage>
          )}
          {leaving.image !== null && (
            // Das vorige Bild liegt obenauf und blendet aus — so wird übergeblendet
            // statt hart getauscht. Fertig ausgeblendet, verschwindet es.
            <div
              key={leaving.key}
              className="man-hi__leaving"
              aria-hidden="true"
              data-testid="leaving-image"
              onAnimationEnd={leaving.done}
            >
              <img className="man-hi__leaving-image" src={leaving.image.url} alt="" />
            </div>
          )}
        </div>
      )}
      <MenuBrowser
        tree={tree}
        trail={navigation.trail}
        direction={navigation.direction}
        onNavigate={onNavigate}
        mark={menuMarkFor(tree, markerHover, navigation.trail)}
        focusRequest={focusRequest}
        onRowHover={setRowHover}
      />
    </div>
  );
}

interface Leaving {
  image: HotspotImageData | null;
  /** Zählt je Wechsel, damit ein neues Ausblenden von vorn beginnt. */
  key: number;
  done: () => void;
}

/** Das Bild, das gerade ausblendet: das vorige, sobald ein anderes gezeigt wird. */
function useLeavingImage(shown: ImageLevel | null): Leaving {
  const [last, setLast] = useState<ImageLevel | null>(shown);
  const [leaving, setLeaving] = useState<{ image: HotspotImageData; key: number } | null>(null);

  // Im Rendern, nicht im Effekt: sonst stünde das neue Bild einen Augenblick
  // ohne das alte darüber da, und genau dieses Blitzen soll weg.
  if ((shown?.image.url ?? null) !== (last?.image.url ?? null)) {
    setLast(shown);
    if (last !== null) setLeaving((previous) => ({ image: last.image, key: (previous?.key ?? 0) + 1 }));
  }

  return {
    image: leaving?.image ?? null,
    key: leaving?.key ?? 0,
    done: () => setLeaving(null),
  };
}

