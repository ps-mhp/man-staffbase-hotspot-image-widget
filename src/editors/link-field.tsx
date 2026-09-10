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
 * Das Ziel eines Punktes.
 *
 * `kind` ist nicht redaktionell wählbar, sondern folgt daraus, woher die
 * Adresse kam: eine Seite aus dem Katalog liegt in derselben Herkunft und
 * lässt sich einbetten, eine von Hand eingetragene nicht. Ein Auswahlfeld
 * „im iFrame anzeigen?" wäre eine Frage, die niemand beantworten kann, ohne
 * die `X-Frame-Options` der Zielseite zu kennen.
 */

import * as React from "react";
import { ReactElement, useCallback, useEffect, useState } from "react";

import { fetchEntityCatalog } from "@shared/entity-picker/entity-catalog";
import { EntityPicker } from "@shared/entity-picker/entity-picker";

import { DEFAULT_LINK_LABEL, HotspotLink } from "../points-model";
import { PageOption, pageCatalogSource } from "../page-catalog";

export interface LinkFieldProps {
  link: HotspotLink | undefined;
  onChange: (link: HotspotLink | undefined) => void;
}

export function LinkField({ link, onChange }: LinkFieldProps): ReactElement {
  const [options, setOptions] = useState<PageOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let current = true;
    // `fetchEntityCatalog` gibt `EntityOption[]` zurück; das zusätzliche `href`
    // überlebt zur Laufzeit, ist für TypeScript aber weg. Die Zusicherung ist
    // vertretbar, weil `pageCatalogSource.toOption` als einziger Erzeuger
    // immer ein `href` setzt.
    void fetchEntityCatalog(pageCatalogSource).then((loaded) => {
      if (!current) return;
      setOptions(loaded as PageOption[]);
      setLoading(false);
    });
    return () => {
      current = false;
    };
  }, []);

  const toManual = useCallback(() => {
    // Von Hand eingetragene Adressen gehen in einen neuen Tab. Der Titel gilt
    // nur für Seiten aus dem System und wird deshalb fallen gelassen.
    onChange({ kind: "url", href: "", ...(link?.label === undefined ? {} : { label: link.label }) });
  }, [link?.label, onChange]);

  if (link === undefined) {
    return (
      <div className="man-hie__form">
        <button
          type="button"
          className="man-hie__button"
          onClick={() => onChange({ kind: "page", href: "" })}
        >
          Link hinzufügen
        </button>
      </div>
    );
  }

  const chosen = options.find((option) => option.href === link.href);

  const pickPage = (id: string): void => {
    const option = options.find((candidate) => candidate.id === id);
    if (option === undefined) return;
    onChange({
      kind: "page",
      href: option.href,
      title: option.title,
      ...(link.label === undefined ? {} : { label: link.label }),
    });
  };

  return (
    <div className="man-hie__form">
      {link.kind === "page" ? (
        <label className="man-hie__label">
          Ziel
          {/*
            Solange der Katalog unterwegs ist, steht hier nichts: der Picker
            ruft `onManual`, sobald er keine Optionen sieht -- und das täte er
            beim ersten Rendern jedes Mal, noch bevor die Liste da ist.
          */}
          {loading ? null : (
            <EntityPicker
              options={options}
              value={chosen?.id ?? ""}
              loading={loading}
              onChange={pickPage}
              onManual={toManual}
              labels={{
                placeholder: "Seite auswählen …",
                manualOption: "Eigene Adresse eingeben …",
                unavailableNotice:
                  "Die Seiten des Systems lassen sich gerade nicht laden. Trage die Adresse von Hand ein.",
              }}
            />
          )}
        </label>
      ) : (
        <>
          <label className="man-hie__label">
            Adresse
            <input
              className="man-hie__input"
              type="url"
              value={link.href}
              onChange={(event) =>
                onChange({
                  kind: "url",
                  href: event.target.value,
                  ...(link.label === undefined ? {} : { label: link.label }),
                })
              }
            />
          </label>
          <p className="man-hie__hint">
            Eigene Adressen öffnen sich in neuem Tab. Nur Seiten aus dem System
            erscheinen im Fenster über dem Bild.
          </p>
          <button
            type="button"
            className="man-hie__button"
            onClick={() =>
              onChange({
                kind: "page",
                href: "",
                ...(link.label === undefined ? {} : { label: link.label }),
              })
            }
          >
            Stattdessen eine Seite auswählen
          </button>
        </>
      )}

      <label className="man-hie__label">
        Beschriftung des Buttons
        <input
          className="man-hie__input"
          type="text"
          placeholder={DEFAULT_LINK_LABEL}
          value={link.label ?? ""}
          onChange={(event) => onChange({ ...link, label: event.target.value })}
        />
      </label>

      <button type="button" className="man-hie__button" onClick={() => onChange(undefined)}>
        Link entfernen
      </button>
    </div>
  );
}
