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
 * Die Seiten des Systems für den Link-Picker.
 *
 * Nur Seiten von hier landen später im iFrame: eine Adresse aus dieser Liste
 * liegt in derselben Herkunft, lässt sich also einbetten. Alles von Hand
 * Eingetragene geht in einen neuen Tab.
 */

import { EntityCatalogSource, EntityOption } from "@shared/entity-picker/entity-catalog";
import { pickLocalizedTitle } from "@shared/entity-picker/localized-title";

export interface PageOption extends EntityOption {
  /** Die Adresse, die das iFrame lädt. */
  href: string;
}

/**
 * Am lebenden System geprüft (`npm run browser`, siehe `page-catalog.test.ts`):
 * dieselbe Suche, die die Seitenübersicht im Studio benutzt. Ein `data`-Feld
 * mit einer fertigen `url` je Seite, wie es die Spec-Vorlage annahm, gibt es
 * nicht — die Adresse fürs iFrame muss aus der `menuId` gebaut werden.
 */
export const PAGES_ENDPOINT = "/api/branch/pages/search";

/**
 * Wie viele Seiten der Picker anbietet.
 *
 * Neueste zuerst, aus demselben Grund wie im Formular-Katalog: der
 * Abschneidepunkt trifft dann am ehesten, wonach eine Redaktion ohnehin nicht
 * mehr sucht.
 */
const CATALOG_LIMIT = 100;

interface RawPage {
  id?: unknown;
  /** Der Schlüssel, aus dem die Adresse `/content/page/{menuId}` entsteht. */
  menuId?: unknown;
  localization?: Record<string, { title?: unknown }>;
}

interface CatalogResponse {
  entries?: unknown;
}

/**
 * Wie der Picker seine Seitenliste bekommt.
 *
 * `fetchEntityCatalog(pageCatalogSource)` ist der eigentliche Aufruf im
 * Editor; dieses Objekt beschreibt nur Woher und Wie der Abbildung.
 */
export const pageCatalogSource: EntityCatalogSource<RawPage> = {
  async fetchList(): Promise<RawPage[]> {
    const query = new URLSearchParams({
      query: "",
      orderBy: "UPDATED_DESC",
      limit: String(CATALOG_LIMIT),
    });

    try {
      const response = await fetch(`${PAGES_ENDPOINT}?${query}`, {
        credentials: "same-origin",
        headers: { Accept: "application/json" },
      });
      // Ein Fehler hier darf den Dialog nicht anhalten: ohne Katalog bleibt
      // die Eingabe von Hand, und die reicht zum Arbeiten.
      if (!response.ok) return [];
      const body = (await response.json()) as CatalogResponse;
      // Auf die Form der Antwort ist kein Verlass: `fetchEntityCatalog` ruft
      // gleich `.map` darauf, und das liegt dort ausserhalb des Fangnetzes.
      // Ein Feld, das keine Liste ist, risse also den ganzen Dialog mit.
      return Array.isArray(body?.entries) ? (body.entries as RawPage[]) : [];
    } catch {
      return [];
    }
  },

  toOption(page: RawPage): PageOption | null {
    // Auch hier gilt kein Vertrauen in die Form: `toOption` laeuft in
    // `fetchEntityCatalog` ungeschuetzt, ein Zugriff auf `null` waere das Ende
    // des Dialogs statt eines fehlenden Listeneintrags.
    if (typeof page !== "object" || page === null) return null;
    const id = page.id;
    const menuId = page.menuId;
    // Ohne `menuId` ließe sich keine Adresse bilden — ein solcher Eintrag
    // taugt für den Picker nicht.
    if (typeof id !== "string" || id === "") return null;
    if (typeof menuId !== "string" || menuId === "") return null;

    return {
      id,
      title: pickLocalizedTitle(page.localization) ?? id,
      href: `/content/page/${menuId}`,
    };
  },
};
