# Settings

The widget's configuration dialog has four attributes. "Image" and
"Points" are maintained in the window that appears when you open Settings
shows itself; the text fields behind it are the technical rough version and
should not be edited by hand. In Content Designer, Image 
instead the image upload of the designer — there the image is saved directly in the
Form chosen. 

| Attribute | Label in Dialog | Description |
| --- | --- | --- |
| 'image' | Image | The image on which the dots are located. In the classic editor via **Select image ...** in the window from the media library, in the Content Designer selected directly in the form. |
| 'image-alt' | Alternative text | Describes the image for screen readers; leave blank if it only decorates. Can also be edited in the window under "Alternative text". |
| 'points' | Points | The list of points with position, title, description and link. Maintained in the same window. |
| 'display-mode' | Display | Controls how the dots appear on the published page. The default setting is 'Numbered, with list next to the image'. |

## Values of "Representation" 

| Value | Labeling in dialog |
| --- | --- |
| 'numbered' | Numbered, with list next to the image |
| 'dots' | Dots, without list |

## Fields of a point

| Field | Description |
| --- | --- |
| Title | Mandatory. Without a title, the window cannot be closed with "Apply". |
| Description | Optional, multi-line. |
| Destination | Optional. A page from the system's list or a self-entered address. |
| Label of the button | Optional. If it remains empty, the button shows "Open page". |

## Borders

- A picture has a maximum of **20 points**. The window shows when trying to 
  to set another one, instead of tacitly
  discard. 
- A point **without title** cannot be adopted: the button
  "Apply" remains locked as long as at least one point does not win a title
  and the window indicates the number of points affected. 
- **Without an image or without at least one dot, the widget shows nothing** — 
  neither on the published page nor as an empty frame. 

## Dependency

The labeling of the button only works if the point has a target at all.
is assigned. Without a target, there is no button, and the label remains
without effect.