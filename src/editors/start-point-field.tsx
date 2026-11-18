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
 * Der Startpunkt im Menü: dieselbe eingerückte Liste wie in der Navigation,
 * oder — fehlt der Eintrag dort — die Adresse einer Seite bzw. die Menü-ID
 * von Hand.
 */

import * as React from "react";
import { ReactElement, useEffect, useState } from "react";
import { CatalogSelect } from "@man/config-ui/form/catalog-select";
import { Field } from "@man/config-ui/form/field";
import { Button } from "@man/config-ui/primitives/button";
import { Input } from "@man/config-ui/primitives/input";
import { EntityOption } from "@shared/entity-picker/entity-catalog";
import { readMenuId } from "@shared/staffbase/menu";
import { fetchStartPointOptions } from "@shared/staffbase/menu-start-points";

export const START_POINT_MESSAGES = {
  label: "Startpunkt",
  hint: "Der Menüpunkt, dessen Unterpunkte die erste Ebene bilden.",
  placeholder: "Startpunkt auswählen …",
  manualOption: "Andere Menü-ID eingeben …",
  unavailableNotice: "Das Menü konnte nicht geladen werden. Bitte die Adresse der Seite oder die Menü-ID eintragen.",
  manualLabel: "Adresse der Seite oder Menü-ID",
  backToList: "Stattdessen aus der Liste wählen",
} as const;

/**
 * Was das Feld über das Neuzeichnen hinaus behalten muss: die geladene Liste
 * und ob gerade von Hand getippt wird. Liegt beim Aufrufer, weil der
 * Menü-Modus seinen Rumpf neu aufbaut, sobald der Startpunkt wechselt – das
 * Feld verlöre sonst bei jedem Tastendruck, was getippt ist, und lüde die
 * Liste (bis zu 150 Anfragen) neu.
 */
export interface StartPointState {
  options: EntityOption[];
  loading: boolean;
  manual: boolean;
  setManual: (manual: boolean) => void;
  typed: string;
  setTyped: (typed: string) => void;
}

export function useStartPointState(
  initial: string | null,
  load: () => Promise<EntityOption[]> = fetchStartPointOptions,
): StartPointState {
  const [list, setList] = useState<{ options: EntityOption[]; loading: boolean }>({ options: [], loading: true });
  const [manual, setManual] = useState(false);
  const [typed, setTyped] = useState(initial ?? "");
  useEffect(() => {
    let current = true;
    load().then(
      (options) => current && setList({ options, loading: false }),
      () => current && setList({ options: [], loading: false }),
    );
    return () => {
      current = false;
    };
  }, [load]);
  return { ...list, manual, setManual, typed, setTyped };
}

export interface StartPointFieldProps {
  value: string | null;
  onChange: (rootId: string | null) => void;
  state: StartPointState;
}

export function StartPointField({ value, onChange, state }: StartPointFieldProps): ReactElement {
  const { options, loading, manual, setManual, typed, setTyped } = state;

  // Ein gespeicherter Startpunkt, den die Liste nicht kennt, steht in der Eingabe —
  // sonst sähe er aus wie „nichts gewählt“, und der nächste Klick überschriebe ihn.
  const known = value === null || options.some((option) => option.id === value);
  const typing = manual || (!loading && (!known || options.length === 0));

  if (!typing) {
    return (
      <CatalogSelect
        label={START_POINT_MESSAGES.label}
        hint={START_POINT_MESSAGES.hint}
        required
        options={options}
        loading={loading}
        value={value}
        placeholder={START_POINT_MESSAGES.placeholder}
        manualLabel={START_POINT_MESSAGES.manualOption}
        onSelect={(id) => onChange(readMenuId(id ?? ""))}
        onManual={() => setManual(true)}
        data-testid="start-point-select"
      />
    );
  }

  return (
    <div className="flex flex-col gap-2" data-testid="start-point-field">
      <Field
        label={START_POINT_MESSAGES.label}
        required
        hint={options.length === 0 ? START_POINT_MESSAGES.unavailableNotice : START_POINT_MESSAGES.hint}
      >
        <Input
          type="text"
          className="h-10"
          placeholder={START_POINT_MESSAGES.manualLabel}
          data-testid="start-point-manual"
          value={typed}
          onChange={(event) => {
            setTyped(event.target.value);
            onChange(readMenuId(event.target.value));
          }}
        />
      </Field>
      {options.length > 0 && (
        <Button type="button" variant="ghost" size="sm" className="self-start" onClick={() => setManual(false)}>
          {START_POINT_MESSAGES.backToList}
        </Button>
      )}
    </div>
  );
}
