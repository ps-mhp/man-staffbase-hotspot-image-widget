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
 * Die Hilfe des Fensters in der Leiste des Rahmens. Tasten und den Satz zu
 * „Übernehmen“ ergänzt der Rahmen selbst; hier steht nur, was es nur in
 * diesem Widget gibt.
 */

import * as React from "react";
import { ReactElement } from "react";

import { MAX_POINTS } from "../points-model";

export function HotspotEditorHelp(): ReactElement {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-5" data-testid="hotspot-editor-help">
      <li>
        <strong>Manuell</strong>: jeder Punkt hat einen eigenen Titel, eine Beschreibung, einen Link und
        wahlweise ein Icon. <strong>Aus dem Menü</strong>: die Unterpunkte eines Menüpunkts werden auf dem Bild
        platziert, je Menüebene mit eigenem Bild. Die Punkte des anderen Modus bleiben erhalten.
      </li>
      <li>
        Ein <strong>Klick ins Bild</strong> setzt einen Punkt, Ziehen verschiebt ihn, die Pfeiltasten
        justieren den gewählten um ein Prozent. Höchstens {MAX_POINTS} Punkte je Bild bzw. Ebene.
      </li>
      <li>
        Die <strong>Reihenfolge</strong> der Liste links ist die Nummerierung: am Griff ziehen oder über dem
        Panel rechts nach oben und unten schieben.
      </li>
      <li>
        <strong>Nummern</strong> zeigt neben dem Bild eine aufklappbare Liste der Punkte, <strong>Punkte</strong>{" "}
        nur die Marker – der Text erscheint erst beim Anklicken.
      </li>
      <li>
        Ein Punkt ohne <strong>Titel</strong> ginge beim Speichern verloren; „Übernehmen“ nennt ihn.
      </li>
      <li>
        Im Menü-Modus zeigt ein Eintrag mit Unterpunkten links seine eigene Ebene; ein Eintrag ohne wird zum
        Ziel des nächsten Klicks ins Bild. Punkte, deren Eintrag nicht mehr im Menü steht, erscheinen links
        als Fehler und werden nie von selbst gelöscht.
      </li>
      <li>
        Bilder kommen aus der Mediathek rechts und lassen sich von dort auch direkt auf die Bühne oder ein
        Bildfeld ziehen. Der Name des Bildes in der Leiste über der Bühne zeigt rechts Bild und
        Bildbeschreibung.
      </li>
      <li>Desktop, Tablet und Mobil zeigen die Seite so, wie Lesende sie sehen.</li>
    </ul>
  );
}
