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
 * Was der Konfigurationsdialog zeigt: ein einziges Fenster am Feld `config`,
 * die einzelnen Felder älterer Fassungen ausgeblendet.
 *
 * Ist `config` noch leer, beginnt das Fenster mit dem, was die alten Felder
 * tragen. Erst „Übernehmen“ schreibt es nach `config`; bis dahin gilt für die
 * Leseansicht weiter, was in den alten Feldern steht.
 */

import * as React from "react";

import { startFieldModalInjector } from "@shared/config-modal";

import { CONFIG_ATTRIBUTE, LEGACY_ATTRIBUTES } from "./configuration-schema";
import { readConfigValue } from "./editors/config-values";
import { HotspotEditor } from "./editors/hotspot-editor";
import { readImageAttribute } from "./editors/use-image-attribute";
import { HotspotConfig, LegacyAttributes, configFromLegacy, encodeConfig, parseConfig } from "./hotspot-config";
import { startHiddenFields } from "./legacy-fields";

/** Die alten Felder, wie der Dialog sie gerade führt. */
export function readLegacyFromDialog(): HotspotConfig {
  const attrs: LegacyAttributes = Object.fromEntries(
    LEGACY_ATTRIBUTES.flatMap((key) => {
      const raw = readConfigValue(key);
      return raw === null ? [] : [[key, raw]];
    }),
  );
  const config = configFromLegacy(attrs);
  // Im Content Designer ist `image` ein Upload ohne Eingabefeld; das Bild steht
  // dort nur in seiner Vorschau.
  const image = config.image ?? readImageAttribute();
  const alt = attrs["image-alt"]?.trim() ?? "";
  return { ...config, image: image === null ? null : { ...image, alt: alt === "" ? image.alt : alt } };
}

export function startHotspotDialog(): () => void {
  const stopModal = startFieldModalInjector<HotspotConfig>({
    fieldKey: CONFIG_ATTRIBUTE,
    root: document,
    reopenLabel: "Bild mit Punkten bearbeiten …",
    parse: (raw) => parseConfig(raw) ?? readLegacyFromDialog(),
    serialize: encodeConfig,
    render: (props) => React.createElement(HotspotEditor, props),
    modalTestId: "hotspot-editor-modal",
    reopenTestId: "hotspot-editor-reopen",
    panelClassName: "max-w-[1080px]",
  });
  const stopHiding = startHiddenFields(LEGACY_ATTRIBUTES);
  return () => {
    stopModal();
    stopHiding();
  };
}
