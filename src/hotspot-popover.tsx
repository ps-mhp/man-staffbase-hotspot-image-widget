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
 * Die Box am Punkt.
 *
 * Auf breiten Bildschirmen wird sie an den Punkt gerechnet; auf schmalen wird
 * gar nicht gerechnet, sondern zentriert — dort ist am Punkt kein Platz, und
 * der Finger verdeckt ohnehin die Stelle.
 */

import * as React from "react";
import { ReactElement, useLayoutEffect, useRef, useState } from "react";

import { Placement, placePopover } from "./popover-placement";
import { HotspotPoint, linkLabel } from "./points-model";

export interface HotspotPopoverProps {
  id: string;
  point: HotspotPoint;
  /** Die Bühne, an der gemessen wird; null heißt: nicht messen. */
  stage: HTMLElement | null;
  centered: boolean;
  onClose: () => void;
  onOpenLink: (point: HotspotPoint) => void;
}

export function HotspotPopover({
  id,
  point,
  stage,
  centered,
  onClose,
  onOpenLink,
}: HotspotPopoverProps): ReactElement {
  const boxRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<Placement | null>(null);

  useLayoutEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useLayoutEffect(() => {
    // Ein Klick daneben schließt. `mousedown` statt `click`, damit die Box
    // schon weg ist, bevor irgendwo darunter etwas anderes anspringt.
    //
    // Marker sind ausgenommen: sonst schlösse ihr `mousedown` die Box und ihr
    // `click` öffnete sie sofort wieder — der Marker ließe sich nie zuklappen.
    const onOutside = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (boxRef.current?.contains(target) === true) return;
      if (target !== null && target.closest(".man-hi__marker") !== null) return;
      onClose();
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [onClose]);

  useLayoutEffect(() => {
    if (centered || stage === null || boxRef.current === null) {
      setPlacement(null);
      return;
    }
    // Vor dem Zeichnen messen: sonst blitzt das Popover kurz an der falschen
    // Stelle auf.
    const box = boxRef.current.getBoundingClientRect();
    setPlacement(
      placePopover({
        point,
        stage: { width: stage.clientWidth, height: stage.clientHeight },
        popover: { width: box.width, height: box.height },
      }),
    );
  }, [centered, stage, point]);

  // Ohne Bühne gibt es nichts zu messen — dann sofort zeigen statt für immer
  // zu verstecken. Nur solange tatsächlich gemessen wird (Bühne vorhanden,
  // aber noch kein Ergebnis), bleibt die Box unsichtbar.
  const style: React.CSSProperties = centered
    ? {}
    : {
        left: placement?.left ?? 0,
        top: placement?.top ?? 0,
        visibility: stage !== null && placement === null ? "hidden" : "visible",
      };

  return (
    <div
      ref={boxRef}
      id={id}
      role="dialog"
      aria-modal={false}
      aria-label={point.title}
      data-testid={id}
      className={`man-hi__popover${centered ? " man-hi__popover--centered" : ""}`}
      style={style}
    >
      <div className="man-hi__popover-head">
        <h3 className="man-hi__popover-title">{point.title}</h3>
        <button
          type="button"
          className="man-hi__popover-close"
          aria-label="Schließen"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      {point.description !== undefined && (
        <p className="man-hi__popover-text">{point.description}</p>
      )}
      {point.link !== undefined && (
        <button type="button" className="man-hi__popover-action" onClick={() => onOpenLink(point)}>
          {linkLabel(point.link)}
        </button>
      )}
    </div>
  );
}
