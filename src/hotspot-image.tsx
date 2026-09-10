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
 * Das Bild mit seinen Punkten.
 *
 * Hier liegt der ganze Zustand der Leseansicht: welcher Punkt offen ist und
 * welche Seite im Modal steht. Die Bausteine darunter — Marker, Popover,
 * Liste, Modal — sind vom Zustand befreit und deshalb einzeln prüfbar.
 */

import * as React from "react";
import { ReactElement, useEffect, useRef, useState } from "react";

import { HotspotList } from "./hotspot-list";
import { HotspotMarker } from "./hotspot-marker";
import { HotspotPopover } from "./hotspot-popover";
import { PageModal } from "./page-modal";
import { DisplayMode, HotspotImage as HotspotImageData, HotspotPoint } from "./points-model";
import styles from "./styles/hotspot-image.scss";
import { useHotStyle } from "@shared/hot-style";
import { useNarrowViewport } from "./use-narrow-viewport";

export interface HotspotImageProps {
  image: HotspotImageData | null;
  points: HotspotPoint[];
  mode: DisplayMode;
}

interface OpenPage {
  href: string;
  title: string;
}

const panelId = (pointId: string): string => `man-hi-panel-${pointId}`;

export function HotspotImage({ image, points, mode }: HotspotImageProps): ReactElement | null {
  const css = useHotStyle(styles, "hotspot-image-widget", "styles/hotspot-image.scss");
  const narrow = useNarrowViewport();
  const stageRef = useRef<HTMLDivElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [page, setPage] = useState<OpenPage | null>(null);
  /** Der zuletzt offene Punkt — dorthin gehört der Fokus nach dem Schließen. */
  const lastOpenRef = useRef<string | null>(null);

  useEffect(() => {
    const closed = lastOpenRef.current;
    lastOpenRef.current = openId;

    if (openId === null) {
      // Ohne das säße der Fokus nach Escape am Seitenanfang, und wer mit der
      // Tastatur arbeitet, müsste sich zurück zum Bild hangeln.
      if (closed !== null) {
        stageRef.current
          ?.querySelector<HTMLElement>(`[data-testid="marker-${closed}"]`)
          ?.focus();
      }
      return;
    }

    // Bei vielen Punkten steht der zugehörige Eintrag sonst außerhalb des
    // Sichtfelds, und ein Klick auf den Marker sähe wirkungslos aus.
    if (mode === "numbered") {
      document
        .getElementById(panelId(openId))
        ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [openId, mode]);

  // Ein Widget ohne Bild oder ohne Punkte hat nichts zu zeigen. Ein leerer
  // Kasten in der Seite sähe nach einem Fehler aus.
  //
  // Der Ausstieg steht *hinter* allen Hooks: React verlangt in jedem Durchlauf
  // dieselbe Reihenfolge, ein `return` davor bräche das beim ersten Bild.
  if (image === null || points.length === 0) return null;

  const toggle = (pointId: string) => setOpenId((current) => (current === pointId ? null : pointId));

  const openLink = (point: HotspotPoint) => {
    const link = point.link;
    if (link === undefined) return;
    // Das Popover hat seinen Zweck erfüllt, sobald sein Link greift: es bliebe
    // sonst als zweiter Dialog mit demselben Titel hinter dem Modal stehen —
    // oder, bei einem neuen Tab, als einziger übrig und täuschte einen noch
    // offenen Punkt vor.
    setOpenId(null);
    if (link.kind === "url") {
      // Fremde Ziele kommen nicht ins iFrame: ob sie sich einbetten lassen,
      // entscheidet ihr Server, und ein blockiertes iFrame bleibt wortlos leer.
      window.open(link.href, "_blank", "noopener,noreferrer");
      return;
    }
    setPage({ href: link.href, title: link.title ?? point.title });
  };

  const openPoint = points.find((point) => point.id === openId) ?? null;
  const showPopover = mode === "dots" && openPoint !== null;

  return (
    <>
      <style>{css}</style>
      <div className={`man-hi man-hi--${mode}`}>
        <div className="man-hi__stage" ref={stageRef}>
          <img
            className="man-hi__image"
            src={image.url}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading="lazy"
          />
          {points.map((point, index) => (
            <HotspotMarker
              key={point.id}
              point={point}
              index={index}
              mode={mode}
              open={point.id === openId}
              controls={panelId(point.id)}
              onToggle={() => toggle(point.id)}
            />
          ))}
          {showPopover && openPoint !== null && (
            <HotspotPopover
              id={panelId(openPoint.id)}
              point={openPoint}
              stage={stageRef.current}
              centered={narrow}
              onClose={() => setOpenId(null)}
              onOpenLink={openLink}
            />
          )}
        </div>

        {showPopover && narrow && (
          <div
            className="man-hi__scrim"
            data-testid="popover-scrim"
            onClick={() => setOpenId(null)}
          />
        )}

        {mode === "numbered" && (
          <HotspotList
            points={points}
            openId={openId}
            panelId={panelId}
            onToggle={toggle}
            onOpenLink={openLink}
          />
        )}
      </div>

      {page !== null && (
        <PageModal href={page.href} title={page.title} onClose={() => setPage(null)} />
      )}
    </>
  );
}
