# Image with Points

This widget displays an image in which individual locations are marked as **points**
— such as stations on a map, people in a
group photo, or components in a sketch. Each point has a title,
an optional description, and an optional link to a page.

All points are managed in the same window, which appears automatically when you open the
settings: Select an image, click within the image to place a
point, and enter the title and other details.

## Two Modes

Under **Mode**, you can choose where the points come from:

- **Manual** — each point gets its own title, a description,
  and, if desired, a link. Just like before.
- **Menu** — You select a menu item from the app. That item and its
  subitems can be placed individually as points on the image. Titles
  and destinations come directly from the menu: if a menu item is renamed,
  its point is immediately renamed as well. The menu for scrolling appears next to the image.

The items from the other mode are retained when you switch modes.

## The Two Display Options in “Manual” Mode

Under **Display**, you can choose one of two options:

- **Numbered, with a list next to the image** — each item is numbered, and
  next to the image is a drop-down list containing all titles. Clicking on
  an item or the corresponding list entry expands its text.
  This is useful when there are five or more items and whenever readers should be able to see the titles
  without having to search within the image.
- **Bullets, without a list** — the bullets appear without numbers, and there is no
  list next to them. Clicking on a bullet opens a small window right
  next to it with the title, description, and link. Useful when there are only a few bullet points and
  when the image is meant to stand on its own, without a list right next to it.

## What Readers See

- Without an image or at least one bullet point, the widget displays nothing at all—
  no empty frame, no placeholder image.
- In the “Bullets” view, the window opens with the text on the bullet
  itself; on narrow screens (less than 768 pixels wide), it appears
  centered on the screen instead, with a darkened background behind it.
- In “Numbered” view, the corresponding bullet in the image
  is highlighted as soon as the mouse pointer hovers over a list entry or an
  entry is expanded: it grows larger, while the other bullets recede into the background.
  On narrow screens, the dots appear small and without numbers so that
  they do not overlap even when there are many items; tapping in the list shows
  which dot belongs to which entry.
- If an item links to a page within the system, a button appears below it.
  Clicking it opens the page in a window above the current page;
  if you’ve entered an address yourself, the same button instead
  opens a new tab.
- The interface works even without a mouse: use the Tab key to
  jump from dot to dot, the Enter key to open, and the Escape key
  to close.

## What readers see in “Menu” mode

- On the left is the image with red dots and no numbers; to the right of it is the menu—on
  narrow screens, the menu appears below the image. The menu displays one level at a time: an
  arrow takes you one level deeper, the Back button at the top takes you back up, and on a
  phone, swiping right also works.
- When the mouse pointer hovers over an item, the name of the menu item appears,
  and the corresponding entry is highlighted in the menu. If the entry is one
  level deeper, the entry directly below it is highlighted.
- When the mouse pointer hovers over an entry in the menu, the items in that
  entry and all its subitems are highlighted.
- Clicking an item opens the page for that menu item—or, depending on
  the settings, scrolls the menu to it. Menu items that are only folders without
  their own page are always shown in the menu.
- Each user sees only items associated with menu items that they also see in the
  app’s menu. Entries hidden in the menu do not appear.
