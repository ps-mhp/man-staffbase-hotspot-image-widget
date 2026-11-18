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
 * Die Mediathek für jedes Bildfeld des Editors: „wählen“ öffnet sie im
 * Rahmen als Leiste rechts (`useMediaPanel`), und jedes Feld nimmt Kacheln
 * aus dieser Leiste auch per Ziehen an (`useMediaDrop`).
 *
 * Über einen Kontext, weil Bühne, Bildfeld und Punktbild tief im Baum sitzen
 * und alle dieselbe Leiste meinen.
 */

import * as React from "react";
import { ReactElement, createContext, useContext } from "react";
import { DropZone } from "@man/config-ui/drop/drop-zone";
import { cn } from "@man/config-ui/primitives/utils";
import { MediaClient } from "@shared/media/media-client";
import { PickedMedia } from "@shared/media/media-picker";
import { useMediaDrop } from "@shared/media/use-media-drop";

import { HotspotImage } from "../points-model";

export interface EditorMedia {
  client: MediaClient;
  /**
   * Öffnet die Mediathek; `title` nennt das Ziel („Icon für Punkt 2“).
   * `onPick` wird beim Öffnen festgehalten und muss deshalb über den
   * jüngsten Stand schreiben.
   */
  pick: (title: string, onPick: (picked: PickedMedia) => void) => void;
}

export const EditorMediaContext = createContext<EditorMedia | null>(null);

export function useEditorMedia(): EditorMedia {
  const media = useContext(EditorMediaContext);
  if (media === null) throw new Error("useEditorMedia braucht einen EditorMediaContext.");
  return media;
}

/**
 * Das Bild aus der Mediathek, mit dem bisherigen Alternativtext: er wurde
 * für dieses Widget geschrieben, der aus der Mediathek nur fürs Bild. Ohne
 * bisheriges Bild gilt der aus der Mediathek.
 */
export function imageFromPick(picked: PickedMedia, previous: HotspotImage | null | undefined): HotspotImage {
  const alt = previous === null || previous === undefined ? (picked.alt ?? "") : previous.alt;
  return {
    url: picked.url,
    alt,
    ...(picked.width === undefined ? {} : { width: picked.width }),
    ...(picked.height === undefined ? {} : { height: picked.height }),
  };
}

/** Der letzte Teil der Adresse – was man als Dateinamen wiedererkennt. */
export function fileNameOf(url: string): string {
  const path = url.split(/[?#]/)[0] ?? "";
  const last = path.split("/").filter((part) => part !== "").pop() ?? url;
  try {
    return decodeURIComponent(last);
  } catch {
    return last;
  }
}

export interface MediaDropProps {
  onPick: (picked: PickedMedia) => void;
  className?: string;
  testId: string;
  children: React.ReactNode;
}

/** Ein Bereich, der Bilder aus der Mediathek-Leiste annimmt; darunter der Fehler des letzten Ablegens. */
export function MediaDrop({ onPick, className, testId, children }: MediaDropProps): ReactElement {
  const { client } = useEditorMedia();
  const drop = useMediaDrop({ client, onPick });
  return (
    <DropZone zone={drop} busy={drop.busy} className={cn("flex flex-col", className)} data-testid={testId}>
      {children}
      {drop.error !== null && (
        <p role="alert" className="text-[13px] text-destructive" data-testid={`${testId}-error`}>
          {drop.error}
        </p>
      )}
    </DropZone>
  );
}
