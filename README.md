# TLG Fluted Glass
Create a fluted glass texture effect on any image on your website. Powered by the Three.js library. This script creates a Three.js canvas, uses an image for the base texture, and simulates a fluted glass effect with options to customize the number of segments, interaction type, rotation and level of motion.
<!-- 
Click below to see the setup guide video:
[<img src="https://img.youtube.com/vi/youtubeID/maxresdefault.jpg" width="100%">](https://youtu.be/youtubeID)
-->

## 🔗 Snippet

Copy the `<script>` below and paste it in the `<head>` tag in your project on the pages where you need it.

```html
<!-- Snippets by The Lazy God • Fluted Glass -->
<script defer type="importmap"> { "imports": { "three": "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.min.js"} } </script>
<script defer type="module" src="https://cdn.jsdelivr.net/gh/the-lazy-god/tlg-fluted-glass@v1.0.0/tlg-fluted-glass.min.js"></script>
``` 

## ✅ Required Setup

### 🖼️ Define canvas container(s)

Add the attribute below to any div element you want to contain a fluted glass effect.

**Note:** This element is automatically set to `position:relative;` if it doesn't already have a position type which works as relative. Give it the size you want the canvas to be using height and width or width and aspect ratio. The canvas will fill this div.

**Attribute:**

-   Name: `tlg-fluted-glass-canvas`

---

### 🏞️ Define image source element(s)

Within each canvas container, include one or more image elements with the attribute `tlg-fluted-glass-image` to use as the base texture in the fluted glass effect. If more than one image element is used, a random will be chosen on page load.

**Note:** You can hide the source images with `display:none;` or set them to cover the canvas container if you want to use it as the default state while the effect is loading.

**Attribute:**

-   Name: `tlg-fluted-glass-image`

## 🔄 Optional Customization

### 🖱️ Choose interaction mode

Set the interaction mode of the fluted glass effect by adding the `tlg-fluted-glass-mode` attribute to the container with attribute `tlg-fluted-glass-canvas`. Options are "static", "mouse", and "scroll".

**Attribute (Optional):**

-   Name: `tlg-fluted-glass-mode`
-   Value: `"static"`, `"mouse"`, `"scroll"` (Default = "static")

---

### ⏩ Set level of motion

Control the intensity of the motion effect with `tlg-fluted-glass-motion` attribute to the container with attribute `tlg-fluted-glass-canvas`. 

Default is 1. Larger number will increase motion intensity. Negative number will flip the direction.

**Attribute (Optional):**

-   Name: `tlg-fluted-glass-motion`
-   Value: `{number}` (Default = 1)

---

### 🔢 Set the number of segments

Control the number of segments in the fluted glass by adding the `tlg-fluted-glass-segments` attribute to the container with attribute `tlg-fluted-glass-canvas`. 

Default is 80 segments.

**Attribute (Optional):**

-   Name: `tlg-fluted-glass-segments`
-   Value: `{number}` (Default = 80)

---

### 🔄 Set texture rotation

Control the rotation of the fluted glass segments by adding the `tlg-fluted-glass-rotation` attribute to the container with attribute `tlg-fluted-glass-canvas`. 

Enter the number of degrees you want to rotate the segments counter clockwise. Default is 0. Using 180 will effectively swap the direction of the motion.

**Attribute (Optional):**

-   Name: `tlg-fluted-glass-rotation`
-   Value: `{number}` (Degrees counter clockwise rotation. Default = 0)

---

## 📦 Attributes overview

| Name                         | Description                                                                               | Values                              | Default          |
|------------------------------|-------------------------------------------------------------------------------------------|-------------------------------------|------------------|
| `tlg-fluted-glass-canvas`    | Identifies the container element for the fluted glass canvas. **Required**                | None                                | -                |
| `tlg-fluted-glass-image`     | Marks an image to be used as base texture in the fluted glass effect. **Required**        | None                                | -                |
| `tlg-fluted-glass-segments`  | Determines the number of segments in the fluted glass pattern.                            | {Number}                            | 80               |
| `tlg-fluted-glass-mode`      | Sets the animation mode of the fluted glass effect.                                       | "static", "mouse", "scroll"         | "static"         |
| `tlg-fluted-glass-rotation`  | Rotates the fluted glass segments in degrees counter clockwise.                           | {Number}                            | 1                |
| `tlg-fluted-glass-motion`    | Controls the intensity of the motion effect.                                              | {Number}                            | 1                |

