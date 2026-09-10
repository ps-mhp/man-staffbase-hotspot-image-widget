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

const mockStartWidget = jest.fn().mockResolvedValue(undefined);
const mockStartInjector = jest.fn(() => () => undefined);

jest.mock("@shared/dev-mode/start-widget", () => ({ startWidget: mockStartWidget }));
jest.mock("./point-editor-injector", () => ({ startPointEditorInjector: mockStartInjector }));

interface Host {
  defineBlock: jest.Mock;
}

describe("Anmeldung des Widgets", () => {
  it("startet den Editor erst beim Anmelden, nicht schon beim Laden des Moduls", async () => {
    // Auf Modulebene gestartet belegte der Beobachter des installierten
    // Bundles das Feld, bevor überhaupt gefragt war, ob ein lokaler Server
    // übernimmt -- der Entwicklungsmodus lieferte dann die Ansicht, aber den
    // Editor der veröffentlichten Fassung. Live nachgewiesen am 02.09.2026 im
    // Hero-Slider-Widget.
    const host = window as unknown as Host;
    host.defineBlock = jest.fn();

    jest.resetModules();
    await import("./index");

    expect(mockStartInjector).not.toHaveBeenCalled();

    const options = mockStartWidget.mock.calls[0][0] as { register: () => void };
    options.register();

    expect(mockStartInjector).toHaveBeenCalled();
    expect(host.defineBlock).toHaveBeenCalled();
  });
});
