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
 * Der manuelle Modus im Rahmen von `@man/config-ui`, wie im Screen:
 * links die Punkte (sortierbar, „Neuer Punkt“), in der Mitte das Bild auf der
 * Bühne zum Setzen und Schieben, rechts der gewählte Punkt – oder, ist keiner
 * gewählt, das Bild mit seiner Beschreibung.
 *
 * Gesteuert von aussen: die Konfiguration gehört dem Fenster
 * (`hotspot-editor.tsx`), hier liegt nur die Auswahl.
 */

import * as React from "react";
import { ReactElement, useEffect, useState } from "react";
import { InspectorPanel } from "@man/config-ui/inspector/inspector-panel";
import { ConfigWorkspace } from "@man/config-ui/layout/config-workspace";
import { useConfigShell } from "@man/config-ui/shell/shell-context";
import { ItemActions } from "@man/config-ui/sidebar/item-actions";
import { SidebarFootnote } from "@man/config-ui/sidebar/sidebar-footnote";
import { SidebarPanel } from "@man/config-ui/sidebar/sidebar-panel";
import { PickedMedia } from "@shared/media/media-picker";

import { isUntitled } from "../editor-rules";
import { HotspotImage, HotspotPoint, MAX_POINTS, emptyPoint } from "../points-model";
import { CanvasBar } from "./canvas-bar";
import { CanvasStage } from "./canvas-stage";
import { fileNameOf, imageFromPick, useEditorMedia } from "./editor-media";
import { HotspotPreview } from "./hotspot-preview";
import { ImageField } from "./image-field";
import { InheritedNote } from "./inherited-note";
import { PageLoader } from "./link-field";
import { duplicatePoint, freeSpot, movePoint, reorderPoints } from "./manual-points";
import { ModeEditorProps } from "./mode-props";
import { PlacementCanvas } from "./placement-canvas";
import { PointForm } from "./point-form";
import { iconFromPick } from "./point-icon-field";
import { PointList } from "./point-list";

export const MANUAL_MESSAGES = {
  points: "Punkte",
  add: "Neuer Punkt",
  sidebarHint: "Klick ins Bild setzt einen neuen Punkt. Punkte lassen sich im Bild ziehen.",
  image: "Bild",
  needsImage: "Ohne Bild gibt es keine Fläche, auf der Punkte liegen könnten. Ein Bild lässt sich auch aus der Mediathek hierher ziehen.",
  full: `Mehr als ${MAX_POINTS} Punkte trägt ein Bild nicht.`,
  count: (count: number): string => `${count} von ${MAX_POINTS} Punkten`,
  stageHint: "Ziehen verschiebt, Pfeiltasten justieren den gewählten Punkt.",
  pickPoint: "Wähle links einen Punkt, um Titel, Text, Link und Icon zu bearbeiten. Ein Klick ins Bild setzt einen neuen.",
  noImage: "Kein Bild",
} as const;

export interface ManualEditorProps extends ModeEditorProps {
  /** Nur für Tests. */
  loadPages?: PageLoader;
}

type Points = HotspotPoint[];

/** Nach einem gescheiterten „Übernehmen“: den ersten Punkt ohne Titel zeigen. */
function useShowFirstUntitled(points: readonly HotspotPoint[], select: (id: string) => void): void {
  const { issuesVisible } = useConfigShell();
  const firstUntitled = points.find(isUntitled)?.id;
  useEffect(() => {
    if (issuesVisible && firstUntitled !== undefined) select(firstUntitled);
  }, [issuesVisible, firstUntitled, select]);
}

export function ManualEditor({ config, inherited, update, onSourceChange, loadPages }: ManualEditorProps): ReactElement {
  const { issuesVisible } = useConfigShell();
  const media = useEditorMedia();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [full, setFull] = useState(false);
  const points = config.manual.points;
  const index = points.findIndex((point) => point.id === selectedId);
  const selected = index === -1 ? null : points[index];
  useShowFirstUntitled(points, setSelectedId);

  const setPoints = (change: (points: Points) => Points): void =>
    update((current) => ({ ...current, manual: { ...current.manual, points: change(current.manual.points) } }));
  const setImage = (image: HotspotImage | null): void => update((current) => ({ ...current, image }));
  const pickImage = (picked: PickedMedia): void =>
    update((current) => ({ ...current, image: imageFromPick(picked, current.image) }));
  const openImagePicker = (): void => media.pick(MANUAL_MESSAGES.image, pickImage);

  const add = (x: number, y: number): void => {
    if (points.length >= MAX_POINTS) {
      setFull(true);
      return;
    }
    const point = emptyPoint(x, y);
    setPoints((current) => [...current, point]);
    setSelectedId(point.id);
  };
  const remove = (id: string): void => {
    setPoints((current) => current.filter((point) => point.id !== id));
    setSelectedId(null);
    setFull(false);
  };
  const duplicate = (id: string): void => {
    const result = duplicatePoint(points, id);
    if (result === null) return;
    setPoints(() => result.points);
    setSelectedId(result.copy.id);
  };
  const changePoint = (point: HotspotPoint): void =>
    setPoints((current) => current.map((entry) => (entry.id === point.id ? point : entry)));
  const pickIcon = (pointId: string) => (picked: PickedMedia): void =>
    setPoints((current) =>
      current.map((entry) => (entry.id === pointId ? { ...entry, icon: iconFromPick(picked, entry.icon) } : entry)),
    );

  const sidebar = (
    <SidebarPanel
      title={MANUAL_MESSAGES.points}
      count={points.length}
      max={MAX_POINTS}
      addLabel={MANUAL_MESSAGES.add}
      onAdd={() => {
        const spot = freeSpot(points);
        add(spot.x, spot.y);
      }}
      footer={<SidebarFootnote>{MANUAL_MESSAGES.sidebarHint}</SidebarFootnote>}
    >
      <PointList
        points={points}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onReorder={(ids) => setPoints((current) => reorderPoints(current, ids))}
        issuesVisible={issuesVisible}
      />
    </SidebarPanel>
  );

  const inspector =
    selected === null ? (
      <InspectorPanel title={MANUAL_MESSAGES.image}>
        <div className="flex flex-col gap-6" data-testid="image-settings">
          <InheritedNote keys={inherited} />
          <ImageField
            label={MANUAL_MESSAGES.image}
            image={config.image}
            onChange={setImage}
            onPick={pickImage}
            hint={config.image === null ? MANUAL_MESSAGES.needsImage : undefined}
            testId="manual-image"
          />
          <p className="text-[13px] text-muted-foreground">{MANUAL_MESSAGES.pickPoint}</p>
        </div>
      </InspectorPanel>
    ) : (
      <InspectorPanel
        title={`Punkt ${index + 1}`}
        actions={
          <ItemActions
            noun="Punkt"
            onMoveBack={() => setPoints((current) => movePoint(current, selected.id, -1))}
            onMoveForward={() => setPoints((current) => movePoint(current, selected.id, 1))}
            canMoveBack={index > 0}
            canMoveForward={index < points.length - 1}
            onDuplicate={() => duplicate(selected.id)}
            canDuplicate={points.length < MAX_POINTS}
            onDelete={() => remove(selected.id)}
          />
        }
      >
        <PointForm
          // Je Punkt eine eigene Instanz: Link und Startpunkt halten
          // Oberflächenzustand, der nicht in den nächsten Punkt gehört.
          key={selected.id}
          point={selected}
          number={index + 1}
          onChange={changePoint}
          onPickIcon={pickIcon(selected.id)}
          issuesVisible={issuesVisible}
          loadPages={loadPages}
        />
      </InspectorPanel>
    );

  const image = config.image;
  return (
    <ConfigWorkspace
      className="min-h-0 flex-1"
      sidebar={sidebar}
      inspector={inspector}
      preview={<HotspotPreview config={config} />}
    >
      <div className="flex h-full min-h-0 flex-col" data-testid="manual-editor">
        <CanvasBar
          source="manual"
          onSourceChange={onSourceChange}
          imageLabel={image === null ? MANUAL_MESSAGES.noImage : `Bild: ${fileNameOf(image.url)}`}
          settingsShown={selected === null}
          onShowSettings={() => setSelectedId(null)}
          pickLabel={image === null ? "Bild wählen" : "Bild ändern"}
          onPick={openImagePicker}
          display={{
            value: config.manual.mode,
            onChange: (mode) => update((current) => ({ ...current, manual: { ...current.manual, mode } })),
          }}
        />
        <CanvasStage
          empty={image === null}
          emptyText={MANUAL_MESSAGES.needsImage}
          onPickClick={openImagePicker}
          onDrop={pickImage}
          status={full ? MANUAL_MESSAGES.full : MANUAL_MESSAGES.count(points.length)}
          hint={image === null ? undefined : MANUAL_MESSAGES.stageHint}
        >
          {image !== null && (
            <PlacementCanvas
              image={image}
              points={points}
              selectedId={selectedId}
              label={`${image.alt === "" ? "Bild" : image.alt} mit ${points.length} Punkten`}
              onAdd={add}
              onMove={(pointId, x, y) =>
                setPoints((current) => current.map((point) => (point.id === pointId ? { ...point, x, y } : point)))
              }
              onSelect={setSelectedId}
            />
          )}
        </CanvasStage>
      </div>
    </ConfigWorkspace>
  );
}

