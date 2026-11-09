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

import { act, renderHook } from "@testing-library/react";

import { ImageLevel } from "./menu-levels";
import { prefetchImages, useSettledImageLevel } from "./use-settled-image";

const level = (levelId: string, url: string): ImageLevel => ({ levelId, image: { url, alt: "" } });
const A = level("a", "https://example.test/a.jpg");
const B = level("b", "https://example.test/b.jpg");

/** Ein Ladevorgang je Adresse, den der Test von Hand abschliesst. */
function controlDecode(): Map<string, () => void> {
  const pending = new Map<string, () => void>();
  jest.spyOn(window, "Image").mockImplementation(() => {
    const img = { src: "", decode: () => new Promise<void>((resolve) => pending.set(img.src, resolve)) };
    return img as unknown as HTMLImageElement;
  });
  return pending;
}

afterEach(() => jest.restoreAllMocks());

describe("useSettledImageLevel", () => {
  it("zeigt das erste Bild sofort", () => {
    controlDecode();
    const { result } = renderHook(() => useSettledImageLevel(A));

    expect(result.current).toBe(A);
  });

  it("hält das alte Bild, bis das neue dekodiert ist", async () => {
    const pending = controlDecode();
    const { result, rerender } = renderHook(({ target }) => useSettledImageLevel(target), {
      initialProps: { target: A as ImageLevel | null },
    });

    rerender({ target: B });
    expect(result.current).toBe(A);

    await act(async () => pending.get(B.image.url)?.());
    expect(result.current).toBe(B);
  });

  it("nimmt ein Bild, das sich nicht dekodieren lässt, trotzdem — sonst hinge die Ansicht", async () => {
    jest.spyOn(window, "Image").mockImplementation(
      () => ({ src: "", decode: () => Promise.reject(new Error("kaputt")) }) as unknown as HTMLImageElement,
    );
    const { result, rerender } = renderHook(({ target }) => useSettledImageLevel(target), {
      initialProps: { target: A as ImageLevel | null },
    });

    rerender({ target: B });
    await act(async () => undefined);

    expect(result.current).toBe(B);
  });

  it("wechselt ohne Warten, wenn nur die Ebene wechselt, das Bild aber bleibt", () => {
    controlDecode();
    const sameImage = { ...A, levelId: "c" };
    const { result, rerender } = renderHook(({ target }) => useSettledImageLevel(target), {
      initialProps: { target: A as ImageLevel | null },
    });

    rerender({ target: sameImage });

    expect(result.current).toBe(sameImage);
  });

  it("lässt ein überholtes Laden fallen", async () => {
    const pending = controlDecode();
    const C = level("c", "https://example.test/c.jpg");
    const { result, rerender } = renderHook(({ target }) => useSettledImageLevel(target), {
      initialProps: { target: A as ImageLevel | null },
    });

    rerender({ target: B });
    rerender({ target: C });
    await act(async () => pending.get(B.image.url)?.());
    expect(result.current).toBe(A);

    await act(async () => pending.get(C.image.url)?.());
    expect(result.current).toBe(C);
  });
});

describe("prefetchImages", () => {
  it("lädt jede Adresse einmal vor", () => {
    const created: string[] = [];
    jest.spyOn(window, "Image").mockImplementation(() => {
      const img = {
        set src(value: string) {
          created.push(value);
        },
      };
      return img as unknown as HTMLImageElement;
    });

    prefetchImages(["https://example.test/a.jpg", "https://example.test/b.jpg", "https://example.test/a.jpg"]);

    expect(created).toEqual(["https://example.test/a.jpg", "https://example.test/b.jpg"]);
  });
});
