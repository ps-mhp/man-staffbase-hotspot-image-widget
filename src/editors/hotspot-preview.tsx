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
 * Die Vorschau des Entwurfs in den Ansichten Desktop, Tablet und Mobil: die
 * echte Leseansicht (`HotspotImage` bzw. `MenuHotspotImage`), keine
 * Nachbildung.
 *
 * Die Bühne ist `inert`: kein Klick, kein Fokus – also öffnet sich weder ein
 * Punkt (dessen Fenster an `document` lauschte) noch eine verlinkte Seite.
 * Der Menü-Modus fragt den Menübaum wie der Editor; das liest nur.
 *
 * Der Gerätrahmen ist kein iframe. Die Leseansicht bricht deshalb nach
 * ihrer eigenen Breite um (`@container man-hi`, `use-narrow-width.ts`),
 * nicht nach der des Fensters – so zeigt „Mobil“ die schmale Darstellung
 * des Telefons.
 */

import * as React from "react";
import { ReactElement } from "react";

import { HotspotConfig } from "../hotspot-config";
import { HotspotImage } from "../hotspot-image";
import { MenuHotspotImage } from "../menu/menu-hotspot-image";
import { MenuTreeLoader } from "../menu/use-menu-tree";

export interface HotspotPreviewProps {
  config: HotspotConfig;
  /** Nur für Tests. */
  loadTree?: MenuTreeLoader;
}

/** Ob die Leseansicht überhaupt etwas zeigt – sonst ein Satz statt einer leeren Fläche. */
function showsSomething(config: HotspotConfig): boolean {
  if (config.source === "manual") return config.image !== null && config.manual.points.length > 0;
  const anyImage = config.image !== null || Object.values(config.menu.layout).some((level) => level.image !== undefined);
  return anyImage && config.menu.rootId !== null;
}

export function HotspotPreview({ config, loadTree }: HotspotPreviewProps): ReactElement {
  if (!showsSomething(config)) {
    return (
      <p className="p-6 text-sm text-muted-foreground" data-testid="hotspot-preview-empty">
        {config.source === "manual"
          ? "Ohne Bild und Punkte zeigt das Widget auf der Seite nichts."
          : "Ohne Startpunkt und Bild zeigt das Widget auf der Seite nichts."}
      </p>
    );
  }
  return (
    <div inert className="p-6" data-testid="hotspot-preview">
      {config.source === "manual" ? (
        <HotspotImage image={config.image} points={config.manual.points} mode={config.manual.mode} />
      ) : (
        <MenuHotspotImage
          image={config.image}
          layout={config.menu.layout}
          rootId={config.menu.rootId}
          depth={config.menu.depth}
          click={config.menu.click}
          loadTree={loadTree}
        />
      )}
    </div>
  );
}
