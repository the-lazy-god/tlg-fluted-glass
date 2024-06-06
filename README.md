# TLG Fluted Glass
Create a fluted glass texture effect on any image on you web page. Powered by the Three.js library. This script creates a Three.js canvas using an image for base texture, and simulates a fluted glass effect while providing options to customize the number of segments and motion.

Click below to see the setup guide video:

[<img src="https://img.youtube.com/vi/youtubeID/maxresdefault.jpg" width="100%">](https://youtu.be/youtubeID)

## 🔗 Snippet

Copy the `<script>` below and paste it in the `<head>` or before `</body>` tag in your project on the pages where you need it.

```html
<!-- Snippets by The Lazy God • Fluted Glass -->
<script defer type="importmap"> { "imports": { "three": "https://unpkg.com/three@0.162.0/build/three.module.js"} } </script>
<script defer type="module" src="https://cdn.jsdelivr.net/gh/the-lazy-god/tlg-fluted-glass@v1.0.0/tlg-fluted-glass.min.js"></script>
``` 

## ✅ Required Setup

### 1: Define canvas container(s)

Add the attribute below to any div element you want to contain a fluted glass effect.

**Note:** This element is automatically set to `position:relative;`. Give it the size you want the canvas to be using height and width or width and aspect ratio.

**Attribute:**

-   Name: `tlg-fluted-glass-canvas`

### 2: Define image source element(s)

Within each canvas container, include one or more image elements with the attribute `tlg-fluted-glass-image`. One of these images will be used as the base texture in the fluted glass effect. If more than one image element is used, a random will be chosen on page load.

**Note:** Hide the source images with `display:none;`.

**Attribute:**

-   Name: `tlg-fluted-glass-image`

## 🔄 Optional Customization

### Set the number of segments

Control the number of segments in the fluted glass by adding the `tlg-fluted-glass-segments` attribute to the container with attribute `tlg-fluted-glass-canvas`. 

Default is 50 segments.

**Attribute (Optional):**

-   Name: `tlg-fluted-glass-segments`
-   Value: `{number}` (Default = 50)

### Set texture rotation

Control the rotation of the fluted glass segments by adding the `tlg-fluted-glass-rotation` attribute to the container with attribute `tlg-fluted-glass-canvas`. 

Enter the number of degrees you want to rotate the segments counter clockwise. Default is 0. Using 180 will effectively swap the direction of the motion.

**Attribute (Optional):**

-   Name: `tlg-fluted-glass-rotation`
-   Value: `{number}` (Degrees counter clockwise rotation. Default = 0)


## 📦 Attributes overview

| Name                         | Description                                                                               | Values                              | Default          |
|------------------------------|-------------------------------------------------------------------------------------------|-------------------------------------|------------------|
| `tlg-fluted-glass-canvas`    | Identifies the container element for the fluted glass canvas. **Required**                | None                                | -                |
| `tlg-fluted-glass-image`     | Marks an image to be used as base texture in the fluted glass effect. **Required**        | None                                | -                |
| `tlg-fluted-glass-segments`  | Determines the number of segments in the fluted glass pattern.                            | {Number}                            | 50               |
| `tlg-fluted-glass-mode`      | Sets the animation mode of the fluted glass effect.                                       | "static", "mouse", "scroll"         | "static"         |
| `tlg-fluted-glass-rotation`  | Rotates the fluted glass segments in degrees counter clockwise.                           | {Number}                            | 1                |
| `tlg-fluted-glass-motion`    | Controls the intensity of the motion effect.                                              | {Number}                            | 1                |

