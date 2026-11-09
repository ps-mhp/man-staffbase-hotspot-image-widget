# Step by Step

## Setting Up the Basic Case

1. Place the **Image with Dots** widget on the page.
2. Open the widget’s settings. The window for editing the
   dots will open automatically.
3. Click **Select Image…** on the left and choose an image from the
   media library. You cannot add a dot without an image.
4. Enter **alternative text** below that describes what is
   shown in the image.
5. Click on the desired spot in the image. A new
   point will appear there, and its form will show up on the right.
6. Enter the **Title**. Without a title, you cannot close the window by
   clicking **Apply**—a corresponding message appears both in the
   field and at the bottom of the window.
7. Optionally, enter a **Description**.
8. Optional: Below the “Description” field, use **Add Link**
   to add a destination—see the section “Setting a Link” further
   down.
9. Repeat steps 5 through 8 for each additional point. An image
   can have a maximum of 20 points.
10. Click **Apply**.
11. Under **Display**, choose between “Numbered, with list next to
    the image” and “Bullets, without list.”
12. Save the page and check the result in the preview.

## Adding a Link

1. In the form for a bullet point, click **Add Link**.
2. Under **Destination**, select a page from the list. A link to a page
   from this list will later appear in a window above the page.
3. If you’d like to enter your own URL instead, click
   **Enter your own URL …** and enter the URL in the
   **URL** field. Such a URL will later open in a new
   tab, not in the window—this is indicated by the text there.
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
   existing items and the selected image.
2. Select the item you want to edit from the list on the left and edit
   its form on the right.
3. To replace the image, click **Select Another Image…**.
   The items will be preserved; check afterward to see if their position on the
   new image is still correct.
4. **Apply**, save, and check in the preview.

## In the Content Designer

The Content Designer (new page editor) has its own
image upload field in the form. The image is therefore selected there, not in the
points window:

1. Open the widget’s settings. If no image has been selected yet,
   the points window remains closed, and the button
   **Edit Points…** appears in its place.
2. Under **Image**, select or upload an image.
3. Under **Alternative Text**, enter a description of what is shown in the image.
4. Click **Edit Points …** and place the points as described in the
   basic case starting with step 5.
5. To replace the image, close the Points window, replace
   the image in the form under **Image**, and reopen the window.

## “Menu” Mode: Placing Menu Items

1. In the settings, under **Mode**, select “Menu:
   Place menu items on the image.” The fields for manual mode
   disappear, and those for menu mode appear.
2. Under **Image**, select the image for the start level.
3. Under **Start Point in Menu**, select the menu item whose
   subitems should appear on the image. If it is not in the list,
   select **Enter Other Menu ID …** and enter the page’s address
  .
4. Under **Levels**, specify how deep the menu goes. The default
   is 3: the starting point, its subitems, and their subitems.
5. Under **Click on an item with subitems**, choose whether a click
   switches to the submenu (default) or opens the page.
6. Click **Place Menu Items…**. The level is displayed at the top, its image on the left,
   and its subitems on the right.
7. Select a subitem on the right and click at the desired
   location in the image. Its item will appear there; in the list, the entry
   is then marked as “on the image.” Repeat this for each
   additional subitem.
8. To move an item, drag it or select the entry
   and click on the new location. **Remove Item** takes it back
   off the image.
9. To create a deeper layer, click **›** to the right of the subitem
   or select the layer at the top. Use **Select Image…** to choose an
   image from the media library and place the points as in step 7. Without
   its own image, the layer will later display the image from the layer above it.
10. Click **Apply**, save the page, and check
    the result in the preview.

If you’ve changed the starting point or levels, close the window and
reopen it—it will load both when it opens.

## If something isn’t working

1. **The widget isn’t displaying anything.** Either the image is missing, or no
   points have been set yet. Open the settings and check both.
2. **You can’t click “Apply.”** At least one point still
   has no title. The window shows at the bottom how many points are affected—
   enter a title for each one there.
3. **The linked page doesn’t appear in the window; instead, it opens a
   new tab.** The destination is a custom address you entered, not a page from
   the list. This is by design: external pages often cannot be
   embedded in a window. Instead, select a page from the list
   if you want it to appear in the window.
4. **The list of pages does not contain any actual pages, but rather a field for
   an address.** The system’s page list was not
   accessible when the window opened. Enter the address manually or reopen the
   window.
5. **In “Menu” mode, the window displays a message prompting you to first select a starting point
  .** Nothing is currently selected under **Starting Point in Menu**. Select
   a menu item, close the window, and reopen it.
6. **The window displays items under “No longer in the menu.”** The corresponding
   menu item has been deleted, hidden, moved within the menu, or is
   located deeper than the setting under **Levels**. These items do not appear on the page.
   Remove them there or increase the number of levels.
7. **In “Menu” mode, the settings are lost after saving
  .** The widget is still registered in the instance without the menu mode fields
  . The registration must be updated (a task for
  administration).
