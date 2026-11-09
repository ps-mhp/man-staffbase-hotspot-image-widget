# Step by Step

## Setting Up the Basic Case

1. Place the **Image with Dots** widget on the page.
2. Open the widget's settings. The **Image with
   Dots** window opens automatically; if not, click **Image with Dots
   Edit …**. At the top, the **Mode** is set to “Manual.”
3. Click **Select Image …** on the left and choose an image from the
   media library. You cannot place a dot without an image.
4. Enter **alternative text** below that describes what is
   shown in the image.
5. Click on the desired spot in the image. A new
   point will appear there, and its form will show up on the right.
6. Enter the **Title**. Without a title, you cannot close the window by
   clicking **Apply**—a corresponding message appears both in the
   field and at the bottom of the window.
7. Optionally, enter a **Description**.
8. Optional: Under the “Description” field, use **Add Link**
   to add a destination—see the section “Setting a Link” further
   below.
9. Repeat steps 5 through 8 for each additional point. An image
   is worth a maximum of 20 points.
10. At the top, under **Display**, choose between “Numbered, with list
    next to the image” and “Bullets, without list.”
11. Click **Apply**.
12. Save the page and check the result in the preview.

## A Custom Image Instead of the Red Dot

Each item can display its own image instead of the red dot—such as an
icon or a cropped photo. This works in both modes.

1. Select the bullet: in “Manual” mode, select it from the list on the right; in
   “Menu” mode, select the placed menu item from the list of subitems.
2. Under **Image Instead of Dot**, click **Select Custom Image…** and
   select an image from the media library. Transparent PNG or SVG files
   work best when cropped.
3. Under **Size**, choose between S (32 px), M (48 px, default)
  , and L (72 px).
4. Click **Remove Image** to restore the red dot.

## Adding a Link

1. In a point’s form, click **Add Link**.
2. Under **Destination**, select a page from the list. A link to a page
   from this list will later appear in a window above the page.
3. If you’d like to enter your own URL instead, click
   **Enter Your Own URL …** and type the URL into the
   **URL** field. Such a URL will later open in a new
   tab, not in the window—the tooltip explains this.
4. Click **Select a Page Instead** to return from the custom
   address to the list.
5. Optionally, enter a custom **button label**. If
   the field is left blank, the button will display “Open Page.”
6. Click **Remove Link** to remove the link; the title and
   description of the item remain unchanged.

## Moving, Sorting, and Removing Items

1. To move an item, drag it to its new location in the view.
2. To change the order of the items, select the item in the
   list on the right and click **Move Up** or **Move Down**.
3. To remove an item, select it and click **Delete Item** in its
   form.
4. Confirm each change by clicking **Apply**; click **Cancel**
   to discard all changes made since the window was last opened.

## Making Changes Later

1. Open the widget’s settings again. The window displays the
   existing points and the selected image.
2. Select the point you want to edit from the list on the left and edit
   its form on the right.
3. To replace the image, click **Select Another Image…**.
   The points are retained; then check whether their positions on the
   new image are still correct.
4. **Apply**, save, and check in the preview.

## In the Content Designer

Everything works the same way in the Content Designer: the image is selected in the window from
the media library, not in the form.

## “Menu” Mode: Placing Menu Items

1. Open the **Image with Dots** window and set the
   **Mode** at the top to “Menu.”
2. Under **Start Point in Menu**, select the menu item whose
   subitems should appear on the image. If it’s not in the list,
   select **Enter Other Menu ID…** and enter the page’s address.
   The menu loads immediately.
3. Under **Levels**, specify how deep the menu goes (default
   3), and under **Click on a Point with Subitems**, choose whether a click
   opens the submenu (default) or opens the page.
4. The **Level** field shows the starting level. On the left, use **Select
   Image…** to choose your image from the media library.
5. Select a subitem on the right and click at the desired
   location in the image. A point will appear there; the entry in the list
   will then be marked as “on the image.” Repeat this for each
   additional subitem.
6. To move a point, drag it or select the entry
   and click at the new location. **Remove Point** removes it
   from the image.
7. To create a deeper layer, click **›** to the right of the subitem
   or select the layer at the top. Select its image and place the
   points as in step 5. If it has no image of its own, the layer will later display the image
   of the layer above it.
8. Click **Apply**, save the page, and check
   the result in the preview.

## If something isn’t working

1. **The widget isn’t displaying anything.** Either the image is missing, or no
   points have been set yet. Open the settings and check both.
2. **You can’t click **Apply**.** At least one point still
   has no title. The window shows at the bottom how many points are affected—
   enter a title for each one there.
3. **The linked page does not appear in the window but opens in a
   new tab.** The destination is a custom URL you entered, not a page from
   the list. This is by design: external pages often cannot be
   embedded in a window. Instead, select a page from the list
   if you want it to appear in the window.
4. **The list of pages does not contain any pages; instead, it shows a field for
   an address.** The system’s page list was not
   accessible when the window opened. Enter the address manually or open the
   window again.
5. **In “Menu” mode, the window displays a message to first select a starting point
  .** Nothing is currently selected under **Starting Point in the Menu**.
6. **The window displays items under “No longer in the menu.”** The corresponding
   menu item has been deleted, hidden, moved within the menu, or is
   lower than the level set under **Levels**. These items do not appear on the page.
   Remove them there or increase the number of levels.
7. **The settings are lost after saving the page.** The
   widget is still registered in the instance without the `config` field. The
   registration must be updated (a task for the administrator).
