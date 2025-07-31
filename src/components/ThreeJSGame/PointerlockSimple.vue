<template>
  <div style="position: relative; width: 100%; height: 100vh">
    <div
      ref="gameContainer"
      style="
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
      "
    ></div>
    <InstructionsOverlay v-if="instructionsVisible" ref="instructionsRef" />
    <div class="info-overlay">
      <i class="pi pi-bolt" v-if="toggleRun"></i><br v-if="toggleRun" />
      <i class="pi pi-users" v-if="thirdPerson"></i>
      <i class="pi pi-user" v-if="!thirdPerson"></i>
    </div>
    <div class="crystal-counter">
      <i class="pi pi-circle-fill" style="color: #00ffff"></i>
      <span>{{ crystalCounter }}/15</span>
    </div>
    <InfoOverlay v-if="selectedTotem" :totem="selectedTotem" />
  </div>
</template>

<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { nextTick, onMounted, ref } from "vue";
import { RESTAPI } from "../../service/api";
import InfoOverlay from "./overlays/InfoOverlay.vue";
import InstructionsOverlay from "./overlays/InstructionsOverlay.vue";

const gameContainer = ref(null);
const instructionsRef = ref(null);
const instructionsVisible = ref(true);
const selectedTotem = ref(null);
const toggleRun = ref(false);
const thirdPerson = ref(false);
const crystalCounter = ref(0);

// Three.js variables
let scene, camera, renderer, controls;
let orbitControls, model, mixer, characterControls;
let animationsMap = new Map();
let currentAction = null;
let moveForward = false,
  moveBackward = false,
  moveLeft = false,
  moveRight = false,
  canJump = false;
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let prevTime = performance.now();

onMounted(async () => {
  console.log("Pointerlock component mounted");

  await nextTick();

  initThreeJS();
  setupPointerLock();
  setupKeyControls();
  setupMouseClick();

  try {
    const response = await RESTAPI.ProjetoObterTodos();
    await createTotems(response.data);
  } catch (error) {
    console.error("Error loading projects:", error);
  }
});

function initThreeJS() {
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000011); // Dark blue for stars visibility
  scene.fog = new THREE.Fog(0xffffff, 0, 750);

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.y = 10;

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = "0";
  renderer.domElement.style.left = "0";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";

  if (gameContainer.value) {
    gameContainer.value.appendChild(renderer.domElement);
  }

  // Controls
  controls = new PointerLockControls(camera, renderer.domElement);
  scene.add(controls.getObject());
  controls.getObject().position.set(0, 10, 0);

  // Lights - Space-themed lighting
  const hemisphereLight = new THREE.HemisphereLight(0x0077be, 0x000033, 0.8);
  scene.add(hemisphereLight);

  // Main directional light (like a distant sun)
  const directionalLight = new THREE.DirectionalLight(0xffffaa, 1.2);
  directionalLight.position.set(100, 100, 50);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);

  // Add some ambient colored lights for atmosphere
  const blueLight = new THREE.PointLight(0x0088ff, 0.5, 200);
  blueLight.position.set(-100, 30, -100);
  scene.add(blueLight);

  const purpleLight = new THREE.PointLight(0xff00ff, 0.3, 150);
  purpleLight.position.set(100, 20, 100);
  scene.add(purpleLight);

  const greenLight = new THREE.PointLight(0x00ff88, 0.4, 180);
  greenLight.position.set(0, 40, -200);
  scene.add(greenLight);

  // Floor
  generateFloor();

  // Add stars
  addStars();

  // Add space environment
  addSpaceEnvironment();

  // Start render loop
  animate();

  console.log("Three.js initialized");
}

function generateFloor() {
  let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
  floorGeometry.rotateX(-Math.PI / 2);

  // Displace vertices to simulate lunar surface
  const position = floorGeometry.attributes.position;
  const vertex = new THREE.Vector3();
  const color = new THREE.Color();

  for (let i = 0, l = position.count; i < l; i++) {
    vertex.fromBufferAttribute(position, i);
    // Create more varied terrain with craters
    const displacement =
      Math.sin(vertex.x * 0.05) *
        Math.cos(vertex.z * 0.05) *
        Math.random() *
        8 +
      Math.sin(vertex.x * 0.1) * Math.cos(vertex.z * 0.1) * Math.random() * 3;
    vertex.y += displacement;
    position.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  floorGeometry = floorGeometry.toNonIndexed();
  const colorsFloor = [];
  for (let i = 0, l = position.count; i < l; i++) {
    vertex.fromBufferAttribute(position, i);
    // Create space-like surface colors (greys and blues)
    const height = vertex.y;
    if (height > 3) {
      color.setHSL(0.6, 0.3, 0.5); // Bluish peaks
    } else if (height > 0) {
      color.setHSL(0, 0, 0.4); // Grey normal
    } else {
      color.setHSL(0.65, 0.4, 0.3); // Dark blue valleys
    }
    colorsFloor.push(color.r, color.g, color.b);
  }
  floorGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colorsFloor, 3)
  );
  const floorMaterial = new THREE.MeshLambertMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  scene.add(floor);
}

function addSpaceEnvironment() {
  // Add sky elements (planets and rockets)
  addSkyPlanets();
  addSkyRockets();

  // Add ground interactive elements
  addGroundCrystals();
  addInteractiveElements();
  addPersonalPlaque();
}

function addSkyPlanets() {
  const planetColors = [0x8b4513, 0xff6347, 0x4169e1, 0x32cd32, 0xff69b4];
  const planetNames = ["Mars", "Jupiter", "Neptune", "Earth-like", "Pink Moon"];

  for (let i = 0; i < 5; i++) {
    const planetGeometry = new THREE.SphereGeometry(
      Math.random() * 20 + 10,
      32,
      32
    );
    const planetMaterial = new THREE.MeshPhongMaterial({
      color: planetColors[i],
      shininess: 30,
      transparent: true,
      opacity: 0.8,
    });

    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    // Position planets high in the sky
    planet.position.set(
      (Math.random() - 0.5) * 1500,
      Math.random() * 200 + 150, // High in sky
      (Math.random() - 0.5) * 1500
    );

    planet.userData.info = {
      title: planetNames[i],
      subtitle: "Distant Planet",
      description: `The mysterious ${planetNames[i].toLowerCase()} watches over this cosmic landscape`,
      type: "sky-planet",
    };

    scene.add(planet);
  }
}

function addSkyRockets() {
  for (let i = 0; i < 3; i++) {
    // Rocket body
    const rocketGeometry = new THREE.ConeGeometry(2, 15, 8);
    const rocketMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shininess: 100,
    });

    const rocket = new THREE.Mesh(rocketGeometry, rocketMaterial);

    // Rocket fins
    const finGeometry = new THREE.BoxGeometry(1, 3, 0.2);
    const finMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });

    for (let j = 0; j < 4; j++) {
      const fin = new THREE.Mesh(finGeometry, finMaterial);
      const angle = (j / 4) * Math.PI * 2;
      fin.position.set(Math.cos(angle) * 1.5, -5, Math.sin(angle) * 1.5);
      rocket.add(fin);
    }

    // Position rockets in sky with movement
    rocket.position.set(
      (Math.random() - 0.5) * 800,
      Math.random() * 100 + 80,
      (Math.random() - 0.5) * 800
    );

    // Add movement direction
    rocket.userData.direction = new THREE.Vector3(
      (Math.random() - 0.5) * 0.5,
      0,
      (Math.random() - 0.5) * 0.5
    );

    rocket.userData.info = {
      title: "Space Rocket",
      subtitle: "Explorer Vessel",
      description: "A rocket exploring the cosmic frontier",
      type: "rocket",
    };

    scene.add(rocket);
  }
}

function addGroundCrystals() {
  const crystalColors = [0x00ffff, 0xff00ff, 0xffff00, 0x00ff00, 0xff8800];

  for (let i = 0; i < 15; i++) {
    const crystalGeometry = new THREE.OctahedronGeometry(1.5);
    const crystalMaterial = new THREE.MeshPhongMaterial({
      color: crystalColors[i % crystalColors.length],
      transparent: true,
      opacity: 0.9,
      emissive: crystalColors[i % crystalColors.length],
      emissiveIntensity: 0.3,
    });

    const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
    crystal.position.set(
      (Math.random() - 0.5) * 400,
      1.5, // On ground
      (Math.random() - 0.5) * 400
    );

    crystal.userData.info = {
      title: "Collectible Crystal",
      subtitle: "Energy Source",
      description: `Crystal collected: ${crystalCounter.value}/15`,
      type: "ground-crystal",
    };

    crystal.userData.collected = false;
    crystal.userData.floatSpeed = Math.random() * 0.02 + 0.01;

    scene.add(crystal);
  }
}

function addInteractiveElements() {
  // Add teleporter pads
  for (let i = 0; i < 3; i++) {
    const padGeometry = new THREE.CylinderGeometry(3, 3, 0.3, 16);
    const padMaterial = new THREE.MeshPhongMaterial({
      color: 0x00aaff,
      emissive: 0x002244,
      emissiveIntensity: 0.5,
    });

    const pad = new THREE.Mesh(padGeometry, padMaterial);
    pad.position.set(
      (Math.random() - 0.5) * 200 + i * 100,
      0.15,
      (Math.random() - 0.5) * 200
    );

    // Add energy rings
    const ringGeometry = new THREE.TorusGeometry(3.5, 0.2, 8, 16);
    const ringMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ffff,
      emissive: 0x004444,
      emissiveIntensity: 0.8,
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.copy(pad.position);
    ring.position.y = 2;

    pad.userData.info = {
      title: "Teleporter Pad",
      subtitle: "Transport Device",
      description: "Step on to activate teleportation sequence",
      type: "teleporter",
    };

    pad.userData.ring = ring;
    scene.add(pad);
    scene.add(ring);
  }

  // Add mysterious monoliths
  for (let i = 0; i < 4; i++) {
    const monolithGeometry = new THREE.BoxGeometry(2, 8, 0.5);
    const monolithMaterial = new THREE.MeshPhongMaterial({
      color: 0x111111,
      shininess: 100,
    });

    const monolith = new THREE.Mesh(monolithGeometry, monolithMaterial);
    monolith.position.set(
      (Math.random() - 0.5) * 300,
      4,
      (Math.random() - 0.5) * 300
    );

    monolith.userData.info = {
      title: "Ancient Monolith",
      subtitle: "Mysterious Structure",
      description: "An ancient structure of unknown origin",
      type: "monolith",
    };

    scene.add(monolith);
  }
}

function addPersonalPlaque() {
  // Create ornate plaque base
  const plaqueBase = new THREE.BoxGeometry(12, 8, 0.5);
  const plaqueMaterial = new THREE.MeshPhongMaterial({
    color: 0x8b4513,
    shininess: 50,
  });

  const plaque = new THREE.Mesh(plaqueBase, plaqueMaterial);
  plaque.position.set(0, 10, 20); // In front of spawn

  // Add golden frame
  const frameGeometry = new THREE.BoxGeometry(13, 9, 0.3);
  const frameMaterial = new THREE.MeshPhongMaterial({
    color: 0xffd700,
    shininess: 100,
  });

  const frame = new THREE.Mesh(frameGeometry, frameMaterial);
  frame.position.copy(plaque.position);
  frame.position.z -= 0.1;

  // Create canvas for text and image
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 512;
  canvas.height = 512;

  // Background
  context.fillStyle = "#2C1810";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Border
  context.strokeStyle = "#FFD700";
  context.lineWidth = 8;
  context.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

  // Title
  context.fillStyle = "#FFD700";
  context.font = "bold 32px Arial";
  context.textAlign = "center";
  context.fillText("ASTRONAUT EXPLORER", canvas.width / 2, 60);

  // Subtitle
  context.fillStyle = "#FFFFFF";
  context.font = "24px Arial";
  context.fillText("Space Pioneer & Developer", canvas.width / 2, 100);

  // Profile area placeholder
  context.fillStyle = "#444444";
  context.fillRect(180, 130, 150, 150);
  context.fillStyle = "#FFFFFF";
  context.font = "16px Arial";
  context.fillText("YOUR PHOTO", canvas.width / 2, 210);
  context.fillText("HERE", canvas.width / 2, 230);

  // Description
  context.fillStyle = "#CCCCCC";
  context.font = "18px Arial";
  const description = [
    "Welcome to my cosmic portfolio!",
    "Explorer of digital frontiers,",
    "Creator of stellar experiences,",
    "Navigating the universe of code.",
    "",
    "Click on totems to explore projects",
    "Collect crystals to power up",
    "Use R to switch camera modes",
  ];

  description.forEach((line, index) => {
    context.fillText(line, canvas.width / 2, 320 + index * 22);
  });

  const texture = new THREE.CanvasTexture(canvas);
  const textMaterial = new THREE.MeshPhongMaterial({ map: texture });

  const textPlane = new THREE.PlaneGeometry(10, 10);
  const textMesh = new THREE.Mesh(textPlane, textMaterial);
  textMesh.position.copy(plaque.position);
  textMesh.position.z += 0.3;

  plaque.userData.info = {
    title: "Welcome Explorer!",
    subtitle: "Mission Control",
    description: "Your guide to this cosmic adventure",
    type: "plaque",
  };

  scene.add(frame);
  scene.add(plaque);
  scene.add(textMesh);

  // Add decorative lights around plaque
  for (let i = 0; i < 4; i++) {
    const lightGeometry = new THREE.SphereGeometry(0.3);
    const lightMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.8,
    });

    const light = new THREE.Mesh(lightGeometry, lightMaterial);
    const angle = (i / 4) * Math.PI * 2;
    light.position.set(
      Math.cos(angle) * 8,
      4 + Math.sin(angle) * 2,
      -20 + Math.sin(angle) * 2
    );

    scene.add(light);
  }
}

function addStars() {
  // Main starfield
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.5,
    transparent: true,
    opacity: 0.9,
  });

  const starCount = 8000;
  const positions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount * 3; i += 3) {
    positions[i] = Math.random() * 4000 - 2000; // X
    positions[i + 1] = Math.random() * 2000 + 100; // Y (higher up)
    positions[i + 2] = Math.random() * 4000 - 2000; // Z
  }

  starGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  // Add some larger bright stars
  const brightStarGeometry = new THREE.BufferGeometry();
  const brightStarMaterial = new THREE.PointsMaterial({
    color: 0xffffaa,
    size: 3.0,
    transparent: true,
    opacity: 0.8,
  });

  const brightStarCount = 500;
  const brightPositions = new Float32Array(brightStarCount * 3);

  for (let i = 0; i < brightStarCount * 3; i += 3) {
    brightPositions[i] = Math.random() * 6000 - 3000;
    brightPositions[i + 1] = Math.random() * 1000 + 200;
    brightPositions[i + 2] = Math.random() * 6000 - 3000;
  }

  brightStarGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(brightPositions, 3)
  );
  const brightStars = new THREE.Points(brightStarGeometry, brightStarMaterial);
  scene.add(brightStars);
}

function createTotems(data) {
  // Add roundRect polyfill if not available
  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (
      x,
      y,
      width,
      height,
      radius
    ) {
      if (typeof radius === "number") {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
      } else {
        radius = { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, ...radius };
      }
      this.beginPath();
      this.moveTo(x + radius.tl, y);
      this.lineTo(x + width - radius.tr, y);
      this.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
      this.lineTo(x + width, y + height - radius.br);
      this.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius.br,
        y + height
      );
      this.lineTo(x + radius.bl, y + height);
      this.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
      this.lineTo(x, y + radius.tl);
      this.quadraticCurveTo(x, y, x + radius.tl, y);
      this.closePath();
      return this;
    };
  }

  data.forEach((item, index) => {
    // Create futuristic totem base
    const baseGeometry = new THREE.CylinderGeometry(4, 5, 2, 8);
    const baseMaterial = new THREE.MeshPhongMaterial({
      color: 0x333333,
      shininess: 100,
      emissive: 0x001122,
      emissiveIntensity: 0.3,
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);

    // Create main holographic screen
    const screenGeometry = new THREE.BoxGeometry(8, 12, 0.5);
    const screenMaterial = new THREE.MeshPhongMaterial({
      color: 0x001144,
      transparent: true,
      opacity: 0.8,
      emissive: 0x002266,
      emissiveIntensity: 0.4,
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.y = 7;

    // Create holographic frame
    const frameGeometry = new THREE.BoxGeometry(9, 13, 0.3);
    const frameMaterial = new THREE.MeshPhongMaterial({
      color: 0x00aaff,
      emissive: 0x0066aa,
      emissiveIntensity: 0.6,
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.y = 7;
    frame.position.z = -0.1;

    // Create canvas for project info
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 512;
    canvas.height = 768;

    // Holographic background
    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#001122");
    gradient.addColorStop(0.5, "#002244");
    gradient.addColorStop(1, "#001122");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Border glow effect
    context.strokeStyle = "#00aaff";
    context.lineWidth = 4;
    context.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Inner border
    context.strokeStyle = "#0066aa";
    context.lineWidth = 2;
    context.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Title with glow effect
    context.shadowColor = "#00aaff";
    context.shadowBlur = 10;
    context.fillStyle = "#00ffff";
    context.font = "bold 28px Arial";
    context.textAlign = "center";
    context.fillText(item.title.toUpperCase(), canvas.width / 2, 80);

    // Subtitle
    context.shadowBlur = 5;
    context.fillStyle = "#66ccff";
    context.font = "20px Arial";
    context.fillText(item.subtitle, canvas.width / 2, 120);

    // Decorative lines
    context.shadowBlur = 0;
    context.strokeStyle = "#00aaff";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(50, 140);
    context.lineTo(canvas.width - 50, 140);
    context.stroke();

    // Description with word wrap
    context.fillStyle = "#aaccee";
    context.font = "16px Arial";
    const words = item.description.split(" ");
    let line = "";
    let y = 180;
    const maxWidth = canvas.width - 60;
    const lineHeight = 25;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, canvas.width / 2, y);
        line = words[n] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, canvas.width / 2, y);

    // Project status indicator
    context.fillStyle = "#00ff00";
    context.font = "bold 14px Arial";
    context.fillText("● ACTIVE PROJECT", canvas.width / 2, y + 40);

    // Tech stack indicator (if available)
    context.fillStyle = "#ffaa00";
    context.font = "12px Arial";
    context.fillText("CLICK TO EXPLORE", canvas.width / 2, canvas.height - 40);

    // Load project image if available
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = item.img;
    img.onload = () => {
      // Draw image in a rounded rectangle area
      const imgX = 80;
      const imgY = y + 70;
      const imgWidth = canvas.width - 160;
      const imgHeight = 200;

      // Create rounded rectangle clipping path
      context.save();
      context.beginPath();
      context.roundRect(imgX, imgY, imgWidth, imgHeight, 10);
      context.clip();

      // Draw image
      context.drawImage(img, imgX, imgY, imgWidth, imgHeight);
      context.restore();

      // Add image border
      context.strokeStyle = "#00aaff";
      context.lineWidth = 2;
      context.beginPath();
      context.roundRect(imgX, imgY, imgWidth, imgHeight, 10);
      context.stroke();

      // Update texture
      texture.needsUpdate = true;
    };

    const texture = new THREE.CanvasTexture(canvas);
    const textMaterial = new THREE.MeshPhongMaterial({
      map: texture,
      transparent: true,
      opacity: 0.9,
    });

    const textPlane = new THREE.PlaneGeometry(7.5, 11.5);
    const textMesh = new THREE.Mesh(textPlane, textMaterial);
    textMesh.position.copy(screen.position);
    textMesh.position.z += 0.3;

    // Create energy pillars around the totem
    const pillarGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const pillarGeometry = new THREE.CylinderGeometry(0.2, 0.2, 15, 6);
      const pillarMaterial = new THREE.MeshPhongMaterial({
        color: 0x00aaff,
        emissive: 0x003366,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7,
      });
      const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);

      const angle = (i / 4) * Math.PI * 2;
      pillar.position.set(Math.cos(angle) * 7, 7.5, Math.sin(angle) * 7);
      pillarGroup.add(pillar);
    }

    // Create floating energy orbs
    const orbGroup = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const orbGeometry = new THREE.SphereGeometry(0.3, 16, 16);
      const orbMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.8,
      });
      const orb = new THREE.Mesh(orbGeometry, orbMaterial);

      const radius = 6;
      const angle = (i / 3) * Math.PI * 2;
      orb.position.set(
        Math.cos(angle) * radius,
        12 + Math.sin(angle) * 2,
        Math.sin(angle) * radius
      );
      orb.userData.originalY = orb.position.y;
      orb.userData.floatSpeed = 0.02 + i * 0.01;
      orbGroup.add(orb);
    }

    // Group all totem parts
    const totemGroup = new THREE.Group();
    totemGroup.add(base);
    totemGroup.add(frame);
    totemGroup.add(screen);
    totemGroup.add(textMesh);
    totemGroup.add(pillarGroup);
    totemGroup.add(orbGroup);

    // Position the entire totem
    totemGroup.position.set(index * 40 - 40, 1, 50);

    // Add user data for interaction
    totemGroup.userData.link = item.link;
    totemGroup.userData.info = {
      title: item.title,
      subtitle: item.subtitle,
      description: item.description,
      img: item.img,
    };

    // Make all children clickable
    totemGroup.traverse((child) => {
      if (child.isMesh) {
        child.userData.link = item.link;
        child.userData.info = totemGroup.userData.info;
      }
    });

    // Store references for animation
    totemGroup.userData.orbGroup = orbGroup;
    totemGroup.userData.pillarGroup = pillarGroup;

    scene.add(totemGroup);
  });
}

function setupPointerLock() {
  const onPointerLockChange = () => {
    if (document.pointerLockElement === renderer.domElement) {
      instructionsVisible.value = false;
    } else {
      // Only show instructions if we're in first person mode
      if (!thirdPerson.value) {
        instructionsVisible.value = true;
        // Re-setup the click listener when pointer lock is lost
        setTimeout(() => {
          setupInstructionsClickListener();
        }, 100);
      }
    }
  };

  const onPointerLockError = () => {
    console.log("Pointer lock failed");
    // Only show instructions if we're in first person mode
    if (!thirdPerson.value) {
      instructionsVisible.value = true;
      // Re-setup the click listener on error
      setTimeout(() => {
        setupInstructionsClickListener();
      }, 100);
    }
  };

  document.addEventListener("pointerlockchange", onPointerLockChange);
  document.addEventListener("mozpointerlockchange", onPointerLockChange);
  document.addEventListener("webkitpointerlockchange", onPointerLockChange);

  document.addEventListener("pointerlockerror", onPointerLockError);
  document.addEventListener("mozpointerlockerror", onPointerLockError);
  document.addEventListener("webkitpointerlockerror", onPointerLockError);

  // Setup click listener for instructions
  setupInstructionsClickListener();
}

function setupInstructionsClickListener() {
  // Only setup if we're in first person mode
  if (thirdPerson.value) {
    return;
  }

  // Wait for Vue to update the DOM
  setTimeout(() => {
    if (instructionsRef.value && instructionsRef.value.instructions) {
      // Remove existing listener if any to avoid duplicates
      instructionsRef.value.instructions.removeEventListener(
        "click",
        handleInstructionsClick
      );
      // Add new listener
      instructionsRef.value.instructions.addEventListener(
        "click",
        handleInstructionsClick
      );
      console.log("Instructions click listener setup");
    } else {
      // If not ready, try again (but only if still in first person)
      if (!thirdPerson.value) {
        setTimeout(() => {
          setupInstructionsClickListener();
        }, 100);
      }
    }
  }, 50);
}

// Handle click on instructions
function handleInstructionsClick(event) {
  console.log("Instructions clicked");
  event.preventDefault();
  event.stopPropagation();

  if (
    renderer.domElement &&
    !thirdPerson.value &&
    !document.pointerLockElement
  ) {
    console.log("Requesting pointer lock");
    renderer.domElement.requestPointerLock();
  }
}

function setupKeyControls() {
  const onKeyDown = (event) => {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = true;
        break;
      case "ArrowLeft":
      case "KeyA":
        moveLeft = true;
        break;
      case "ArrowDown":
      case "KeyS":
        moveBackward = true;
        break;
      case "ArrowRight":
      case "KeyD":
        moveRight = true;
        break;
      case "Space":
        if (canJump) {
          velocity.y += 350;
          canJump = false;
        }
        event.preventDefault();
        break;
      case "ShiftLeft":
        toggleRun.value = true;
        break;
      case "Escape":
        if (document.pointerLockElement === renderer.domElement) {
          document.exitPointerLock();
        }
        event.preventDefault();
        break;
      case "KeyR":
        thirdPerson.value = !thirdPerson.value;
        toggleCameraMode();
        break;
    }
  };

  const onKeyUp = (event) => {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = false;
        break;
      case "ArrowLeft":
      case "KeyA":
        moveLeft = false;
        break;
      case "ArrowDown":
      case "KeyS":
        moveBackward = false;
        break;
      case "ArrowRight":
      case "KeyD":
        moveRight = false;
        break;
      case "ShiftLeft":
        toggleRun.value = false;
        break;
    }
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
}

function setupMouseClick() {
  document.addEventListener("click", onDocumentClick);
}

function onDocumentClick(event) {
  // Only check pointer lock for first person mode
  if (!thirdPerson.value && !controls.isLocked) return;

  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children);

  for (const intersect of intersects) {
    if (intersect.object.userData.link) {
      // Exit pointer lock and open link (for totems)
      document.exitPointerLock();
      window.open(intersect.object.userData.link, "_blank");
      selectedTotem.value = intersect.object.userData.info;
      break;
    } else if (intersect.object.userData.info) {
      // Handle different interactive objects
      const objectType = intersect.object.userData.info.type;

      if (
        objectType === "ground-crystal" &&
        !intersect.object.userData.collected
      ) {
        // Collect crystal
        intersect.object.userData.collected = true;
        crystalCounter.value++;

        // Make crystal disappear with effect
        intersect.object.material.emissiveIntensity = 1.0;
        intersect.object.scale.setScalar(1.5);

        setTimeout(() => {
          scene.remove(intersect.object);
        }, 300);

        // Update description for remaining crystals
        scene.children.forEach((child) => {
          if (
            child.userData.info &&
            child.userData.info.type === "ground-crystal"
          ) {
            child.userData.info.description = `Crystals collected: ${crystalCounter.value}/15`;
          }
        });

        selectedTotem.value = {
          title: "Crystal Collected!",
          subtitle: "Energy Absorbed",
          description: `Total crystals: ${crystalCounter.value}/15 ${crystalCounter.value === 15 ? "- All collected!" : ""}`,
          type: "collection",
        };
      } else if (objectType === "teleporter") {
        // Teleporter effect
        selectedTotem.value = intersect.object.userData.info;

        // Create teleport effect
        const ring = intersect.object.userData.ring;
        if (ring) {
          ring.material.emissiveIntensity = 1.5;
          setTimeout(() => {
            ring.material.emissiveIntensity = 0.8;
          }, 1000);
        }
      } else {
        // Show info for other objects
        selectedTotem.value = intersect.object.userData.info;

        // Add visual feedback
        if (objectType === "sky-planet") {
          const originalScale = intersect.object.scale.x;
          intersect.object.scale.setScalar(originalScale * 1.05);
          setTimeout(() => {
            if (intersect.object.scale) {
              intersect.object.scale.setScalar(originalScale);
            }
          }, 500);
        }
      }
      break;
    }
  }
}

function animateSpaceElements(time) {
  scene.children.forEach((child) => {
    if (child.userData.info) {
      const objectType = child.userData.info.type;

      // Rotate sky planets
      if (objectType === "sky-planet") {
        child.rotation.y += 0.003;
        child.rotation.x += 0.001;
      }

      // Move rockets across sky
      if (objectType === "rocket" && child.userData.direction) {
        child.position.add(child.userData.direction);
        child.rotation.z += 0.01;

        // Reset position if too far
        if (
          Math.abs(child.position.x) > 600 ||
          Math.abs(child.position.z) > 600
        ) {
          child.position.set(
            (Math.random() - 0.5) * 800,
            Math.random() * 100 + 80,
            (Math.random() - 0.5) * 800
          );
        }
      }

      // Float ground crystals
      if (objectType === "ground-crystal" && !child.userData.collected) {
        child.position.y =
          1.5 + Math.sin(time * child.userData.floatSpeed) * 0.5;
        child.rotation.y += 0.02;
      }

      // Animate teleporter rings
      if (objectType === "teleporter" && child.userData.ring) {
        child.userData.ring.rotation.y += 0.05;
        child.userData.ring.position.y = 2 + Math.sin(time * 0.003) * 0.5;
      }

      // Rotate monoliths slowly
      if (objectType === "monolith") {
        child.rotation.y += 0.001;
      }
    }

    // Animate totems (floating orbs and energy pillars)
    if (child.userData.orbGroup) {
      child.userData.orbGroup.children.forEach((orb, index) => {
        orb.position.y =
          orb.userData.originalY +
          Math.sin(time * orb.userData.floatSpeed + index) * 1;
        orb.rotation.y += 0.02;
      });
    }

    if (child.userData.pillarGroup) {
      child.userData.pillarGroup.rotation.y += 0.01;
      child.userData.pillarGroup.children.forEach((pillar, index) => {
        pillar.material.emissiveIntensity =
          0.5 + Math.sin(time * 0.003 + index) * 0.3;
      });
    }
  });
}

function checkCrystalCollection() {
  // Get player position based on camera mode
  let playerPosition;
  if (thirdPerson.value && model) {
    playerPosition = model.position.clone();
    playerPosition.y += 2; // Check at character height
  } else {
    playerPosition = controls.getObject().position.clone();
  }

  // Check each crystal for proximity
  scene.children.forEach((child) => {
    if (
      child.userData.info &&
      child.userData.info.type === "ground-crystal" &&
      !child.userData.collected
    ) {
      const distance = playerPosition.distanceTo(child.position);

      // Collect crystal if player is close enough (within 3 units)
      if (distance < 3) {
        // Collect crystal
        child.userData.collected = true;
        crystalCounter.value++;

        // Make crystal disappear with effect
        child.material.emissiveIntensity = 1.0;
        child.scale.setScalar(1.5);

        // Play collection sound effect (visual feedback)
        const particles = createCollectionEffect(child.position);
        scene.add(particles);

        setTimeout(() => {
          scene.remove(child);
          scene.remove(particles);
        }, 500);

        // Update description for remaining crystals
        scene.children.forEach((otherChild) => {
          if (
            otherChild.userData.info &&
            otherChild.userData.info.type === "ground-crystal"
          ) {
            otherChild.userData.info.description = `Crystals collected: ${crystalCounter.value}/15`;
          }
        });

        // Show collection message
        selectedTotem.value = {
          title: "Crystal Collected!",
          subtitle: "Energy Absorbed",
          description: `Total crystals: ${crystalCounter.value}/15 ${crystalCounter.value === 15 ? "- All collected!" : ""}`,
          type: "collection",
        };

        // Auto-hide message after 2 seconds
        setTimeout(() => {
          if (
            selectedTotem.value &&
            selectedTotem.value.type === "collection"
          ) {
            selectedTotem.value = null;
          }
        }, 2000);
      }
    }
  });
}

function createCollectionEffect(position) {
  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 20;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = position.x + (Math.random() - 0.5) * 2;
    positions[i + 1] = position.y + Math.random() * 2;
    positions[i + 2] = position.z + (Math.random() - 0.5) * 2;
  }

  particleGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  const particleMaterial = new THREE.PointsMaterial({
    color: 0x00ffff,
    size: 0.5,
    transparent: true,
    opacity: 1.0,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);

  // Animate particles upward and fade out
  let startTime = performance.now();
  const animateParticles = () => {
    const elapsed = performance.now() - startTime;
    const progress = elapsed / 500; // 500ms animation

    if (progress < 1) {
      particles.position.y = position.y + progress * 5;
      particles.material.opacity = 1 - progress;
      requestAnimationFrame(animateParticles);
    }
  };
  animateParticles();

  return particles;
}

function playAnimation(animationName) {
  if (!animationsMap.has(animationName) || currentAction === animationName) {
    return;
  }

  const newAction = animationsMap.get(animationName);

  if (currentAction && animationsMap.has(currentAction)) {
    const currentActionObj = animationsMap.get(currentAction);
    currentActionObj.fadeOut(0.2);
  }

  newAction.reset().fadeIn(0.2).play();
  currentAction = animationName;
}

function animate() {
  requestAnimationFrame(animate);

  const time = performance.now();
  const delta = (time - prevTime) / 1000;

  // Update mixer for character animations
  if (mixer && thirdPerson.value) {
    mixer.update(delta);
  }

  // Animate space environment
  animateSpaceElements(time);

  // Check for crystal collection by proximity
  checkCrystalCollection();

  // Movement logic (works for both modes)
  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;
  velocity.y -= 9.8 * 100.0 * delta;

  direction.z = Number(moveForward) - Number(moveBackward);
  direction.x = Number(moveRight) - Number(moveLeft);
  direction.normalize();

  const speed = toggleRun.value ? 3000.0 : 1000.0;

  if (moveForward || moveBackward) velocity.z -= direction.z * speed * delta;
  if (moveLeft || moveRight) velocity.x -= direction.x * speed * delta;

  if (thirdPerson.value) {
    // Third person mode - move the model
    if (model) {
      const isMoving = moveForward || moveBackward || moveLeft || moveRight;

      if (isMoving) {
        // Play walk animation
        const animationName = toggleRun.value ? "Run" : "Walk";
        playAnimation(animationName);

        const moveVector = new THREE.Vector3();

        // Calculate movement relative to camera direction
        camera.getWorldDirection(moveVector);
        moveVector.y = 0;
        moveVector.normalize();

        const rightVector = new THREE.Vector3();
        rightVector.crossVectors(camera.up, moveVector).normalize();

        const movement = new THREE.Vector3();
        movement.addScaledVector(moveVector, -velocity.z * delta);
        movement.addScaledVector(rightVector, -velocity.x * delta);

        model.position.add(movement);

        // Keep model on the ground
        model.position.y = 0;

        // Make model face movement direction (corrected rotation)
        if (movement.length() > 0) {
          // Calculate the direction the model should face
          const targetDirection = movement.clone().normalize();
          const targetPosition = new THREE.Vector3();
          targetPosition.addVectors(model.position, targetDirection);

          // Make the model look in the direction it's moving
          model.lookAt(targetPosition);

          // Add 180 degrees rotation to face the correct direction
          model.rotateY(Math.PI);
        }
      } else {
        // Play idle animation when not moving
        playAnimation("Idle");
      }
    }

    // Update orbit controls
    if (orbitControls) {
      if (model) {
        // Set target position slightly above the model
        const targetPosition = model.position.clone();
        targetPosition.y = 10; // Keep camera target higher
        orbitControls.target.copy(targetPosition);
      }
      orbitControls.update();
    }
  } else {
    // First person mode - use pointer lock controls
    if (controls.isLocked) {
      controls.moveRight(-velocity.x * delta);
      controls.moveForward(-velocity.z * delta);

      controls.getObject().position.y += velocity.y * delta;
      if (controls.getObject().position.y < 10) {
        velocity.y = 0;
        controls.getObject().position.y = 10;
        canJump = true;
      }
    }
  }

  prevTime = time;
  renderer.render(scene, camera);
}

function toggleCameraMode() {
  if (thirdPerson.value) {
    setupThirdPersonMode();
  } else {
    setupFirstPersonMode();
  }
}

function setupThirdPersonMode() {
  // Exit pointer lock
  if (document.pointerLockElement) {
    document.exitPointerLock();
  }

  // Create orbit controls if they don't exist
  if (!orbitControls) {
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.minDistance = 15; // Increased for larger character
    orbitControls.maxDistance = 30; // Increased for larger character
    orbitControls.enablePan = false;
    orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
  }

  // Load character model if not loaded
  if (!model) {
    const loader = new GLTFLoader();
    loader.load("/threejs/models/Soldier.glb", (gltf) => {
      model = gltf.scene;
      model.traverse((object) => {
        if (object.isMesh) object.castShadow = true;
      });

      // Increase model size
      model.scale.set(7, 7, 7);

      // Position model at current camera position but on the ground
      const cameraPosition = controls.getObject().position;
      model.position.set(cameraPosition.x, 0, cameraPosition.z); // Y = 0 to place on ground
      scene.add(model);

      // Setup animations
      const gltfAnimations = gltf.animations;
      mixer = new THREE.AnimationMixer(model);
      animationsMap.clear(); // Clear previous animations

      gltfAnimations
        .filter((a) => a.name !== "TPose")
        .forEach((a) => {
          const action = mixer.clipAction(a);
          animationsMap.set(a.name, action);
        });

      // Start idle animation
      if (animationsMap.has("Idle")) {
        playAnimation("Idle");
      }

      console.log("Available animations:", Array.from(animationsMap.keys()));
    });
  } else {
    // Model already loaded, just add it back to scene
    if (!scene.children.includes(model)) {
      scene.add(model);
    }
  }

  // Hide instructions
  instructionsVisible.value = false;
}

function setupFirstPersonMode() {
  // Remove model from scene
  if (model && scene.children.includes(model)) {
    scene.remove(model);
  }

  // Show instructions to click for pointer lock only if pointer lock is not active
  if (!document.pointerLockElement) {
    instructionsVisible.value = true;
    // Re-setup the click listener after a delay to ensure DOM is ready
    setupInstructionsClickListener();
  } else {
    instructionsVisible.value = false;
  }
}
</script>

<style scoped>
.info-overlay {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  font-size: 2rem;
  z-index: 100;
}

.crystal-counter {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: bold;
  border: 2px solid #00ffff;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
  z-index: 100;
}

.crystal-counter i {
  font-size: 1.2rem;
  animation: crystal-pulse 2s infinite;
}

@keyframes crystal-pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}
</style>
