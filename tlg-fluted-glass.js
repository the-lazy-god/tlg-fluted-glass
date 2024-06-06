import * as THREE from 'three';

document.addEventListener("DOMContentLoaded", function() {
  var vertex = `
varying vec2 vUv;
void main() {
vUv = uv;
gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;

  var fragment = `
precision mediump float;
uniform sampler2D uTexture;
uniform vec4 resolution;
varying vec2 vUv;
uniform float uImageAspect;
uniform vec3 uOverlayColor;
uniform vec3 uOverlayColorWhite;
uniform float uMotionValue; // renamed from uMouse
uniform float uRotation;
uniform float uSegments;

void main() {
    float canvasAspect = resolution.x / resolution.y;

    // Number of slices
    float numSlices = uSegments;
    float rotationRadians = uRotation * (3.14159265 / 180.0); // Convert rotation to radians

    // Adjust the UV coordinates for aspect ratio
    vec2 scaledUV = vUv;
    if (uImageAspect > canvasAspect) {
        float scale = canvasAspect / uImageAspect;
        scaledUV.x = (vUv.x - 0.5) * scale + 0.5;
    } else {
        float scale = uImageAspect / canvasAspect;
        scaledUV.y = (vUv.y - 0.5) * scale + 0.5;
    }

    // Rotation for the effect
    float cosRot = cos(rotationRadians);
    float sinRot = sin(rotationRadians);
    vec2 center = vec2(0.5, 0.5);

    // Apply rotation to motion value
    vec2 motionEffect = vec2((uMotionValue - 0.5) * 0.5 * -1.0, 0.0); // Original motion effect vector, before rotation
    motionEffect = vec2(cosRot * motionEffect.x - sinRot * motionEffect.y,
                       sinRot * motionEffect.x + cosRot * motionEffect.y); // Rotated motion effect vector

    vec2 uvRotated = vec2(cosRot * (scaledUV.x - center.x) + sinRot * (scaledUV.y - center.y) + center.x,
                         -sinRot * (scaledUV.x - center.x) + cosRot * (scaledUV.y - center.y) + center.y);

    // Calculate the progress within the current slice
    float sliceProgress = fract(uvRotated.x * numSlices);

    // Apply sine wave distortion for the 3D cylindrical effect
    float amplitude = 0.015; // The amplitude of the sine wave
    float sineWaveWarp = amplitude * sin(sliceProgress * 3.14159265 * 2.0);

    // Adjust UVs based on sine wave and motion interaction, respecting rotation
    scaledUV.x += sineWaveWarp * (1.0 - 0.5 * abs(sliceProgress - 0.5)) + motionEffect.x;
    scaledUV.y += motionEffect.y; // Only affects if motionEffect.y is used

    // Black overlay and white overlay logic remains the same...

    // Tile texture on edges
    vec2 tileIndex = floor(scaledUV);
    vec2 oddTile = mod(tileIndex, 2.0);
    vec2 mirroredUV = mix(fract(scaledUV), 1.0 - fract(scaledUV), oddTile);
    vec4 color = texture2D(uTexture, mirroredUV);

    // Apply overlays as before...
    float blackOverlayAlpha = 0.05 * (1.0 - abs(sin(sliceProgress * 3.14159265 * 0.5 + 1.57)));
    color.rgb *= (1.0 - blackOverlayAlpha);

    float whiteOverlayAlpha = 0.15 * (1.0 - abs(sin(sliceProgress * 3.14159265 * 0.7 - 0.7)));
    color.rgb = mix(color.rgb, uOverlayColorWhite, whiteOverlayAlpha);

    gl_FragColor = color;
}
`;

  class Sketch {
    constructor(options) {
      this.scene = new THREE.Scene();

      this.container = options.dom;
      this.container.style.position = 'relative';

      this.width = this.container.offsetWidth;
      this.height = this.container.offsetHeight;
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.setSize(this.width, this.height);
      this.renderer.setClearColor(0xeeeeee, 1);

      const modeAttr = this.container.getAttribute('tlg-fluted-glass-mode');
      this.mode = ['static', 'mouse', 'scroll'].includes(modeAttr) ? modeAttr : 'static';
      const motionAttr = this.container.getAttribute('tlg-fluted-glass-motion');
      this.motionFactor = parseFloat(motionAttr) || 1;

      this.container.appendChild(this.renderer.domElement);

      var frustumSize = 1;
      this.camera = new THREE.OrthographicCamera(
        frustumSize / -2,
        frustumSize / 2,
        frustumSize / 2,
        frustumSize / -2,
        -1000,
        1000
      );
      this.camera.position.set(0, 0, 2);

      this.isPlaying = true;
      this.addObjects();
      this.resize();
      this.render();
      this.setupResize();

      if (this.mode === 'mouse') {
        this.mouseEvents();
      }
      if (this.mode === 'scroll') {
        this.setupScroll();
      }
    }

    mouseEvents() {
      this.container.addEventListener('mousemove', (event) => {
        this.onMouseMove(event);
      });
    }

    setupScroll() {
      window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    handleScroll() {
      const rect = this.container.getBoundingClientRect();
      const elemTop = rect.top;
      const elemBottom = rect.bottom;

      // Check if the element is in the viewport
      const isInViewport = elemTop < window.innerHeight && elemBottom >= 0;

      if (isInViewport) {
        const totalHeight = window.innerHeight + this.container.offsetHeight;
        const scrolled = window.innerHeight - elemTop;
        const progress = scrolled / totalHeight;
        const maxMovement = 0.2; // Full rotation
        this.material.uniforms.uMotionValue.value = 0.5 + progress * maxMovement * this.motionFactor;
      }
    }

    onMouseMove(event) {
      this.mouse.x = event.clientX / window.innerWidth;
      this.mouse.y = 1.0 - event.clientY / window.innerHeight;
      if (this.material) {
        this.material.uniforms.uMotionValue.value = 0.5 + this.mouse.x * this.motionFactor;
      }
    }

    setupResize() {
      window.addEventListener("resize", this.resize.bind(this));
    }

    resize() {
      this.width = this.container.offsetWidth;
      this.height = this.container.offsetHeight;
      this.renderer.setSize(this.width, this.height);
      this.camera.aspect = this.width / this.height;

      if (this.material) {
        this.material.uniforms.resolution.value.x = this.width;
        this.material.uniforms.resolution.value.y = this.height;
      }

      this.camera.updateProjectionMatrix();
    }

    addObjects() {
      // Get all child image textures
      const imageElements = this.container.querySelectorAll("[tlg-fluted-image]");
      const randomImageElement = imageElements[Math.floor(Math.random() * imageElements.length)];

      // Set rotation angle
      const rotationAttribute = this.container.getAttribute("tlg-fluted-rotation");
      this.rotationAngle = parseFloat(rotationAttribute, 10) || 0; // Default to 0

      // Set number of segments
      const segmentsAttribute = this.container.getAttribute("tlg-fluted-segments");
      this.segments = parseInt(segmentsAttribute, 10) || 50; // Default to 50

      // Create a new Image object to load the texture
      const image = new Image();
      image.onload = () => {
        // Calculate the aspect ratio automatically
        this.imageAspect = image.naturalWidth / image.naturalHeight;
        // Once the image is loaded and the aspect ratio is calculated, set up the material and geometry
        this.setupMaterialAndGeometry(randomImageElement.src);
      };
      // Set the image source to start loading
      image.src = randomImageElement.src;
    }

    setupMaterialAndGeometry(imageSrc) {
      const rendererElement = this.renderer.domElement;
      // Set styles for generated canvas
      rendererElement.style.position = 'absolute';
      rendererElement.style.top = '0';
      rendererElement.style.left = '0';
      // rendererElement.style.zIndex = '-1';

      // Append the renderer element to the container
      this.container.appendChild(rendererElement);

      let texture = new THREE.TextureLoader().load(imageSrc);
      texture.minFilter = THREE.LinearFilter;

      this.mouse = new THREE.Vector2(0.5, 0.5);

      this.material = new THREE.ShaderMaterial({
        extensions: {
          derivatives: "#extension GL_OES_standard_derivatives : enable"
        },
        side: THREE.DoubleSide,
        uniforms: {
          resolution: {
            value: new THREE.Vector4()
          },
          uTexture: {
            value: texture
          },
          uMotionValue: {
            value: 0.5
          },
          uRotation: {
            value: this.rotationAngle
          },
          uSegments: {
            value: this.segments
          },
          uOverlayColor: {
            value: new THREE.Vector3(0.0, 0.0, 0.0)
          },
          uOverlayColorWhite: {
            value: new THREE.Vector3(1.0, 1.0, 1.0)
          },
          uImageAspect: {
            value: this.imageAspect
          }
        },
        vertexShader: vertex,
        fragmentShader: fragment,
      });

      this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
      this.plane = new THREE.Mesh(this.geometry, this.material);
      this.scene.add(this.plane);

      this.resize();
    }

    render(time = 0) {
      if (!this.isPlaying) return;

      requestAnimationFrame(this.render.bind(this));
      this.renderer.render(this.scene, this.camera);
    }
  }

  // Create each canvas
  document.querySelectorAll("[tlg-fluted-canvas]").forEach((element) => {
    if (element.querySelector("[tlg-fluted-image]")) {
      new Sketch({
        dom: element
      });
    } else {
      console.error("No [tlg-fluted-image] child found within [tlg-fluted-canvas] element.");
    }
  });
});
