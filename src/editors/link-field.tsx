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
 * Der Abschnitt „Link“ eines Punkts: Ziel und Beschriftung des Buttons.
 *
 * `kind` ist nicht redaktionell wählbar, sondern folgt daraus, woher die
 * Adresse kam: eine Seite aus dem Katalog liegt in derselben Herkunft und
 * lässt sich einbetten, eine von Hand eingetragene nicht. Ein Auswahlfeld
 * „im iFrame anzeigen?“ wäre eine Frage, die niemand beantworten kann, ohne
 * die `X-Frame-Options` der Zielseite zu kennen.
 *
 * Das Ziel ist eine Auswahl: „Kein Link“, die Seiten des Systems, „Eigene
 * Adresse eingeben …“. Die Eingabe von Hand ist bewusst nur
 * Oberflächenzustand, bis jemand tippt: kommt der Katalog leer zurück (auch
 * wenn die Anfrage bloss fehlschlug), stünde sonst ein bestehender
 * Seitenlink beim blossen Öffnen ohne Adresse und Titel da.
 */

import * as React from "react";
import { ReactElement, useEffect, useState } from "react";
import { Field } from "@man/config-ui/form/field";
import { FormSection } from "@man/config-ui/form/form-section";
import { Button } from "@man/config-ui/primitives/button";
import { Input } from "@man/config-ui/primitives/input";
import { fetchEntityCatalog } from "@shared/entity-picker/entity-catalog";
import { PageOption, pageCatalogSource } from "@shared/staffbase/pages";

import { DEFAULT_LINK_LABEL, HotspotLink } from "../points-model";
import { CatalogSelect } from "./catalog-select";

export const LINK_MESSAGES = {
  section: "Link",
  target: "Ziel",
  none: "Kein Link",
  placeholder: "Seite auswählen …",
  manual: "Eigene Adresse eingeben …",
  address: "Adresse",
  addressHint: "Eigene Adressen öffnen sich in neuem Tab. Nur Seiten aus dem System erscheinen im Fenster über dem Bild.",
  unavailable: "Die Seiten des Systems lassen sich gerade nicht laden. Trage die Adresse von Hand ein.",
  backToList: "Stattdessen eine Seite wählen",
  remove: "Link entfernen",
  label: "Beschriftung des Buttons",
  labelHint: `Leer bleibt es bei „${DEFAULT_LINK_LABEL}“.`,
  orphaned: (href: string): string => `Die gespeicherte Seite steht nicht in der Liste: ${href}`,
} as const;

/** Die Seiten des Systems; austauschbar für Tests. */
export type PageLoader = () => Promise<PageOption[]>;

// `fetchEntityCatalog` gibt `EntityOption[]` zurück; das zusätzliche `href`
// überlebt zur Laufzeit, ist für TypeScript aber weg. Die Zusicherung ist
// vertretbar, weil `pageCatalogSource.toOption` als einziger Erzeuger immer
// ein `href` setzt.
const loadPages: PageLoader = () => fetchEntityCatalog(pageCatalogSource) as Promise<PageOption[]>;

export interface LinkFieldProps {
  link: HotspotLink | undefined;
  onChange: (link: HotspotLink | undefined) => void;
  /** Nur für Tests. */
  load?: PageLoader;
}

function usePages(load: PageLoader): { options: PageOption[]; loading: boolean } {
  const [state, setState] = useState<{ options: PageOption[]; loading: boolean }>({ options: [], loading: true });
  useEffect(() => {
    let current = true;
    load().then(
      (options) => current && setState({ options, loading: false }),
      () => current && setState({ options: [], loading: false }),
    );
    return () => {
      current = false;
    };
  }, [load]);
  return state;
}

const withLabel = (link: HotspotLink | undefined): Pick<HotspotLink, "label"> =>
  link?.label === undefined ? {} : { label: link.label };

interface ManualProps {
  link: HotspotLink | undefined;
  unavailable: boolean;
  onChange: (link: HotspotLink | undefined) => void;
  onBack: (() => void) | undefined;
}

/** Die eigene Adresse: geschrieben wird erst, wenn getippt wird. */
function ManualAddress({ link, unavailable, onChange, onBack }: ManualProps): ReactElement {
  return (
    <>
      <Field label={LINK_MESSAGES.address} hint={unavailable ? LINK_MESSAGES.unavailable : LINK_MESSAGES.addressHint}>
        <Input
          type="url"
          className="h-10"
          placeholder="https://"
          data-testid="link-field-address"
          value={link?.href ?? ""}
          onChange={(event) => onChange({ kind: "url", href: event.target.value, ...withLabel(link) })}
        />
      </Field>
      <div className="flex flex-wrap gap-2">
        {onBack !== undefined && (
          <Button type="button" variant="ghost" size="sm" onClick={onBack}>
            {LINK_MESSAGES.backToList}
          </Button>
        )}
        {link !== undefined && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => onChange(undefined)}
          >
            {LINK_MESSAGES.remove}
          </Button>
        )}
      </div>
    </>
  );
}

export function LinkField({ link, onChange, load = loadPages }: LinkFieldProps): ReactElement {
  const { options, loading } = usePages(load);
  const [manual, setManual] = useState(false);
  const unavailable = !loading && options.length === 0;
  const typing = manual || link?.kind === "url" || unavailable;
  const chosen = link?.kind === "page" ? options.find((option) => option.href === link.href) : undefined;
  /**
   * Ein gespeicherter Seitenlink, den der Katalog nicht kennt – die Seite
   * wurde gelöscht, oder die Liste kam unvollständig. Ohne Hinweis stünde die
   * Aufforderung „Seite auswählen …“ da, als wäre nie etwas gesetzt worden.
   */
  const orphaned = !loading && link?.kind === "page" && link.href !== "" && chosen === undefined;

  const pickPage = (id: string | null): void => {
    if (id === null) {
      onChange(undefined);
      return;
    }
    const option = options.find((candidate) => candidate.id === id);
    if (option !== undefined) onChange({ kind: "page", href: option.href, title: option.title, ...withLabel(link) });
  };

  const backToList = (): void => {
    setManual(false);
    // Zurück zur Liste heisst: die eigene Adresse gilt nicht mehr. Anders als
    // das Umschalten ist das eine ausdrückliche Handlung, also darf sie schreiben.
    if (link?.kind === "url") onChange({ kind: "page", href: "", ...withLabel(link) });
  };

  return (
    <FormSection title={LINK_MESSAGES.section}>
      {typing ? (
        <ManualAddress
          link={link}
          unavailable={unavailable}
          onChange={onChange}
          onBack={options.length > 0 ? backToList : undefined}
        />
      ) : (
        <CatalogSelect
          label={LINK_MESSAGES.target}
          hint={orphaned && link !== undefined ? LINK_MESSAGES.orphaned(link.href) : undefined}
          options={options}
          loading={loading}
          value={link === undefined ? null : (chosen?.id ?? "")}
          placeholder={LINK_MESSAGES.placeholder}
          noneLabel={LINK_MESSAGES.none}
          manualLabel={LINK_MESSAGES.manual}
          onSelect={pickPage}
          onManual={() => setManual(true)}
          testId="link-field-target"
        />
      )}
      {link !== undefined && (
        <Field label={LINK_MESSAGES.label} hint={LINK_MESSAGES.labelHint}>
          <Input
            type="text"
            className="h-10"
            placeholder={DEFAULT_LINK_LABEL}
            data-testid="link-field-label"
            value={link.label ?? ""}
            onChange={(event) => onChange({ ...link, label: event.target.value })}
          />
        </Field>
      )}
    </FormSection>
  );
}
