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

import { useCallback, useEffect, useState } from "react";

import { MenuTree, loadMenuTree } from "@shared/staffbase/menu-tree";

export type MenuTreeLoader = (rootId: string, depth: number) => Promise<MenuTree | null>;

export type MenuTreeState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; tree: MenuTree }
  | { status: "error"; retry: () => void };

interface Settled {
  key: string;
  tree: MenuTree | null;
}

const defaultLoader: MenuTreeLoader = (rootId, depth) => loadMenuTree(rootId, depth);

/**
 * Der Teilbaum des Menüs ab `rootId`; ohne Startknoten (`null`) wird nichts
 * gefragt. Ein Fehlschlag bleibt nicht hängen: `retry` fragt neu — die
 * Ebenen-Ablage in `menu.ts` behält Fehlschläge nicht.
 */
export function useMenuTree(rootId: string | null, depth: number, load: MenuTreeLoader = defaultLoader): MenuTreeState {
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<Settled | null>(null);
  const key = `${rootId}#${depth}#${attempt}`;

  useEffect(() => {
    if (rootId === null) return;
    let current = true;
    load(rootId, depth).then(
      (tree) => {
        if (current) setSettled({ key, tree });
      },
      () => {
        if (current) setSettled({ key, tree: null });
      },
    );
    return () => {
      current = false;
    };
  }, [rootId, depth, key, load]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  if (rootId === null) return { status: "idle" };
  if (settled?.key !== key) return { status: "loading" };
  return settled.tree === null ? { status: "error", retry } : { status: "ready", tree: settled.tree };
}
