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
 * Wie der Text der Punkte durch Staffbases Inhaltsübersetzung reist.
 *
 * `POST /api/translations` übersetzt Textknoten und lässt Attribute
 * unangetastet. Titel, Beschreibung und Buttonbeschriftung stecken hier aber
 * im Attribut `points` — sie werden deshalb in ein kleines Dokument verpackt,
 * in dem jedes Feld ein eigener Knoten mit `data-point`/`data-field` ist, und
 * danach wieder herausgelesen. Vorbild: `hero-slider-widget/src/translation-payload.ts`.
 *
 * Koordinaten (`x`, `y`), die Kennung `id` und `link.href` reisen nicht mit:
 * das sind keine Sprache, und `link.href` verweist ausserdem auf eine Seite
 * des Systems, deren Adresse eine Übersetzung nur zerstören könnte.
 */

import { HotspotLink, HotspotPoint, linkLabel } from "./points-model";

/** Die Felder, die je Punkt übersetzt werden. */
type FieldName = "title" | "description" | "linkLabel";

/**
 * Baut das übersetzbare Dokument über `document.createElement` statt über
 * einen zusammengesetzten String: der Browser übernimmt damit das Maskieren
 * von `<`, `&` und Anführungszeichen in Titeln und Beschreibungen. Ein Titel
 * mit `<` reisst so das Dokument nicht auf.
 */
export function pointsToTranslatable(points: HotspotPoint[]): string {
  const container = document.createElement("div");

  points.forEach((point) => {
    const pointElement = document.createElement("section");
    pointElement.setAttribute("data-point", point.id);

    const addField = (name: FieldName, text: string | undefined): void => {
      if (text === undefined || text.trim() === "") return;
      const field = document.createElement("p");
      field.setAttribute("data-field", name);
      field.textContent = text;
      pointElement.appendChild(field);
    };

    addField("title", point.title);
    addField("description", point.description);
    // Nicht `link.label`, sondern die Beschriftung, die wirklich am Button
    // steht. Ohne eigene Beschriftung greift `DEFAULT_LINK_LABEL` -- die
    // steckt im Bundle statt im Attribut und käme sonst nie in die
    // Übersetzung. Unter jedem Punkt einer übersetzten Seite stünde dann
    // weiterhin ein deutsches „Seite öffnen".
    addField("linkLabel", point.link === undefined ? undefined : linkLabel(point.link));

    container.appendChild(pointElement);
  });

  return container.innerHTML;
}

/** Alle übersetzten Felder eines Punktes, gekeyt nach `data-field`. */
function readFields(html: string, pointId: string): Map<FieldName, string> {
  const fields = new Map<FieldName, string>();
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, "text/html");
  const pointElement = doc.body.querySelector(`[data-point="${CSS.escape(pointId)}"]`);
  if (pointElement === null) return fields;

  pointElement.querySelectorAll("[data-field]").forEach((element) => {
    const name = element.getAttribute("data-field");
    if (name !== "title" && name !== "description" && name !== "linkLabel") return;
    fields.set(name, element.textContent ?? "");
  });
  return fields;
}

/**
 * Nimmt den übersetzten Text an, ausser der Dienst hat ihn verloren.
 *
 * Fremder Text ist nicht vertrauenswürdig: fehlt ein Feld oder ein ganzer
 * Punkt im übersetzten Dokument, bleibt das Original stehen statt einer
 * Lücke in der Bühne.
 */
const pick = (
  fields: ReadonlyMap<FieldName, string>,
  name: FieldName,
  source: string | undefined,
): string | undefined => {
  const translated = fields.get(name);
  if (translated === undefined) return source;
  return translated.trim() === "" ? source : translated;
};

const withTranslatedLink = (
  link: HotspotLink | undefined,
  fields: ReadonlyMap<FieldName, string>,
): HotspotLink | undefined => {
  if (link === undefined) return undefined;
  // Rückfallwert ist `link.label`, nicht die Vorgabe: kam nichts zurück, war
  // auch nichts zu übersetzen. Die Vorgabe hier einzusetzen schriebe das
  // deutsche „Seite öffnen" fest ins Attribut, ohne dass es jemand gesetzt hat.
  const label = pick(fields, "linkLabel", link.label);
  return label === undefined ? { ...link } : { ...link, label };
};

/**
 * Liest die übersetzten Punkte zurück.
 *
 * `points` ist das Original, aus dem `id`, `x`, `y` und `link.href` jedes
 * Punktes unverändert übernommen werden — ein unbekanntes `data-point` im
 * übersetzten Dokument erfindet deshalb keinen neuen Punkt, ein fehlendes
 * löscht keinen vorhandenen.
 */
export function pointsFromTranslated(html: string, points: HotspotPoint[]): HotspotPoint[] {
  return points.map((point) => {
    const fields = readFields(html, point.id);
    const title = pick(fields, "title", point.title) ?? point.title;
    const description = pick(fields, "description", point.description);
    const link = withTranslatedLink(point.link, fields);

    const next: HotspotPoint = { ...point, title };
    if (description === undefined) delete next.description;
    else next.description = description;
    if (link === undefined) delete next.link;
    else next.link = link;
    return next;
  });
}
