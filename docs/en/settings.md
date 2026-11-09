# Settings

The widget's configuration dialog contains nine attributes; which ones are
displayed depends on the **mode**. In "Menu" mode, "Image" is the image for the
start level; the images for lower levels are selected in the "Menu Items
…". "Image" and
"Items" are maintained in the window that appears automatically when you open the settings;
the text fields behind them contain the technical raw data and
should not be edited manually. In the Content Designer, "Image"
instead refers to the Designer’s image upload—there, the image is selected directly in the
form.

| Attribute | Label in Dialog | Description |
| --- | --- | --- |
| `image` | Image | The image on which the points are located. In the Classic Editor, select via **Select Image…** in the window from the media library; in the Content Designer, select directly in the form. |
| `image-alt` | Alternative Text | Describes the image for screen readers; leave blank if it is purely decorative. Can also be edited in the window under “Alternative Text.” |
| `source` | Mode | `Manual` (default) or `Menu`. Hides the fields of the other mode; their contents remain saved. |
| `points` | Points | “Manual” only. The list of points with position, title, description, and link. Edited in the same window. |
| `display-mode` | Display | “Manual” only. Controls how the points appear on the published page. The default is `Numbered, with list next to the image`. |
| `menu-id` | Starting point in the menu | “Menu” only. The menu item whose subitems are placed on the image. Select from the menu or enter a page address via “Enter another menu ID…”. |
| `menu-depth` | Levels | “Menu” only. The number of levels displayed, including the starting point. The default is 3. |
| `menu-click` | Click on an item with subitems | “Menu” only. `Go to submenu` (default) or `Open page`. |
| `menu-points` | Menu items on the image | “Menu” only. The image and the position of the items for each menu level. Managed in the “Place Menu Items…” window. |

## Values for “Display”

| Value | Label in the dialog |
| --- | --- |
| `numbered` | Numbered, with a list next to the image |
| `dots` | Dots, without a list |

## Values for “Levels”

| Value | Meaning |
| --- | --- |
| `2` | Top-level item and its subitems |
| `3` | Plus their subitems (default) |
| `4` through `6` | Correspondingly deeper levels |

## Values for “Click on an Item with Subitems”

| Value | Label in dialog | Effect |
| --- | --- | --- |
| `enter` | Go to the submenu | The widget navigates to the submenu: the menu displays its subitems, and the image changes to the image for that level. |
| `open` | Open page | The menu item is a link to the page associated with the menu item; destinations outside the app open in a new tab. |

Menu items without subitems open their page in both cases. Folders without
their own page navigate to the submenu in both cases.

## Fields of an Item (Manual Mode)

| Field | Description |
| --- | --- |
| Title | Required. Without a title, the window cannot be closed by clicking “Apply.” |
| Description | Optional, multi-line. |
| Destination | Optional. A page from the system’s list or a custom address. |
| Button Label | Optional. If left blank, the button displays “Open Page.” |

## Limitations

- An image can have a maximum of **20 points**. If you attempt to
  add another one, the window will display a warning instead of silently
  discarding it.
- A point **without a title** cannot be applied: the
  “Apply” button remains disabled as long as at least one item has no title,
  and the window displays the number of affected items.
- **Without an image or at least one item, the widget displays nothing** —
  neither on the published page nor as an empty frame. In
  “Menu” mode, the same applies, except there is no starting point.
- In “Menu” mode, **each menu level can contain a maximum of 20 items**, and each
  menu item there can have at most one; clicking the image again moves
  it.
- A menu level **without its own image** displays the image of the level above it.
  Items can only be placed on it once it has its own image.

## Dependencies

The “Place Menu Items…” window reads the starting point and levels when
it opens. After making a change, close the window and reopen it.

The button label only takes effect if a destination has been assigned
to the item at all. Without a destination, there is no button, and the label has
no effect.
