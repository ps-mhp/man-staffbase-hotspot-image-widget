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
 * Ein Menübaum für die Prüfungen des Modus „Menü“, wie ihn `loadMenuTree`
 * liefert — ohne Netz, auf das Nötige verkürzt.
 *
 * Fahrerhaus
 * ├─ Fahrerarbeitsplatz
 * │  ├─ Lenkrad
 * │  └─ Sitz
 * ├─ Ruhebereich
 * ├─ Ausstattung (Ordner ohne Seite)
 * │  └─ Kühlbox
 * └─ Händlersuche (extern)
 */

import { MenuEntry } from "@shared/staffbase/menu";
import { MenuTree, MenuTreeLocation, MenuTreeNode } from "@shared/staffbase/menu-tree";

export const IDS = {
  fahrerhaus: "6a58dd4eefeacc1239d9fd09",
  arbeitsplatz: "6a73580860fe1414378d4660",
  lenkrad: "6a7356f0ab285900f44007b8",
  sitz: "6a7356f0ab285900f44007b9",
  ruhe: "6a7358b8340cb013d7f29611",
  ausstattung: "69a142424125962a49b62566",
  kuehlbox: "69a142424125962a49b62567",
  haendler: "69a142424125962a49b62568",
} as const;

const entry = (id: string, title: string, extra: Partial<MenuEntry> = {}): MenuEntry => ({
  id,
  title,
  href: `/openlink/content/page/${id}`,
  external: false,
  hasChildren: false,
  hidden: false,
  ...extra,
});

const node = (self: MenuEntry, children: MenuTreeNode[] = []): MenuTreeNode => ({
  entry: { ...self, hasChildren: children.length > 0 || self.hasChildren },
  children,
});

export function buildTree(): MenuTree {
  const root = node(entry(IDS.fahrerhaus, "Fahrerhaus"), [
    node(entry(IDS.arbeitsplatz, "Fahrerarbeitsplatz"), [
      node(entry(IDS.lenkrad, "Lenkrad")),
      node(entry(IDS.sitz, "Sitz")),
    ]),
    node(entry(IDS.ruhe, "Ruhebereich")),
    node(entry(IDS.ausstattung, "Ausstattung", { href: null }), [node(entry(IDS.kuehlbox, "Kühlbox"))]),
    node(entry(IDS.haendler, "Händlersuche", { href: "https://haendler.example/", external: true })),
  ]);

  const index = new Map<string, MenuTreeLocation>();
  const walk = (current: MenuTreeNode, path: string[]): void => {
    const own = [...path, current.entry.id];
    index.set(current.entry.id, { node: current, path: own });
    current.children.forEach((child) => walk(child, own));
  };
  walk(root, []);
  return { root, index };
}
