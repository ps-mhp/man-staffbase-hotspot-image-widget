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

import * as React from "react";
import { useState } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { MENU_MESSAGES, MenuBrowser, MenuDirection } from "./menu-browser";
import { IDS, buildTree } from "./menu-tree-test-data";
import { SWIPE_THRESHOLD } from "./use-swipe-back";

const tree = buildTree();

function Harness({ onRowHover = jest.fn() }: { onRowHover?: (id: string | null) => void }): React.JSX.Element {
  const [state, setState] = useState<{ trail: string[]; direction: MenuDirection }>({ trail: [], direction: "none" });
  return (
    <MenuBrowser
      tree={tree}
      trail={state.trail}
      direction={state.direction}
      onNavigate={(trail, direction) => setState({ trail, direction })}
      mark={null}
      reveal={null}
      onRowHover={onRowHover}
    />
  );
}

const touch = (x: number, y = 100) => ({
  touches: [{ clientX: x, clientY: y }],
  changedTouches: [{ clientX: x, clientY: y }],
});

describe("MenuBrowser", () => {
  it("zeigt oben den Startknoten als Überschrift und Link, darunter seine Kinder", () => {
    render(<Harness />);

    const heading = screen.getByRole("heading", { name: "Fahrerhaus" });
    expect(within(heading).getByRole("link")).toHaveAttribute("href", `/openlink/content/page/${IDS.fahrerhaus}`);
    expect(screen.getByRole("navigation", { name: "Fahrerhaus" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual([
      "Fahrerarbeitsplatz",
      "Ruhebereich",
      "Ausstattung",
      `Händlersuche${MENU_MESSAGES.newTab}`,
    ]);
  });

  it("zeigt den Pfeil nur, wo der Baum Kinder hat", () => {
    render(<Harness />);

    expect(screen.getByRole("button", { name: MENU_MESSAGES.openChildren("Fahrerarbeitsplatz") })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: MENU_MESSAGES.openChildren("Ruhebereich") })).not.toBeInTheDocument();
  });

  it("blättert per Pfeil tiefer und per Zurück-Knopf wieder hinauf, mit dem Fokus", () => {
    render(<Harness />);

    fireEvent.click(screen.getByRole("button", { name: MENU_MESSAGES.openChildren("Fahrerarbeitsplatz") }));

    const back = screen.getByRole("button", { name: `${MENU_MESSAGES.back}Fahrerarbeitsplatz` });
    expect(back).toHaveFocus();
    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual(["Lenkrad", "Sitz"]);

    fireEvent.click(back);

    expect(screen.getByRole("button", { name: MENU_MESSAGES.openChildren("Fahrerarbeitsplatz") })).toHaveFocus();
  });

  it("blättert einen Ordner ohne Seite über die ganze Zeile", () => {
    render(<Harness />);

    fireEvent.click(screen.getByRole("button", { name: "Ausstattung" }));

    expect(screen.getByRole("button", { name: `${MENU_MESSAGES.back}Ausstattung` })).toBeInTheDocument();
    expect(screen.getByText("Kühlbox")).toBeInTheDocument();
  });

  it("öffnet externe Ziele in neuem Tab", () => {
    render(<Harness />);

    expect(screen.getByRole("link", { name: `Händlersuche${MENU_MESSAGES.newTab}` })).toHaveAttribute("target", "_blank");
  });

  it("blättert auf dem Telefon per Wischen nach rechts zurück", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: MENU_MESSAGES.openChildren("Fahrerarbeitsplatz") }));
    const nav = screen.getByRole("navigation");

    fireEvent.touchStart(nav, touch(20));
    fireEvent.touchMove(nav, touch(40));
    fireEvent.touchMove(nav, touch(20 + SWIPE_THRESHOLD + 10));
    fireEvent.touchEnd(nav, touch(20 + SWIPE_THRESHOLD + 10));

    expect(screen.getByRole("heading", { name: "Fahrerhaus" })).toBeInTheDocument();
  });

  it("meldet die Zeile unter dem Zeiger und ihr Verlassen", () => {
    const onRowHover = jest.fn();
    render(<Harness onRowHover={onRowHover} />);
    const item = screen.getByTestId(`menu-row-${IDS.ruhe}`);

    fireEvent.pointerEnter(item, { pointerType: "mouse" });
    fireEvent.pointerLeave(item, { pointerType: "mouse" });

    expect(onRowHover.mock.calls).toEqual([[IDS.ruhe], [null]]);
  });

  it("zeigt einen Ordner, der auf dieser Tiefe leer ist, nur als Titel", () => {
    const shallow = buildTree();
    const ausstattung = shallow.index.get(IDS.ausstattung)!.node;
    ausstattung.children = [];
    render(
      <MenuBrowser
        tree={shallow}
        trail={[]}
        direction="none"
        onNavigate={jest.fn()}
        mark={null}
        reveal={null}
        onRowHover={jest.fn()}
      />,
    );

    const item = screen.getByTestId(`menu-row-${IDS.ausstattung}`);
    expect(within(item).queryByRole("button")).not.toBeInTheDocument();
    expect(within(item).queryByRole("link")).not.toBeInTheDocument();
    expect(item).toHaveTextContent("Ausstattung");
  });
});
