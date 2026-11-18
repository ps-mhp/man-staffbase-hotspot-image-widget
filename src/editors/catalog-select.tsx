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
 * Eine Auswahl aus einem Katalog (Seiten, Startpunkte im Menü) mit dem
 * Ausweg „von Hand eingeben …“ – gebaut aus `Field` und `Select` von
 * `@man/config-ui`, damit Label, Pflichtmarke und Hinweis verdrahtet sind wie
 * in jedem anderen Widget.
 *
 * Ob statt der Auswahl ein Eingabefeld dasteht, entscheidet der Aufrufer:
 * er weiss, was „von Hand“ bei ihm heisst (Adresse oder Menü-ID). Hier gibt
 * es nur die Auswahl und den Ruf `onManual`.
 */

import * as React from "react";
import { ReactElement } from "react";
import { Field } from "@man/config-ui/form/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@man/config-ui/primitives/select";

export interface CatalogOption {
  id: string;
  title: string;
  disabled?: boolean;
}

export interface CatalogSelectProps {
  label: string;
  hint?: React.ReactNode;
  required?: boolean;
  options: readonly CatalogOption[];
  loading: boolean;
  /**
   * Die gewählte Kennung. `null` heisst „nichts“ (mit `noneLabel` als eigene
   * Option); eine Kennung, die der Katalog nicht kennt, zeigt den Platzhalter.
   */
  value: string | null;
  placeholder: string;
  /** Eine eigene Option für „nichts“, etwa „Kein Link“. */
  noneLabel?: string;
  manualLabel: string;
  onSelect: (id: string | null) => void;
  onManual: () => void;
  testId: string;
}

/** Radix kennt keinen leeren Wert für eine Option. */
const NONE_VALUE = "__none__";
const MANUAL_VALUE = "__manual__";

export function CatalogSelect({
  label,
  hint,
  required,
  options,
  loading,
  value,
  placeholder,
  noneLabel,
  manualLabel,
  onSelect,
  onManual,
  testId,
}: CatalogSelectProps): ReactElement {
  const known = value !== null && options.some((option) => option.id === value);
  const selected = known ? value : value === null && noneLabel !== undefined ? NONE_VALUE : "";
  return (
    <Select
      value={selected}
      disabled={loading}
      onValueChange={(next) => {
        if (next === MANUAL_VALUE) onManual();
        else onSelect(next === NONE_VALUE ? null : next);
      }}
    >
      <Field label={label} hint={hint} required={required}>
        <SelectTrigger className="h-10 w-full cursor-pointer bg-background" data-testid={testId}>
          <SelectValue placeholder={loading ? "Wird geladen …" : placeholder} />
        </SelectTrigger>
      </Field>
      <SelectContent position="popper" className="max-h-80">
        {noneLabel !== undefined && <SelectItem value={NONE_VALUE}>{noneLabel}</SelectItem>}
        {options.map((option) => (
          <SelectItem key={option.id} value={option.id} disabled={option.disabled}>
            {option.title}
          </SelectItem>
        ))}
        <SelectSeparator />
        <SelectItem value={MANUAL_VALUE}>{manualLabel}</SelectItem>
      </SelectContent>
    </Select>
  );
}
