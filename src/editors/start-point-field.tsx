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

import { EntityOption } from "@shared/entity-picker/entity-catalog";
import { EntityPicker } from "@shared/entity-picker/entity-picker";
import { readMenuId } from "@shared/staffbase/menu";
import { fetchStartPointOptions } from "@shared/staffbase/menu-start-points";

export const START_POINT_MESSAGES = {
  label: "Startpunkt im Menü",
  placeholder: "Startpunkt auswählen …",
  manualOption: "Andere Menü-ID eingeben …",
  unavailableNotice: "Das Menü konnte nicht geladen werden. Bitte die Adresse der Seite oder die Menü-ID eintragen.",
  manualLabel: "Adresse der Seite oder Menü-ID",
  backToList: "Stattdessen aus der Liste wählen",
} as const;

export interface StartPointFieldProps {
  value: string | null;
  onChange: (rootId: string | null) => void;
  /** Nur für Tests. */
  loadOptions?: () => Promise<EntityOption[]>;
}

export function StartPointField({
  value,
  onChange,
  loadOptions = fetchStartPointOptions,
}: StartPointFieldProps): ReactElement {
  const [options, setOptions] = useState<EntityOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [manual, setManual] = useState(false);
  const [typed, setTyped] = useState(value ?? "");

  useEffect(() => {
    let current = true;
    loadOptions().then(
      (loaded) => {
        if (!current) return;
        setOptions(loaded);
        setLoading(false);
      },
      () => {
        if (current) setLoading(false);
      },
    );
    return () => {
      current = false;
    };
  }, [loadOptions]);

  // Ein gespeicherter Startpunkt, den die Liste nicht kennt, steht in der Eingabe —
  // sonst sähe er aus wie „nichts gewählt“, und der nächste Klick überschriebe ihn.
  const known = value === null || options.some((option) => option.id === value);
  const typing = manual || (!loading && !known);

  return (
    <div className="man-hie__label" data-testid="start-point-field">
      {START_POINT_MESSAGES.label}
      {typing ? (
        <>
          <input
            className="man-hie__input"
            type="text"
            aria-label={START_POINT_MESSAGES.manualLabel}
            placeholder={START_POINT_MESSAGES.manualLabel}
            value={typed}
            onChange={(event) => {
              setTyped(event.target.value);
              onChange(readMenuId(event.target.value));
            }}
          />
          {options.length > 0 && (
            <button type="button" className="man-hie__button" onClick={() => setManual(false)}>
              {START_POINT_MESSAGES.backToList}
            </button>
          )}
        </>
      ) : loading ? null : (
        <EntityPicker
          options={options}
          value={value ?? ""}
          onChange={(id) => onChange(readMenuId(id))}
          onManual={() => setManual(true)}
          labels={START_POINT_MESSAGES}
        />
      )}
    </div>
  );
}
