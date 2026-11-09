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
- **Menu** — You select a menu item from the app. Its subitems can
  be placed as points on an image—and for each deeper
  menu level, on a separate image. Titles and destinations come directly from the
  menu: if a menu item is renamed, its point is immediately renamed as well.
  The menu appears next to the image for scrolling.

The points from the other mode are retained when switching.

## The Two Display Options in “Manual” Mode

Under **Display**, you can choose one of two options:

- **Numbered, with a list next to the image** — each item is numbered, and
  next to the image is a drop-down list containing all titles. Clicking on
  an item or the corresponding list entry expands its text.
  This is useful when there are five or more items and whenever you want readers to see the titles
  without having to search the image.
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
  if you’ve entered an address yourself, the same button opens
  a new tab instead.
- The interface works even without a mouse: use the Tab key to
  jump from item to item, the Enter key to open, and the Escape key
  to close.

## What Readers See in “Menu” Mode

- On the left is an image of the current menu level with red dots without numbers; to the right
  of that is the menu—on narrow screens, it appears below. The menu displays one
  level at a time: an arrow takes you one level down, the Back button at the top
  takes you back up, and on a phone, swiping right also works.
- When you scroll to a level in the menu, you’ll see its image with the dots
  representing its subitems. If a level doesn’t have its own image, the image of the
  level above it remains visible.
- When the mouse pointer hovers over a dot, the name of the menu item appears,
  and the corresponding entry is highlighted in the menu. Conversely, an entry
  under the mouse pointer highlights its item.
- Clicking an item that has subitems takes you to that
  submenu—or, depending on the settings, opens its page. Items without
  subitems always open their page.
- Each user sees only items for menu options that they also see in the
  app’s menu. Entries hidden in the menu do not appear.
