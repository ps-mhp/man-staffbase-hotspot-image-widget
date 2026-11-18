# Settings

The widget's configuration dialog contains only one button: **Edit Image with Dots
**. It opens the full-screen window **Set Dots**, where everything
is configured—dot source, image, display, menu settings, and
points. The window also opens automatically when you open the settings.
**Apply** saves everything together in a single field.

## Window Layout

| Section | Content |
| --- | --- |
| Header | Widget name, status (“Point 2 changed”), Undo/Redo, **Editor · Desktop · Tablet · Mobile** toggle, Help, **Cancel**, and **Apply**. |
| Left | In “Manual” mode, the **points** in their order (red number, title, destination) and **New Point**; in “From Menu” mode, the **menu levels** as a tree. |
| Center | The bar with **Source of Items**, the image currently being edited, **Change Image**, and—in Manual mode only—**Display**; below that, the image for placing and moving items and a status bar. |
| Right | The selected point. If none is selected, the **image** with its description or, in menu mode, the **Menu** panel. |

In **Desktop**, **Tablet**, and **Mobile** modes, the center displays—instead of the image—
the page as readers see it; on the left and right, you can continue
to select and configure settings.

## Settings in the Window

| Setting | Where | Description |
| --- | --- | --- |
| Source of the dots | Bar above the image | `Manual` (default) or `From the Menu`. The dots from the other mode remain saved. |
| Image | Bar, “Image” or “Menu” panel | The image on which the markers are placed, from the media library—in “From the Menu” mode, the image from the home screen. Also, the **image description** (alternative text) for screen readers; leave blank if the image is purely decorative. |
| Display | Bar above the image | “Manual” only: `Numbers` (default, with a list next to the image) or `Items` (without a list). |
| Starting Point | “Menu” Panel | “From the Menu” only. The menu item whose subitems form the first level. Select from the list or enter a page address via “Enter Another Menu ID …”. |
| Depth | “Menu” panel | “From the Menu” only. How many levels appear, including the starting point. The default is 3 levels. |
| Click on an item with subitems | “Menu” panel | “From the Menu” only. `Go to submenu` (default) or `Open page`. |
| Level image | “Menu” panel | “From the menu” only. Each level can have its own image. |

Technically, everything is stored in the `config` attribute. Widgets from earlier versions
still store their settings in individual attributes (`image`,
`image-alt`, `points`, `display-mode` …). For each setting, the system reads:
if a value is specified in `config`, that value applies; otherwise, the old attribute; otherwise, the default.
When opened, the window adopts whatever it can read
from the old fields. What it cannot read—such as selection fields in the Content Designer—
is not written to `config` until you change it in the window; a note
in the panel lists these settings. Opening and applying the settings without making changes
therefore does not alter an existing widget.

## Icon Instead of a Dot

In both modes, each dot can display its own image (icon) from the media library;
it then appears in place of the red dot, scaled proportionally. The **Icon** section in the dot’s panel is used for this.

| Size | Edge Length |
| --- | --- |
| S | 32 px |
| M | 48 px (default) |
| L | 72 px |

For the **Background**, you can choose between Transparent (default) or a
round area in white, MAN red, anthracite, or light gray.

Highlighting, the name tag, and clicking work the same as for a bullet. In
numbered mode, the number appears only in the list.

## Values for “Display”

| Value | Label in the window |
| --- | --- |
| `numbered` | Numbers (with a list next to the image) |
| `dots` | Dots (without a list) |

## Values for “Depth”

| Value | Meaning |
| --- | --- |
| `2` | Top-level item and its subitems |
| `3` | Plus their subitems (default) |
| `4` to `6` | Correspondingly deeper levels |

## Values for “Click on an item with subitems”

| Value | Label in the window | Effect |
| --- | --- | --- |
| `enter` | Go to the submenu | The widget navigates to the submenu: the menu displays its subitems, and the image changes to the image for that level. |
| `open` | Open page | The item is a link to the menu item’s page; destinations outside the app open in a new tab. |

Items without subitems open their page in both cases. Folders without
their own page navigate to the submenu in both cases.

## Fields of an Item (Manual Mode)

| Field | Description |
| --- | --- |
| Title | Required. Without a title, **Apply** lists the item in the status instead of applying it. |
| Description | Optional, multi-line. |
| Link · Destination | Optional. `No link`, a page from the system list, or a custom address entered via “Enter your own address …”. |
| Link · Button Label | Optional. If left blank, the button displays “Open Page.” |
| Icon | Optional, see above. |

Above the panel are the item’s actions: move up, move down,
duplicate, delete.

## Limits

- An image can have a maximum of **20 items**. The status bar below the image
  will alert you if you attempt to add another one, rather than
  silently rejecting it; **New Item** and **Duplicate** are
  then disabled.
- A point **without a title** cannot be applied: **Apply** lists
  it in the status bar; on the left, it is marked as “Title missing,” and on the right,
  it is open.
- **Without an image or at least one item, the widget displays nothing** —
  neither on the published page nor as an empty frame. In
  “From the Menu” mode, the same applies if there is no starting item.
- In “From the Menu” mode, **each menu level can hold a maximum of 20 items**, and
  each menu item there can have at most one; another click on the image
  moves it.
- A menu level **without its own image** displays the image of the level above it.
  Points can only be placed on it once it has its own image.
- Whether the widget is displayed in a narrow or wide format depends on its
  own width (narrow if under 600 pixels), not on the screen’s width. The
  **Mobile** preview therefore shows the same narrow layout as the
  phone; a widget in a narrow column remains narrow even on the desktop.

## Dependencies

If you change the starting point or depth in the “Menu” panel, the menu reloads immediately.
Items that are no longer assigned to an entry appear on the left as
the error “No longer in the menu” below their level.

The button label only appears if the item has a destination
assigned to it. Without a destination, there is no button, and the field does
not appear.
