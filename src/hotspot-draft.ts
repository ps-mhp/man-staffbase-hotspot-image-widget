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
 * Der Entwurf im Fenster: die Konfiguration und die Schlüssel, die sie nur
 * vorläufig trägt.
 *
 * Vorläufig („geerbt“) ist ein Schlüssel, dessen alten Wert das Fenster beim
 * Öffnen nicht lesen konnte – im Content Designer haben Auswahlfelder kein
 * `.value`, das Bild ist ein Upload ohne Eingabefeld. Im Entwurf steht dann
 * die Vorgabe, geschrieben wird der Schlüssel aber nicht: beim Lesen gilt
 * weiter das alte Feld. So verändert Öffnen und Übernehmen keinen Block.
 * Erst wer den Wert im Fenster ändert, macht ihn zum eigenen.
 */

import {
  CONFIG_KEYS,
  ConfigKey,
  ConfigParts,
  DEFAULT_CONFIG,
  HotspotConfig,
  LEGACY_FIELDS_OF,
  configFromLegacy,
  encodeConfig,
  mergeParts,
  parseConfigParts,
} from "./hotspot-config";
import type { LegacyRead } from "./legacy-fields";

export interface HotspotDraft {
  config: HotspotConfig;
  /** Schlüssel, die beim Übernehmen wegbleiben, weil ihr alter Wert nicht lesbar war. */
  inherited: readonly ConfigKey[];
}

/** Der Wert eines Schlüssels, zum Vergleichen. */
export function valueAt(config: HotspotConfig, key: ConfigKey): unknown {
  switch (key) {
    case "source":
      return config.source;
    case "image":
      return config.image;
    case "manual.mode":
      return config.manual.mode;
    case "manual.points":
      return config.manual.points;
    case "menu.rootId":
      return config.menu.rootId;
    case "menu.depth":
      return config.menu.depth;
    case "menu.click":
      return config.menu.click;
    case "menu.layout":
      return config.menu.layout;
  }
}

const same = (a: unknown, b: unknown): boolean => a === b || JSON.stringify(a) === JSON.stringify(b);

/** Die Schlüssel, in denen sich zwei Konfigurationen unterscheiden. */
export function changedKeys(before: HotspotConfig, after: HotspotConfig): ConfigKey[] {
  return CONFIG_KEYS.filter((key) => !same(valueAt(before, key), valueAt(after, key)));
}

/** Eine neue Fassung des Entwurfs: was sich geändert hat, ist nicht mehr geerbt. */
export function changeConfig(draft: HotspotDraft, next: HotspotConfig): HotspotDraft {
  if (draft.inherited.length === 0) return { config: next, inherited: draft.inherited };
  const changed = new Set(changedKeys(draft.config, next));
  return { config: next, inherited: draft.inherited.filter((key) => !changed.has(key)) };
}

/** Was in `config` geschrieben wird – ohne die geerbten Schlüssel. */
export function serializeDraft(draft: HotspotDraft): string {
  return encodeConfig(draft.config, draft.inherited);
}

/** Welche Schlüssel aus nicht lesbaren alten Feldern kommen. */
function unreadableKeys(read: LegacyRead): ConfigKey[] {
  return CONFIG_KEYS.filter((key) => LEGACY_FIELDS_OF[key].some((field) => read.unreadable.includes(field)));
}

/**
 * Der Entwurf beim Öffnen: je Schlüssel `config`, sonst das alte Feld aus dem
 * Dialog. Geerbt bleibt, was weder in `config` steht noch lesbar war.
 */
export function draftFromSources(parts: ConfigParts | null, read: LegacyRead): HotspotDraft {
  const legacy = configFromLegacy(read.attrs);
  const own = parts ?? {};
  const config = mergeParts(own, legacy);
  const inherited = unreadableKeys(read).filter((key) => own[key] === undefined);
  const withImage = read.previewImage !== null && inherited.includes("image") ? { ...config, image: read.previewImage } : config;
  return { config: withImage, inherited };
}

/** Wie {@link draftFromSources}, aus dem Rohwert von `config`. */
export function parseDraft(raw: string, read: LegacyRead): HotspotDraft {
  return draftFromSources(parseConfigParts(raw), read);
}

/** Ein leerer Entwurf, etwa für Tests und Vorschauen. */
export const EMPTY_DRAFT: HotspotDraft = { config: DEFAULT_CONFIG, inherited: [] };
