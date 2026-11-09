# Settings

The widget's configuration dialog contains nine attributes; which ones are
displayed depends on the **mode**. "Image" and
"Points" are configured in the window that appears automatically when you open the settings
; the text fields behind them are the technical raw data and
should not be edited manually. In the Content Designer, “Image”
instead displays the Designer’s image upload—there, the image is selected directly in
the form.

| Attribute | Label in Dialog | Description |
| --- | --- | --- |
| `image` | Image | The image on which the points are located. In the Classic Editor, select it from the media library via **Select Image…** in the window; in the Content Designer, select it directly in the form. |
| `image-alt` | Alternative Text | Describes the image for screen readers; leave blank if it is purely decorative. Can also be edited in the window under “Alternative Text.” |
| `source` | Mode | `Manual` (default) or `Menu`. Hides the fields for the other mode; their contents remain saved. |
| `points` | Points | “Manual” only. The list of points with position, title, description, and link. Edited in the same window. |
| `display-mode` | Display | “Manual” only. Controls how the items appear on the published page. The default is `Numbered, with list next to the image`. |
| `menu-id` | Starting point in the menu | “Menu” only. The menu item whose subitems are placed; the item itself can also be placed. Select from the menu or enter a page address via “Enter another menu ID…”. |
| `menu-depth` | Levels | “Menu” only. How many levels appear, including the starting point. The default is 3. |
| `menu-click` | Click on an item | “Menu” only. `Open Page` (default) or `Show Next to It in the Menu`. |
| `menu-points` | Menu items on the image | “Menu” only. Where the menu items are located. Managed in the “Place Menu Items…” window. |

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
| `4` to `6` | correspondingly deeper |

## Values for “Click on an Item”

| Value | Label in dialog | Effect |
| --- | --- | --- |
| `open` | Open page | The item is a link to the menu item’s page; destinations outside the app open in a new tab. |
| `reveal` | Show next to it in the menu | The menu next to the image scrolls to the menu item and highlights it. |

Folders without their own page are displayed in the menu in both cases.

## Fields of an Item (“Manual” Mode)

| Field | Description |
| --- | --- |
| Title | Required. Without a title, the window cannot be closed by clicking “Apply.” |
| Description | Optional, multi-line. |
| Target | Optional. A page from the system’s list or a custom address. |
| Button Label | Optional. If left blank, the button displays “Open Page.” |

## Limitations

- An image can have a maximum of **20 points**. If you attempt to
  add another one, the window will display a warning instead of silently
  discarding it.
- An item **without a title** cannot be saved: the
  “Save” button remains disabled as long as at least one item lacks a title,
  and the window displays the number of affected items.
- **Without an image or at least one point, the widget displays nothing** —
  neither on the published page nor as an empty frame. In
  “Menu” mode, the same applies if there is no starting point.
- In “Menu” mode, **each menu item can have at most one subitem**; an
  additional click on the image moves it.

## Dependencies

The “Place Menu Items…” window reads the starting point and levels when
it opens. After making a change, close the window and reopen it.

The button label only takes effect if a destination has been assigned
to the item at all. Without a destination, there is no button, and the label has
no effect.
