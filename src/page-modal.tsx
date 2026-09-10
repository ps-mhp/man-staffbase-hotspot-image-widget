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
 * Die verlinkte Seite über dem Widget.
 *
 * Ein Portal an `document.body`, kein Kind des Widgets: das Widget steckt in
 * einer Spalte des Seitenbaukastens, und die hat `overflow` und einen eigenen
 * Stapelkontext. Von dort aus lässt sich kein Vollbild aufziehen.
 *
 * Der Link „In neuem Tab öffnen“ steht dauerhaft im Kopf, nicht erst nach
 * einem Fehler: ob eine Seite sich einbetten lässt, entscheiden ihre
 * `X-Frame-Options`, und ein blockiertes iFrame meldet das nicht — es bleibt
 * einfach leer.
 */

import * as React from "react";
import { ReactElement, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import styles from "./styles/page-modal.scss";
import { useHotStyle } from "@shared/hot-style";

export interface PageModalProps {
  href: string;
  title: string;
  onClose: () => void;
}

export function PageModal({ href, title, onClose }: PageModalProps): ReactElement {
  const css = useHotStyle(styles, "hotspot-image-widget", "styles/page-modal.scss");
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    // Ohne das scrollt der Hintergrund unter dem Modal weg, sobald im iFrame
    // das Ende erreicht ist.
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Woher der Fokus kam — dorthin gehört er beim Schließen zurück, sonst
    // steht er am Seitenanfang und die Tastaturbedienung beginnt von vorn.
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
      opener?.focus?.();
    };
  }, [onClose]);

  /**
   * Hält den Fokus im Dialog.
   *
   * Ohne das wandert er beim Tabben hinter das Modal in die Seite darunter,
   * die dort weiterhin steht — und ist von dort nicht mehr zu finden. Das
   * iFrame bleibt außen vor: was darin passiert, entscheidet seine Seite.
   */
  const onPanelKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || panelRef.current === null) return;
    const focusable = panelRef.current.querySelectorAll<HTMLElement>("button, a[href]");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (first === undefined || last === undefined) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <>
      <style>{css}</style>
      <div className="man-hi-modal" data-testid="page-modal-scrim" onClick={onClose}>
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="man-hi-modal__panel"
          // Der Klick im Dialog darf nicht bis zum Hintergrund durchfallen,
          // sonst schlösse jeder Klick im Kopf das Modal.
          onClick={(event) => event.stopPropagation()}
          onKeyDown={onPanelKeyDown}
        >
          <header className="man-hi-modal__head">
            {/* Der Schließen-Knopf steht als Erstes im Markup, weil er den
                Fokus bekommt und der Fokusfang „erstes“ und „letztes“ Element
                aus der Reihenfolge im DOM nimmt. Optisch sitzt er rechts —
                dafür sorgt `order` im Stylesheet. */}
            <button
              ref={closeRef}
              type="button"
              className="man-hi-modal__close"
              aria-label="Schließen"
              onClick={onClose}
            >
              ×
            </button>
            <h2 className="man-hi-modal__title">{title}</h2>
            <a
              className="man-hi-modal__external"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              In neuem Tab öffnen
            </a>
          </header>
          <iframe className="man-hi-modal__frame" src={href} title={title} loading="lazy" />
        </div>
      </div>
    </>,
    document.body,
  );
}
