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

import { setPublicPathFromBundle } from "@shared/public-path";

// Muss vor jedem dynamischen `import()` laufen, damit nachgeladene Teile von
// dem CDN kommen, von dem das Bundle stammt, und nicht von der Wirtsseite.
setPublicPathFromBundle("hotspot-image-widget.js");
import React, { ReactElement } from "react";
import ReactDOM from "react-dom/client";

import {
  BlockAttributes,
  BlockFactory,
  BlockDefinition,
  ExternalBlockDefinition,
  BaseBlock,
} from "widget-sdk";
import { startWidget } from "@shared/dev-mode/start-widget";
import {
  DISPLAY_MODE_ATTRIBUTE,
  IMAGE_ATTRIBUTE,
  POINTS_ATTRIBUTE,
  configurationSchema,
  uiSchema,
} from "./configuration-schema";
import { HotspotImage } from "./hotspot-image";
import { parseImage, parsePoints, readDisplayMode } from "./points-model";
import icon from "../resources/hotspot-image-widget.svg";
import pkg from "../package.json";

/**
 * Attribute kommen immer als Zeichenkette an, auch wenn dort JSON steht.
 * Die Namen tragen Bindestriche, wie im Schema.
 */
export type HotspotImageWidgetProps = BlockAttributes & {
  [IMAGE_ATTRIBUTE]?: string;
  [POINTS_ATTRIBUTE]?: string;
  [DISPLAY_MODE_ATTRIBUTE]?: string;
};

export const HotspotImageWidget = (props: HotspotImageWidgetProps): ReactElement | null => (
  <HotspotImage
    image={parseImage(props[IMAGE_ATTRIBUTE] ?? "")}
    points={parsePoints(props[POINTS_ATTRIBUTE] ?? "")}
    mode={readDisplayMode(props[DISPLAY_MODE_ATTRIBUTE])}
  />
);

/** Attribute aus den gleichen Konstanten wie das Konfigurationsschema, um
 *  Abweichungen zu vermeiden: Ein Tippfehler würde sonst zur Laufzeit zu einem
 *  stumm leeren Attribut führen. */
const widgetAttributes: string[] = [IMAGE_ATTRIBUTE, POINTS_ATTRIBUTE, DISPLAY_MODE_ATTRIBUTE];

const factory: BlockFactory = (BaseBlockClass, _widgetApi) => {
  return class HotspotImageWidgetBlock extends BaseBlockClass implements BaseBlock {
    private _root: ReactDOM.Root | null = null;

    private get props(): HotspotImageWidgetProps {
      const attrs = this.parseAttributes<HotspotImageWidgetProps>();
      // Die Sprache steht nicht in den Attributen, sondern am Block selbst.
      // Ohne sie wüsste die Ansicht nicht, in welcher Fassung sie steht.
      return { ...attrs, contentLanguage: this.contentLanguage };
    }

    public renderBlock(container: HTMLElement): void {
      this._root ??= ReactDOM.createRoot(container);
      this._root.render(<HotspotImageWidget {...this.props} />);
    }

    public static get observedAttributes(): string[] {
      return widgetAttributes;
    }

    public attributeChangedCallback(...args: [string, string | undefined, string | undefined]): void {
      super.attributeChangedCallback.apply(this, args);
    }
  };
};

const blockDefinition: BlockDefinition = {
  name: "hotspot-image-widget",
  factory: factory,
  attributes: widgetAttributes,
  blockLevel: "block",
  configurationSchema: configurationSchema,
  uiSchema: uiSchema,
  label: "Bild mit Punkten",
  iconUrl: icon,
};

const externalBlockDefinition: ExternalBlockDefinition = {
  blockDefinition,
  author: pkg.author,
  version: pkg.version,
};

/**
 * Meldet den Baustein bei der Wirtsseite an.
 *
 * Der Weg über `startWidget` fragt zuerst, ob ein lokaler
 * Entwicklungsserver dieses Widget ausliefert. In fast jedem Browser lautet
 * die Antwort nein, und es wird sofort angemeldet; auf dem Rechner der
 * Entwicklung übernimmt das lokale Bundle und meldet an seiner Stelle an.
 * Immer nur eines von beiden — ein Bausteinname lässt sich nicht zweimal
 * belegen.
 *
 * Die Abfrage davor lässt das Modul in Jest laden, wo es keine Wirtsseite
 * gibt: ohne sie bräche schon der blosse Import der Datei jeden Test.
 */
if (typeof window.defineBlock === "function") {
  void startWidget({
    name: "hotspot-image-widget",
    version: pkg.version,
    register: () => {
      window.defineBlock(externalBlockDefinition);
    },
  });
}
