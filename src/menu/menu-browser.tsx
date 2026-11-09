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
 * Das blätternde Menü neben dem Bild: eine Ebene zur Zeit, vor per Pfeil,
 * zurück per Knopf in der Kopfzeile oder — auf dem Telefon — per Wischen.
 *
 * Nach dem Vorbild des Navigation-Widgets 0.1.0 (`navigation-menu.tsx`, Stand
 * ec746db). Anders als dort ist der Baum schon geladen, bis zur eingestellten
 * Tiefe: ein Pfeil steht nur, wo der Baum Kinder hat, und Blättern fragt
 * nichts mehr nach. Wohin geblättert ist, hält das Bild darüber — ein Punkt
 * kann das Menü zu seinem Eintrag blättern lassen.
 */

import React, { useLayoutEffect, useRef } from "react";

import { MenuEntry } from "@shared/staffbase/menu";
import { MenuTree, MenuTreeNode } from "@shared/staffbase/menu-tree";

import { MenuMark } from "./menu-highlight";
import { useSwipeBack } from "./use-swipe-back";

export const MENU_MESSAGES = {
  empty: "Hier gibt es keine weiteren Einträge.",
  back: "Zurück: ",
  newTab: " (öffnet in neuem Tab)",
  openChildren: (title: string): string => `Unterpunkte von ${title}`,
} as const;

export type MenuDirection = "none" | "forward" | "back";

/** Ein Eintrag, den das Menü zeigen soll; `seq` zählt, damit derselbe zweimal wirkt. */
export interface MenuReveal {
  id: string;
  seq: number;
}

export interface MenuBrowserProps {
  tree: MenuTree;
  /** Die IDs der Ebenen unterhalb des Startknotens, in die geblättert ist. */
  trail: readonly string[];
  direction: MenuDirection;
  onNavigate: (trail: string[], direction: Exclude<MenuDirection, "none">) => void;
  /** Was für den Punkt unter dem Zeiger markiert ist. */
  mark: MenuMark | null;
  /** Der zuletzt über einen Punkt gezeigte Eintrag; bleibt markiert. */
  reveal: MenuReveal | null;
  onRowHover: (id: string | null) => void;
}

/** Wohin der Fokus nach dem Blättern gehört — nur, wenn jemand geblättert hat. */
type FocusTarget = { kind: "back" } | { kind: "entry"; id: string };

const Chevron = ({ direction }: { direction: "left" | "right" }): React.JSX.Element => (
  <svg className="man-hi-menu__chevron" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
    <path d={direction === "right" ? "M9 5l7 7-7 7" : "M15 5l-7 7 7 7"} />
  </svg>
);

function EntryLink({ entry, className }: { entry: MenuEntry; className: string }): React.JSX.Element {
  return (
    <a
      className={className}
      href={entry.href ?? undefined}
      target={entry.external ? "_blank" : undefined}
      rel={entry.external ? "noopener noreferrer" : undefined}
    >
      <span className="man-hi-menu__title">{entry.title}</span>
      {entry.external && <span className="man-hi-menu__sr-only">{MENU_MESSAGES.newTab}</span>}
    </a>
  );
}

interface MenuRowProps {
  node: MenuTreeNode;
  marked: boolean;
  onOpen: (node: MenuTreeNode) => void;
  onHover: (id: string | null) => void;
}

/**
 * Eine Zeile: der Titel führt auf die Seite, der Pfeil eine Ebene tiefer.
 * Ein Ordner ohne Seite blättert als ganze Zeile; hat er auf dieser Tiefe
 * keine Kinder mehr, steht nur sein Titel da.
 */
function MenuRow({ node, marked, onOpen, onHover }: MenuRowProps): React.JSX.Element {
  const { entry } = node;
  const hasChildren = node.children.length > 0;
  const className = `man-hi-menu__item${marked ? " man-hi-menu__item--marked" : ""}`;

  const content = (() => {
    if (entry.href === null) {
      return hasChildren ? (
        <button type="button" className="man-hi-menu__row" data-entry-id={entry.id} onClick={() => onOpen(node)}>
          <span className="man-hi-menu__title">{entry.title}</span>
          <Chevron direction="right" />
        </button>
      ) : (
        // Fokussierbar nur per Skript: „Im Menü zeigen“ muss auch hier landen können.
        <span className="man-hi-menu__label" tabIndex={-1}>
          <span className="man-hi-menu__title">{entry.title}</span>
        </span>
      );
    }
    return (
      <>
        <EntryLink entry={entry} className="man-hi-menu__link" />
        {hasChildren && (
          <button
            type="button"
            className="man-hi-menu__open"
            data-entry-id={entry.id}
            aria-label={MENU_MESSAGES.openChildren(entry.title)}
            onClick={() => onOpen(node)}
          >
            <Chevron direction="right" />
          </button>
        )}
      </>
    );
  })();

  return (
    <li
      className={className}
      data-row-id={entry.id}
      data-testid={`menu-row-${entry.id}`}
      // Zeiger statt Maus: ein Telefon schickt nach dem Antippen ein
      // nachgeahmtes `mouseenter`, aber kein `mouseleave` (siehe `hotspot-list.tsx`).
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") onHover(entry.id);
      }}
      onPointerLeave={() => onHover(null)}
      onFocus={() => onHover(entry.id)}
      onBlur={() => onHover(null)}
    >
      {content}
    </li>
  );
}

export function MenuBrowser({
  tree,
  trail,
  direction,
  onNavigate,
  mark,
  reveal,
  onRowHover,
}: MenuBrowserProps): React.JSX.Element {
  const rootRef = useRef<HTMLElement>(null);
  const focusTarget = useRef<FocusTarget | null>(null);

  const currentId = trail.length > 0 ? trail[trail.length - 1] : null;
  const current = (currentId === null ? undefined : tree.index.get(currentId)?.node) ?? tree.root;
  const atTop = current === tree.root;

  const open = (node: MenuTreeNode): void => {
    focusTarget.current = { kind: "back" };
    onNavigate([...trail, node.entry.id], "forward");
  };

  const back = (): void => {
    if (atTop) return;
    focusTarget.current = { kind: "entry", id: current.entry.id };
    onNavigate(trail.slice(0, -1), "back");
  };

  useSwipeBack(rootRef, !atTop, back);

  // Wer blättert, landet mit dem Fokus auf der neuen Ebene — vorwärts auf dem
  // Zurück-Knopf, zurück auf dem Pfeil, über den er gekommen ist. Sonst stünde
  // der Fokus auf einem Element, das es nicht mehr gibt.
  useLayoutEffect(() => {
    const target = focusTarget.current;
    const root = rootRef.current;
    if (target === null || root === null) return;
    // Die IDs sind geprüfte Staffbase-IDs (`menu.ts`), im Selektor also harmlos.
    const selector = target.kind === "back" ? ".man-hi-menu__back" : `[data-entry-id="${target.id}"]`;
    focusTarget.current = null;
    root.querySelector<HTMLElement>(selector)?.focus();
  });

  // Nach „Im Menü zeigen“ steht der Fokus auf dem gezeigten Eintrag — sonst
  // erführe, wer nicht sieht, nicht, wohin das Menü geblättert hat. Den
  // Startknoten vertritt der Link der Kopfzeile.
  const revealSeq = reveal?.seq;
  const revealId = reveal?.id;
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (revealSeq === undefined || revealId === undefined || root === null) return;
    const element = root.querySelector<HTMLElement>(
      `[data-row-id="${revealId}"] a, [data-row-id="${revealId}"] button, [data-row-id="${revealId}"] .man-hi-menu__label`,
    ) ?? root.querySelector<HTMLElement>(".man-hi-menu__header a");
    if (element === null) return;
    element.focus();
    element.scrollIntoView?.({ block: "nearest" });
  }, [revealSeq, revealId]);

  const revealedId = reveal?.id ?? null;
  const rowMarked = (id: string): boolean => (mark?.kind === "row" && mark.id === id) || revealedId === id;
  const headerMarked = mark?.kind === "header" || (revealedId !== null && revealedId === current.entry.id);
  const label = tree.root.entry.title;

  return (
    <nav className="man-hi-menu" aria-label={label} ref={rootRef} data-testid="menu-browser">
      <div key={`${trail.length}:${current.entry.id}`} className={`man-hi-menu__panel man-hi-menu__panel--${direction}`}>
        <div className={`man-hi-menu__header${headerMarked ? " man-hi-menu__header--marked" : ""}`}>
          {atTop ? (
            <span className="man-hi-menu__heading" role="heading" aria-level={2}>
              {tree.root.entry.href === null ? (
                tree.root.entry.title
              ) : (
                <EntryLink entry={tree.root.entry} className="man-hi-menu__heading-link" />
              )}
            </span>
          ) : (
            <button type="button" className="man-hi-menu__back" onClick={back}>
              <Chevron direction="left" />
              <span className="man-hi-menu__heading">
                <span className="man-hi-menu__sr-only">{MENU_MESSAGES.back}</span>
                {current.entry.title}
              </span>
            </button>
          )}
        </div>
        {current.children.length === 0 ? (
          <p className="man-hi-menu__status">{MENU_MESSAGES.empty}</p>
        ) : (
          <ul className="man-hi-menu__list">
            {current.children.map((node) => (
              <MenuRow
                key={node.entry.id}
                node={node}
                marked={rowMarked(node.entry.id)}
                onOpen={open}
                onHover={onRowHover}
              />
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}
