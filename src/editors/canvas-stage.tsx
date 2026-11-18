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
 * Die graue Bühne unter der Leiste: das Bild mittig oben, mit Luft rundum;
 * ohne Bild eine gestrichelte Fläche „Bild wählen“. Die ganze Bühne nimmt
 * Bilder aus der Mediathek-Leiste per Ziehen an. Darunter die Statuszeile.
 */

import * as React from "react";
import { ReactElement } from "react";
import { StatusBar } from "@man/config-ui/toolbar/status-bar";
import { PickedMedia } from "@shared/media/media-picker";

import { MediaDrop } from "./editor-media";

export interface CanvasStageProps {
  /** Die Bühne mit Bild, oder `null` für die leere Fläche. */
  children: React.ReactNode;
  empty: boolean;
  /** Was die leere Fläche sagt, etwa warum es ohne Bild nicht geht. */
  emptyText: string;
  onPickClick?: () => void;
  onDrop?: (picked: PickedMedia) => void;
  status: React.ReactNode;
  hint?: React.ReactNode;
}

const STAGE = "min-h-0 flex-1 items-center overflow-auto rounded-none bg-stage p-6";

function EmptyStage({ text, onPick }: { text: string; onPick?: () => void }): ReactElement {
  return (
    <div className="flex w-full max-w-[680px] flex-col items-center gap-3 rounded-md border border-dashed border-primary-soft-border bg-primary-soft/60 px-6 py-16 text-center">
      {onPick !== undefined && (
        <button
          type="button"
          className="cursor-pointer rounded-md px-3 py-2 text-sm font-semibold text-primary outline-none hover:bg-primary-soft focus-visible:ring-[3px] focus-visible:ring-ring/40"
          data-testid="canvas-empty-pick"
          onClick={onPick}
        >
          Bild wählen
        </button>
      )}
      <p className="max-w-sm text-[13px] text-muted-foreground" data-testid="canvas-empty-text">
        {text}
      </p>
    </div>
  );
}

export function CanvasStage({ children, empty, emptyText, onPickClick, onDrop, status, hint }: CanvasStageProps): ReactElement {
  const content = empty ? <EmptyStage text={emptyText} onPick={onPickClick} /> : children;
  return (
    <>
      {onDrop === undefined ? (
        <div className={`flex flex-col ${STAGE}`}>{content}</div>
      ) : (
        <MediaDrop className={STAGE} testId="canvas-drop" onPick={onDrop}>
          {content}
        </MediaDrop>
      )}
      <StatusBar data-testid="canvas-status" start={status} end={hint} />
    </>
  );
}
