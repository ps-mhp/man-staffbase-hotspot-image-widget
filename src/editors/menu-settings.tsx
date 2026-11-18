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
 * Das Panel „Menü“ rechts, wenn kein Punkt gewählt ist – wie im Screen:
 * Startpunkt, Tiefe und Klickverhalten, darunter das Bild der gezeigten
 * Ebene und ein Hinweis auf Punkte, die nicht mehr im Menü stehen.
 */

import * as React from "react";
import { ReactElement } from "react";
import { Info } from "lucide-react";
import { Field } from "@man/config-ui/form/field";
import { FormSection } from "@man/config-ui/form/form-section";
import type { SegmentedOption } from "@man/config-ui/form/segmented";
import { SegmentedField } from "@man/config-ui/form/segmented-field";
import { Button } from "@man/config-ui/primitives/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@man/config-ui/primitives/select";
import { PickedMedia } from "@shared/media/media-picker";

import { ConfigKey, HotspotConfig } from "../hotspot-config";
import { MAX_MENU_DEPTH, MIN_MENU_DEPTH, MenuClickMode } from "../menu-points-model";
import { HotspotImage } from "../points-model";
import { ImageField } from "./image-field";
import { InheritedNote } from "./inherited-note";
import { StartPointField, StartPointState } from "./start-point-field";

export const MENU_SETTINGS_MESSAGES = {
  title: "Menü",
  depth: "Tiefe",
  depthHint: `${MIN_MENU_DEPTH} bis ${MAX_MENU_DEPTH}, der Startpunkt zählt mit.`,
  depthOption: (depth: number): string => `${depth} Ebenen`,
  click: "Klick auf einen Punkt mit Unterpunkten",
  clickHint: "Punkte ohne Unterpunkte öffnen immer ihre Seite.",
  clickEnter: "Ins Untermenü wechseln",
  clickOpen: "Seite öffnen",
  levelImage: (title: string): string => `Bild der Ebene „${title}“`,
  rootNeedsImage: "Ohne Bild gibt es keine Fläche, auf der Punkte liegen könnten.",
  inherits: "Diese Ebene hat kein eigenes Bild und zeigt das Bild der Ebene darüber. Wähle ein Bild, um hier Punkte zu setzen.",
  placeOnParent: (title: string, parent: string): string => `Punkt für „${title}“ auf „${parent}“ setzen`,
  orphans: (count: number): string =>
    `${count === 1 ? "Ein Punkt gehört" : `${count} Punkte gehören`} zu Einträgen, die im Menü fehlen, verschoben wurden oder tiefer liegen als eingestellt. Sie werden nicht angezeigt; links unter ihrer Ebene lassen sie sich löschen.`,
} as const;

const DEPTHS = Array.from({ length: MAX_MENU_DEPTH - MIN_MENU_DEPTH + 1 }, (_, index) => MIN_MENU_DEPTH + index);

const CLICK_OPTIONS: readonly SegmentedOption<MenuClickMode>[] = [
  { id: "enter", label: MENU_SETTINGS_MESSAGES.clickEnter },
  { id: "open", label: MENU_SETTINGS_MESSAGES.clickOpen },
];

/** Die gezeigte Ebene, soweit der Baum sie schon kennt. */
export interface LevelContext {
  id: string;
  title: string;
  isRoot: boolean;
  image: HotspotImage | null;
  onImageChange: (image: HotspotImage | null) => void;
  onImagePick: (picked: PickedMedia) => void;
  /** Für eine Ebene unter dem Startpunkt: ihren eigenen Punkt auf der Ebene darüber setzen. */
  parent?: { title: string; onPlace: () => void };
}

export interface MenuSettingsProps {
  menu: HotspotConfig["menu"];
  inherited: readonly ConfigKey[];
  onMenuChange: (patch: Partial<HotspotConfig["menu"]>) => void;
  /** Fehlt, solange der Baum nicht geladen ist. */
  level?: LevelContext;
  orphanCount: number;
  startPoint: StartPointState;
}

function DepthField({ depth, onChange }: { depth: number; onChange: (depth: number) => void }): ReactElement {
  return (
    <Select value={String(depth)} onValueChange={(next) => onChange(Number(next))}>
      <Field label={MENU_SETTINGS_MESSAGES.depth} hint={MENU_SETTINGS_MESSAGES.depthHint} className="max-w-[200px]">
        <SelectTrigger className="h-10 w-full cursor-pointer bg-background" data-testid="menu-depth">
          <SelectValue />
        </SelectTrigger>
      </Field>
      <SelectContent position="popper">
        {DEPTHS.map((value) => (
          <SelectItem key={value} value={String(value)}>
            {MENU_SETTINGS_MESSAGES.depthOption(value)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function LevelSection({ level }: { level: LevelContext }): ReactElement {
  const label = MENU_SETTINGS_MESSAGES.levelImage(level.title);
  return (
    <FormSection title={label}>
      <ImageField
        label={label}
        image={level.image}
        onChange={level.onImageChange}
        onPick={level.onImagePick}
        hint={level.image !== null ? undefined : level.isRoot ? MENU_SETTINGS_MESSAGES.rootNeedsImage : MENU_SETTINGS_MESSAGES.inherits}
        testId="level-image"
      />
      {level.parent !== undefined && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start"
          data-testid="level-place-on-parent"
          onClick={level.parent.onPlace}
        >
          {MENU_SETTINGS_MESSAGES.placeOnParent(level.title, level.parent.title)}
        </Button>
      )}
    </FormSection>
  );
}

export function MenuSettings({ menu, inherited, onMenuChange, level, orphanCount, startPoint }: MenuSettingsProps): ReactElement {
  return (
    <div className="flex flex-col gap-6" data-testid="menu-settings">
      <InheritedNote keys={inherited} />
      <StartPointField value={menu.rootId} onChange={(rootId) => onMenuChange({ rootId })} state={startPoint} />
      <DepthField depth={menu.depth} onChange={(depth) => onMenuChange({ depth })} />
      <SegmentedField
        label={MENU_SETTINGS_MESSAGES.click}
        hint={MENU_SETTINGS_MESSAGES.clickHint}
        options={CLICK_OPTIONS}
        value={menu.click}
        onChange={(click) => onMenuChange({ click })}
      />
      {level !== undefined && <LevelSection level={level} />}
      {orphanCount > 0 && (
        <p
          className="flex items-start gap-2.5 rounded-md bg-muted px-3.5 py-3 text-[13px] leading-normal text-muted-foreground"
          data-testid="menu-orphans-note"
        >
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{MENU_SETTINGS_MESSAGES.orphans(orphanCount)}</span>
        </p>
      )}
    </div>
  );
}
