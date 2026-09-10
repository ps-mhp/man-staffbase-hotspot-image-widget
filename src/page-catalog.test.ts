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

import { pageCatalogSource } from "./page-catalog";

describe("pageCatalogSource", () => {
  afterEach(() => jest.restoreAllMocks());

  it("holt die Seiten und macht Optionen mit Adresse daraus", async () => {
    // Antwortform am lebenden System geprüft: `entries` statt `data`, der
    // Titel liegt pro Sprache unter `localization`, und die Adresse im
    // iFrame ist die `menuId` — nicht die `id` der Seite selbst.
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        entries: [
          {
            id: "6aa12fb54e0ac62265cf06f5",
            menuId: "6aa12fb54e0ac62265cf06f6",
            localization: { de_DE: { title: "Laden zu Hause" } },
          },
        ],
      }),
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const raw = await pageCatalogSource.fetchList();
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/branch/pages/search"),
      expect.objectContaining({ credentials: "same-origin" }),
    );
    expect(pageCatalogSource.toOption(raw[0])).toEqual({
      id: "6aa12fb54e0ac62265cf06f5",
      title: "Laden zu Hause",
      href: "/content/page/6aa12fb54e0ac62265cf06f6",
    });
  });

  it("liefert bei einem Fehler eine leere Liste, damit der Dialog bedienbar bleibt", async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({ ok: false, status: 403 }) as unknown as typeof fetch;
    await expect(pageCatalogSource.fetchList()).resolves.toEqual([]);
  });

  it("wirft nicht, wenn das Netz ausfällt", async () => {
    globalThis.fetch = jest.fn().mockRejectedValue(new Error("offline")) as unknown as typeof fetch;
    await expect(pageCatalogSource.fetchList()).resolves.toEqual([]);
  });

  it("verwirft einen Eintrag ohne menuId, weil dafür keine Adresse zu bilden ist", () => {
    expect(
      pageCatalogSource.toOption({ id: "1", localization: { de_DE: { title: "Ohne Adresse" } } }),
    ).toBeNull();
  });
});
