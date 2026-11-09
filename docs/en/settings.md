# Settings

The widget's configuration dialog contains only one button: **Edit Image with Points
…**. It opens the window where everything is configured—mode,
image, display, menu settings, and points. The window also opens
automatically when you open the settings. **Apply** saves everything
together in a single field.

| Setting in the window | Description |
| --- | --- |
| Mode | `Manual` (default) or `Menu`. The dots from the other mode remain saved. |
| Image | The image from the media library on which the items are placed—in “Menu” mode, the image of the starting level. Also, the **alternative text** for screen readers; leave blank if the image is purely decorative. |
| Display | “Manual” only. The default is `Numbered, with a list next to the image`. |
| Starting point in the menu | “Menu” only. The menu item whose subitems will be placed. Select from the list or enter the address of a page via “Enter another menu ID …”. |
| Levels | “Menu” only. How many levels appear, including the starting point. The default is 3. |
| Click on an item with subitems | “Menu” only. `Go to submenu` (default) or `Open page`. |
| Level | “Menu” only. Which menu level is currently being edited; each has its own image and its own items. |

Technically, everything is stored in the `config` attribute. Widgets from earlier versions
still store their settings in individual attributes (`image`,
`image-alt`, `points`, `display-mode` …). As long as `config` is empty,
these settings apply; when you first **Apply** in the window, they are moved to `config`.

## Image Instead of a Dot

Each dot can display its own image from the media library in both modes;
it then appears in place of the red dot, scaled proportionally.

| Size | Edge Length |
| --- | --- |
| S | 32 px |
| M | 48 px (default) |
| L | 72 px |

For the **background**, you can choose between Transparent (default) or a
round area in white, MAN red, anthracite, or light gray.

Highlighting, the label, and clicking work the same as with the dot. In
numbered mode, the number appears only in the list.

## Values for “Display”

| Value | Label in dialog |
| --- | --- |
| `numbered` | Numbered, with a list next to the image |
| `dots` | Dots, without a list |

## Values for “Levels”

| Value | Meaning |
| --- | --- |
| `2` | Starting point and its subpoints |
| `3` | plus its subitems (default) |
| `4` to `6` | correspondingly deeper |

## Values for “Click on an item with subitems”

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
  “Menu” mode, the same applies without a starting point.
- In “Menu” mode, **each menu level can contain a maximum of 20 items**, and each
  menu item there can have at most one; another click on the image moves
  it.
- A menu level **without its own image** displays the image of the level above it.
  Items can only be placed on it once it has its own image.

## Dependencies

If you make changes in the Start Point or Levels window, the menu reloads immediately.
Points that are no longer assigned to an entry are listed under
“No Longer in the Menu.”

The button label only takes effect if a destination has been assigned
to the point. Without a destination, there is no button, and the label has
no effect.
