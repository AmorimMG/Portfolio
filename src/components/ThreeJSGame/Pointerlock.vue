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
      <i class="pi pi-circle-fill" style="color: #cc99ff"></i>
      <span>{{ crystalCounter }}/15</span>
    </div>
    <div v-if="hoveredObject" class="object-info-overlay">
      <h4>{{ hoveredObject.title }}</h4>
      <p class="subtitle">{{ hoveredObject.subtitle }}</p>
      <p class="description">{{ hoveredObject.description }}</p>
    </div>
    <div v-if="achievementMessage" class="achievement-overlay">
      <div class="achievement-content">
        <i class="pi pi-star-fill"></i>
        <h3>{{ achievementMessage.title }}</h3>
        <p>{{ achievementMessage.description }}</p>
      </div>
    </div>
    <!--     <InfoOverlay v-if="selectedTotem" :totem="selectedTotem" /> -->
  </div>
</template>

<script setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import { RESTAPI } from "../../service/api";
import InstructionsOverlay from "./overlays/InstructionsOverlay.vue";

const gameContainer = ref(null);
const instructionsRef = ref(null);
const instructionsVisible = ref(true);
const selectedTotem = ref(null);
const toggleRun = ref(false);
const thirdPerson = ref(false);
const crystalCounter = ref(0);
const hoveredObject = ref(null);
const achievementMessage = ref(null);

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
let onPlatform = false; // Track if player is on a platform
let currentPlatformHeight = 0; // Current platform height
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let prevTime = performance.now();

// Control variables for cleanup
let isComponentMounted = true;
let animationFrameId = null;
let eventListeners = [];
let activeTimeouts = [];

// Helper function to track timeouts
function createTimeout(callback, delay) {
  if (!isComponentMounted) return;

  const timeoutId = setTimeout(() => {
    if (isComponentMounted) {
      callback();
    }
    // Remove from active timeouts array
    const index = activeTimeouts.indexOf(timeoutId);
    if (index > -1) {
      activeTimeouts.splice(index, 1);
    }
  }, delay);

  activeTimeouts.push(timeoutId);
  return timeoutId;
}

onMounted(async () => {
  console.log("Pointerlock component mounted");
  isComponentMounted = true;

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

onUnmounted(() => {
  console.log("Pointerlock component unmounting - cleaning up...");

  // Stop animation loop
  isComponentMounted = false;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  // Clean up Three.js resources
  if (scene) {
    // Dispose geometries and materials
    scene.traverse((child) => {
      if (child.geometry) {
        child.geometry.dispose();
      }
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => {
            if (material.map) material.map.dispose();
            if (material.normalMap) material.normalMap.dispose();
            if (material.roughnessMap) material.roughnessMap.dispose();
            if (material.metalnessMap) material.metalnessMap.dispose();
            material.dispose();
          });
        } else {
          if (child.material.map) child.material.map.dispose();
          if (child.material.normalMap) child.material.normalMap.dispose();
          if (child.material.roughnessMap) child.material.roughnessMap.dispose();
          if (child.material.metalnessMap) child.material.metalnessMap.dispose();
          child.material.dispose();
        }
      }
    });
    scene.clear();
  }

  // Dispose renderer
  if (renderer) {
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
    renderer.dispose();
    renderer.forceContextLoss();
    renderer = null;
  }

  // Clean up controls
  if (controls) {
    controls.dispose();
    controls = null;
  }

  if (orbitControls) {
    orbitControls.dispose();
    orbitControls = null;
  }

  // Clean up mixer
  if (mixer) {
    mixer.stopAllAction();
    mixer = null;
  }

  // Clear all active timeouts
  activeTimeouts.forEach(timeoutId => {
    clearTimeout(timeoutId);
  });
  activeTimeouts = [];
  
  // Remove all event listeners
  eventListeners.forEach(({ element, event, handler }) => {
    try {
      element.removeEventListener(event, handler);
    } catch (error) {
      console.warn("Error removing event listener:", error);
    }
  });
  eventListeners = [];

  // Exit pointer lock
  if (document.pointerLockElement) {
    document.exitPointerLock();
  }

  // Reset all variables
  scene = null;
  camera = null;
  model = null;
  mixer = null;
  currentAction = null;
  characterControls = null;
  animationsMap.clear();

  // Reset movement variables
  moveForward = false;
  moveBackward = false;
  moveLeft = false;
  moveRight = false;
  canJump = false;
  onPlatform = false;
  currentPlatformHeight = 0;

  // Reset reactive variables
  crystalCounter.value = 0;
  hoveredObject.value = null;
  achievementMessage.value = null;
  selectedTotem.value = null;

  // Clean up timeouts
  activeTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
  activeTimeouts = [];

  console.log("Pointerlock component cleanup completed");
});

function initThreeJS() {
  // Scene
  scene = new THREE.Scene();

  // Create purple galaxy skybox
  createGalaxySkybox();

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
  controls.getObject().position.set(0, 10, 30); // Position to look at totems

  // Set initial camera rotation
  controls.getObject().rotation.y = 0; // Look forward toward totems

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

  if (isComponentMounted) {
    console.log("Three.js initialized");
  }
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

  // Create texture loader
  const textureLoader = new THREE.TextureLoader();

  for (let i = 0; i < 5; i++) {
    const planetGeometry = new THREE.SphereGeometry(
      Math.random() * 20 + 10,
      32,
      32
    );

    // Create canvas texture for each planet
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    // Create different planet textures based on type
    ctx.fillStyle = `#${planetColors[i].toString(16).padStart(6, "0")}`;
    ctx.fillRect(0, 0, 512, 512);

    // Add surface details based on planet type
    switch (i) {
      case 0: // Mars - red with darker spots
        for (let j = 0; j < 50; j++) {
          ctx.fillStyle = "#5d2d0c";
          ctx.beginPath();
          ctx.arc(
            Math.random() * 512,
            Math.random() * 512,
            Math.random() * 20 + 5,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
        break;
      case 1: // Jupiter - bands
        for (let y = 0; y < 512; y += 40) {
          ctx.fillStyle = y % 80 === 0 ? "#cc4125" : "#e55039";
          ctx.fillRect(0, y, 512, 20);
        }
        break;
      case 2: // Neptune - blue with swirls
        ctx.fillStyle = "#2e5db8";
        ctx.fillRect(0, 0, 512, 512);
        for (let j = 0; j < 30; j++) {
          ctx.strokeStyle = "#1e3d88";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(
            Math.random() * 512,
            Math.random() * 512,
            Math.random() * 40 + 20,
            0,
            Math.PI * 2
          );
          ctx.stroke();
        }
        break;
      case 3: // Earth-like - green with blue patches
        for (let j = 0; j < 20; j++) {
          ctx.fillStyle = "#4169e1";
          ctx.beginPath();
          ctx.arc(
            Math.random() * 512,
            Math.random() * 512,
            Math.random() * 40 + 20,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
        break;
      case 4: // Pink Moon - craters
        for (let j = 0; j < 30; j++) {
          ctx.fillStyle = "#d63384";
          ctx.beginPath();
          ctx.arc(
            Math.random() * 512,
            Math.random() * 512,
            Math.random() * 15 + 5,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
        break;
    }

    // Create texture from canvas
    const planetTexture = new THREE.CanvasTexture(canvas);
    planetTexture.wrapS = THREE.RepeatWrapping;
    planetTexture.wrapT = THREE.RepeatWrapping;

    const planetMaterial = new THREE.MeshPhongMaterial({
      map: planetTexture,
      color: 0xffffff, // Use white to let texture show through
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
  // Add space parkour elements
  addSpaceParkour();

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

function addSpaceParkour() {
  // Create isolated spiral parkour tower with doubled dimensions and proper proportions
  const centerX = -200; // Positioned away from spawn
  const centerZ = -200;
  const maxHeight = 240; // Doubled height (was 120)
  const spiralRadius = 50; // Doubled radius (was 25) for proper proportion
  const totalPlatforms = 20; // Keep same number of platforms for good spacing

  // Create base platform (also doubled)
  const baseGeometry = new THREE.CylinderGeometry(16, 20, 4, 16); // Doubled from 8,10,2
  const baseMaterial = new THREE.MeshPhongMaterial({
    color: 0x4a2c7a,
    emissive: 0x2d1650,
    emissiveIntensity: 0.3,
  });

  const basePlatform = new THREE.Mesh(baseGeometry, baseMaterial);
  basePlatform.position.set(centerX, 2, centerZ); // Doubled height

  basePlatform.userData.info = {
    title: "Spiral Tower Base",
    subtitle: "Parkour Challenge Start",
    description: "Begin your ascent to the cosmic summit!",
    type: "parkour-base",
  };

  scene.add(basePlatform);

  // Create spiral platforms with doubled proportions
  for (let i = 0; i < totalPlatforms; i++) {
    const progress = i / (totalPlatforms - 1);
    const angle = progress * Math.PI * 5; // Keep 5 full rotations
    const height = 10 + progress * maxHeight; // Doubled base height (was 5)
    const radius = spiralRadius - progress * 16; // Doubled radius decrease (was 8)

    const x = centerX + Math.cos(angle) * radius;
    const z = centerZ + Math.sin(angle) * radius;

    // Platform (doubled dimensions)
    const platformGeometry = new THREE.CylinderGeometry(6, 7, 2, 8); // Doubled from 3,3.5,1
    const platformMaterial = new THREE.MeshPhongMaterial({
      color: 0x6642a6,
      emissive: 0x4a2c7a,
      emissiveIntensity: 0.4,
    });

    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.set(x, height, z);

    // Add glowing rings around platforms (doubled dimensions)
    const ringGeometry = new THREE.TorusGeometry(7.6, 0.4, 8, 16); // Doubled from 3.8,0.2
    const ringMaterial = new THREE.MeshPhongMaterial({
      color: 0xcc99ff,
      emissive: 0x9966ff,
      emissiveIntensity: 0.8,
    });

    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.set(x, height + 1.6, z); // Doubled offset from 0.8
    ring.userData.floatSpeed = 0.02 + i * 0.001;

    platform.userData.info = {
      title: `Spiral Platform ${i + 1}`,
      subtitle: "Parkour Step",
      description: `Platform ${i + 1} of ${totalPlatforms} - Height: ${Math.round(height)}m`,
      type: "spiral-platform",
    };

    // Add connecting beam to next platform (visual guide) with proper proportions
    if (i < totalPlatforms - 1) {
      const nextProgress = (i + 1) / (totalPlatforms - 1);
      const nextAngle = nextProgress * Math.PI * 5; // Keep same rotation pattern
      const nextHeight = 10 + nextProgress * maxHeight; // Doubled base height
      const nextRadius = spiralRadius - nextProgress * 16; // Doubled radius decrease
      const nextX = centerX + Math.cos(nextAngle) * nextRadius;
      const nextZ = centerZ + Math.sin(nextAngle) * nextRadius;

      // Create connecting beam with doubled thickness
      const beamLength = Math.sqrt(
        Math.pow(nextX - x, 2) +
          Math.pow(nextHeight - height, 2) +
          Math.pow(nextZ - z, 2)
      );

      const beamGeometry = new THREE.CylinderGeometry(0.2, 0.2, beamLength, 8); // Doubled thickness from 0.1
      const beamMaterial = new THREE.MeshPhongMaterial({
        color: 0x9966ff,
        emissive: 0x6633ff,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.7,
      });

      const beam = new THREE.Mesh(beamGeometry, beamMaterial);

      // Position and rotate beam to connect platforms
      beam.position.set(
        (x + nextX) / 2,
        (height + nextHeight) / 2,
        (z + nextZ) / 2
      );

      beam.lookAt(nextX, nextHeight, nextZ);
      beam.rotateX(Math.PI / 2);

      scene.add(beam);
    }

    scene.add(platform);
    scene.add(ring);
  }

  // Add final reward platform at the top with doubled dimensions
  const rewardGeometry = new THREE.CylinderGeometry(12, 12, 4, 16); // Doubled from 6,6,2
  const rewardMaterial = new THREE.MeshPhongMaterial({
    color: 0x9966ff,
    emissive: 0x6633ff,
    emissiveIntensity: 0.6,
  });

  const rewardPlatform = new THREE.Mesh(rewardGeometry, rewardMaterial);
  rewardPlatform.position.set(centerX, maxHeight + 8, centerZ);

  // Add spinning crystal on top
  const crystalGeometry = new THREE.OctahedronGeometry(2);
  const crystalMaterial = new THREE.MeshPhongMaterial({
    color: 0xffdd44,
    emissive: 0xffaa00,
    emissiveIntensity: 0.8,
    transparent: true,
    opacity: 0.9,
  });

  const rewardCrystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
  rewardCrystal.position.set(centerX, maxHeight + 24, centerZ); // Doubled height offset
  rewardCrystal.userData.type = "reward-crystal";

  rewardPlatform.userData.info = {
    title: "Summit Platform",
    subtitle: "Parkour Complete!",
    description: "Congratulations! You've reached the cosmic summit!",
    type: "summit",
  };

  rewardCrystal.userData.info = {
    title: "Golden Cosmic Crystal",
    subtitle: "Ultimate Reward",
    description:
      "A legendary crystal that only the most skilled explorers can reach!",
    type: "golden-crystal",
  };

  scene.add(rewardPlatform);
  scene.add(rewardCrystal);
}

function addPersonalPlaque() {
  // Create large ornate plaque base
  const plaqueBase = new THREE.BoxGeometry(20, 12, 0.5);
  const plaqueMaterial = new THREE.MeshPhongMaterial({
    color: 0x8b4513,
    shininess: 50,
  });

  const plaque = new THREE.Mesh(plaqueBase, plaqueMaterial);
  plaque.position.set(0, 8, -50); // Moved back and larger

  // Add golden frame
  const frameGeometry = new THREE.BoxGeometry(21, 13, 0.3);
  const frameMaterial = new THREE.MeshPhongMaterial({
    color: 0xffd700,
    shininess: 100,
  });

  const frame = new THREE.Mesh(frameGeometry, frameMaterial);
  frame.position.copy(plaque.position);
  frame.position.z -= 0.1;

  // Create canvas for text and image - larger canvas
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = 800;
  canvas.height = 600;

  // Background
  context.fillStyle = "#2C1810";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Border
  context.strokeStyle = "#FFD700";
  context.lineWidth = 12;
  context.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);

  // Title - much larger
  context.fillStyle = "#FFD700";
  context.font = "bold 48px Arial";
  context.textAlign = "center";
  context.fillText("WELCOME EXPLORER!", canvas.width / 2, 80);

  // Subtitle - larger
  context.fillStyle = "#FFFFFF";
  context.font = "32px Arial";
  context.fillText("Space Pioneer & Developer", canvas.width / 2, 130);

  // Description - larger and more readable
  context.fillStyle = "#CCCCCC";
  context.font = "24px Arial";
  context.fillText("Your cosmic adventure begins here", canvas.width / 2, 180);
  context.fillText(
    "Explore the universe of possibilities",
    canvas.width / 2,
    220
  );

  // Mission briefing
  context.fillStyle = "#FFD700";
  context.font = "28px Arial";
  context.fillText("MISSION BRIEFING", canvas.width / 2, 280);

  context.fillStyle = "#FFFFFF";
  context.font = "20px Arial";
  context.fillText("• Collect 15 cosmic crystals", canvas.width / 2, 320);
  context.fillText("• Explore the parkour tower", canvas.width / 2, 350);
  context.fillText("• Discover interactive totems", canvas.width / 2, 380);
  context.fillText("• Master both camera modes (R key)", canvas.width / 2, 410);

  // Controls
  context.fillStyle = "#88AAFF";
  context.font = "18px Arial";
  context.fillText(
    "WASD: Move | Mouse: Look | Space: Jump | R: Switch View",
    canvas.width / 2,
    460
  );

  // Profile area placeholder - larger
  context.fillStyle = "#444444";
  context.fillRect(canvas.width / 2 - 75, 480, 150, 80);
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

  const textPlane = new THREE.PlaneGeometry(19, 11); // Larger plane to match plaque
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
    // Create modern holographic totem base
    const baseGeometry = new THREE.CylinderGeometry(5, 6, 1, 8);
    const baseMaterial = new THREE.MeshPhongMaterial({
      color: 0x4a0080,
      emissive: 0x4a0080,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.8,
      shininess: 100,
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

    // Position the entire totem (centered around origin)
    const totalTotems = data.length;
    const spacing = 40;
    const offset = ((totalTotems - 1) * spacing) / 2;
    totemGroup.position.set(index * spacing - offset, 1, -30); // Centered and in front

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
        createTimeout(() => {
          setupInstructionsClickListener();
        }, 100);
      }
    }
  };

  const onPointerLockError = () => {
    if (isComponentMounted) {
      console.log("Pointer lock failed");
    }
    // Only show instructions if we're in first person mode
    if (!thirdPerson.value) {
      instructionsVisible.value = true;
      // Re-setup the click listener on error
      createTimeout(() => {
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

  // Track event listeners for cleanup
  eventListeners.push(
    { element: document, event: "pointerlockchange", handler: onPointerLockChange },
    { element: document, event: "mozpointerlockchange", handler: onPointerLockChange },
    { element: document, event: "webkitpointerlockchange", handler: onPointerLockChange },
    { element: document, event: "pointerlockerror", handler: onPointerLockError },
    { element: document, event: "mozpointerlockerror", handler: onPointerLockError },
    { element: document, event: "webkitpointerlockerror", handler: onPointerLockError }
  );

  // Setup click listener for instructions
  setupInstructionsClickListener();
}

function setupInstructionsClickListener() {
  // Only setup if we're in first person mode
  if (thirdPerson.value) {
    return;
  }

  // Wait for Vue to update the DOM
  createTimeout(() => {
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
      if (isComponentMounted) {
        console.log("Instructions click listener setup");
      }
    } else {
      // If not ready, try again (but only if still in first person)
      if (!thirdPerson.value) {
        createTimeout(() => {
          setupInstructionsClickListener();
        }, 100);
      }
    }
  }, 50);
}

// Handle click on instructions
function handleInstructionsClick(event) {
  if (isComponentMounted) {
    console.log("Instructions clicked");
  }
  event.preventDefault();
  event.stopPropagation();

  if (
    renderer.domElement &&
    !thirdPerson.value &&
    !document.pointerLockElement
  ) {
    if (isComponentMounted) {
      console.log("Requesting pointer lock");
    }
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
        // Only allow jump if on ground or platform (not flying)
        if (canJump || onPlatform) {
          velocity.y = 350;
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

  // Track event listeners for cleanup
  eventListeners.push(
    { element: document, event: "keydown", handler: onKeyDown },
    { element: document, event: "keyup", handler: onKeyUp }
  );
}

function setupMouseClick() {
  document.addEventListener("click", onDocumentClick);

  // Track event listener for cleanup
  eventListeners.push({ element: document, event: "click", handler: onDocumentClick });
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

      // Animate floating stepping stones
      if (objectType === "stepping-stone") {
        child.position.y =
          child.userData.originalY +
          Math.sin(time * child.userData.floatSpeed) * 1.5;
        child.rotation.x += 0.01;
        child.rotation.z += 0.005;
      }

      // Animate platform edges
      if (objectType === "platform") {
        // Find associated edge (next sibling)
        const edgeIndex = scene.children.indexOf(child) + 1;
        if (edgeIndex < scene.children.length) {
          const edge = scene.children[edgeIndex];
          if (edge.geometry && edge.geometry.type === "TorusGeometry") {
            edge.rotation.y += 0.02;
            edge.material.emissiveIntensity =
              0.8 + Math.sin(time * 0.005) * 0.3;
          }
        }
      }

      // Rotate monoliths slowly
      if (objectType === "monolith") {
        child.rotation.y += 0.001;
      }
    }

    // Animate totem elements
    if (child.userData.crystalGroup) {
      child.userData.crystalGroup.children.forEach((crystal) => {
        // Floating motion
        crystal.position.y =
          crystal.userData.originalY +
          Math.sin(time * crystal.userData.floatSpeed) * 0.8;
        // Rotation
        crystal.rotation.x += crystal.userData.rotationSpeed;
        crystal.rotation.y += crystal.userData.rotationSpeed * 0.7;
      });
    }

    if (child.userData.ringGroup) {
      child.userData.ringGroup.children.forEach((ring) => {
        ring.rotation.z += ring.userData.rotationSpeed;
      });
    }

    // Animate reward crystal (golden crystal at summit)
    if (child.userData.type === "reward-crystal") {
      child.rotation.y += 0.03;
      child.rotation.x += 0.01;
      child.position.y = child.position.y + Math.sin(time * 0.002) * 0.3;
    }

    // Animate spiral platform rings
    if (child.userData.floatSpeed) {
      child.rotation.y += child.userData.floatSpeed;
      child.material.emissiveIntensity = 0.8 + Math.sin(time * 0.003) * 0.2;
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
    // For first-person, get camera position directly
    playerPosition = camera.position.clone();
  }

  // Check each crystal for proximity (search through all objects)
  const crystalsToCheck = [];
  scene.traverse((child) => {
    if (
      child.userData.info &&
      child.userData.info.type === "ground-crystal" &&
      !child.userData.collected
    ) {
      crystalsToCheck.push(child);
    }
  });

  crystalsToCheck.forEach((child) => {
    const distance = playerPosition.distanceTo(child.position);

    // Debug logging for first-person mode
    if (!thirdPerson.value && isComponentMounted) {
/*       console.log("First-person crystal check:", {
        playerPos: playerPosition,
        crystalPos: child.position,
        distance: distance,
        threshold: 8,
      }); */
    }

    // Collect crystal if player is close enough (larger detection radius for first-person)
    const detectionRadius = thirdPerson.value ? 5 : 8;
    if (distance < detectionRadius) {
      // Collect crystal
      child.userData.collected = true;
      crystalCounter.value++;

      // Make crystal disappear with effect
      child.material.emissiveIntensity = 1.0;
      child.scale.setScalar(1.5);

      // Play collection sound effect (visual feedback)
      const particles = createCollectionEffect(child.position);
      scene.add(particles);

      createTimeout(() => {
        if (scene && isComponentMounted) {
          scene.remove(child);
          scene.remove(particles);
        }
      }, 500);

      // Update description for remaining crystals
      scene.traverse((otherChild) => {
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

      // Check if all crystals collected
      if (crystalCounter.value === 15) {
        showAchievement(
          "🏆 CRYSTAL MASTER!",
          "Congratulations! You've collected all 15 energy crystals! The cosmic energy flows through you!"
        );
      }

      // Auto-hide message after 2 seconds
      createTimeout(() => {
        if (selectedTotem.value && selectedTotem.value.type === "collection" && isComponentMounted) {
          selectedTotem.value = null;
        }
      }, 2000);
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

function checkObjectHover() {
  // Create raycaster from camera center (where player is looking)
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const intersect = intersects[0];
    if (intersect.object.userData.info && intersect.distance < 50) {
      // Show info for object being looked at
      hoveredObject.value = intersect.object.userData.info;
    } else {
      hoveredObject.value = null;
    }
  } else {
    hoveredObject.value = null;
  }
}

function showAchievement(title, description, duration = 5000) {
  achievementMessage.value = { title, description };
  createTimeout(() => {
    if (isComponentMounted) {
      achievementMessage.value = null;
    }
  }, duration);
}

function checkPlatformCollisions() {
  // Get player position
  let playerPosition;
  if (thirdPerson.value && model) {
    playerPosition = model.position.clone();
  } else {
    playerPosition = controls.getObject().position.clone();
  }

  let highestPlatform = -1; // -1 means no platform found
  let onPlatform = false;

  // Check all platforms and objects for collision
  scene.children.forEach((child) => {
    if (child.userData.info) {
      const objectType = child.userData.info.type;

      // Check if player is on a platform or structure
      if (
        objectType === "spiral-platform" ||
        objectType === "platform" ||
        objectType === "parkour-base" ||
        objectType === "summit" ||
        objectType === "ledge" ||
        objectType === "connecting-beam"
      ) {
        const platform = child;
        const platformPos = platform.position;

        // Calculate distance on XZ plane
        const distanceXZ = Math.sqrt(
          Math.pow(playerPosition.x - platformPos.x, 2) +
            Math.pow(playerPosition.z - platformPos.z, 2)
        );

        // Determine platform radius based on geometry (doubled to match visual size)
        let platformRadius = 8; // default (doubled from 4)
        if (objectType === "parkour-base")
          platformRadius = 20; // doubled from 10
        else if (objectType === "summit")
          platformRadius = 16; // doubled from 8
        else if (objectType === "ledge")
          platformRadius = 8; // doubled from 4
        else if (objectType === "spiral-platform")
          platformRadius = 8; // doubled from 4 to match visual radius of 6-7
        else if (objectType === "connecting-beam") platformRadius = 4; // doubled from 2

        // If player is within platform bounds horizontally
        if (distanceXZ <= platformRadius) {
          // Get platform top height
          const platformTop =
            platformPos.y + (platform.geometry.parameters?.height || 1);

          // Check if player is at the right height to be "on" the platform
          const playerBottom =
            thirdPerson.value && model
              ? playerPosition.y
              : playerPosition.y - 10; // Account for camera height offset

          // Player is on platform if they're close to the platform height
          // Use a more tolerant range for stability and easier parkour
          const heightDifference = playerBottom - platformTop;

          if (
            heightDifference >= -5 && // Player can be more below platform (increased landing tolerance)
            heightDifference <= 2 && // Player can be slightly above platform
            platformTop > highestPlatform
          ) {
            highestPlatform = platformTop;
            onPlatform = true;
          }
        }
      }
    }
  });

  // Return collision info
  return {
    onPlatform: onPlatform,
    platformHeight: highestPlatform,
    groundLevel: 0, // Default ground level
  };
}

function updatePlatformState() {
  const collision = checkPlatformCollisions();
  onPlatform = collision.onPlatform;
  currentPlatformHeight = collision.platformHeight;
  return collision;
}

function createGalaxySkybox() {
  // Create a large sphere for the skybox
  const skyGeometry = new THREE.SphereGeometry(500, 64, 64);

  // Create shader material for galaxy effect
  const skyMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      resolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec2 resolution;
      varying vec3 vWorldPosition;
      varying vec2 vUv;
      
      // Improved noise functions
      vec3 random3(vec3 c) {
        float j = 4096.0 * sin(dot(c, vec3(17.0, 59.4, 15.0)));
        vec3 r;
        r.z = fract(512.0 * j);
        j *= .125;
        r.x = fract(512.0 * j);
        j *= .125;
        r.y = fract(512.0 * j);
        return r - 0.5;
      }
      
      float simplex3d(vec3 p) {
        const float F3 = 0.3333333;
        const float G3 = 0.1666667;
        
        vec3 s = floor(p + dot(p, vec3(F3)));
        vec3 x = p - s + dot(s, vec3(G3));
        
        vec3 e = step(vec3(0.0), x - x.yzx);
        vec3 i1 = e * (1.0 - e.zxy);
        vec3 i2 = 1.0 - e.zxy * (1.0 - e);
        
        vec3 x1 = x - i1 + G3;
        vec3 x2 = x - i2 + 2.0 * G3;
        vec3 x3 = x - 1.0 + 3.0 * G3;
        
        vec4 w, d;
        
        w.x = dot(x, x);
        w.y = dot(x1, x1);
        w.z = dot(x2, x2);
        w.w = dot(x3, x3);
        
        w = max(0.6 - w, 0.0);
        
        d.x = dot(random3(s), x);
        d.y = dot(random3(s + i1), x1);
        d.z = dot(random3(s + i2), x2);
        d.w = dot(random3(s + 1.0), x3);
        
        w *= w;
        w *= w;
        d *= w;
        
        return dot(d, vec4(52.0));
      }
      
      float fbm(vec3 p) {
        float f = 0.0;
        f += 0.5000 * simplex3d(p); p *= 2.01;
        f += 0.2500 * simplex3d(p); p *= 2.02;
        f += 0.1250 * simplex3d(p); p *= 2.03;
        f += 0.0625 * simplex3d(p);
        return f;
      }
      
      void main() {
        vec3 direction = normalize(vWorldPosition);
        
        // Create base galaxy colors
        vec3 deepSpace = vec3(0.02, 0.0, 0.08);
        vec3 purpleNebula = vec3(0.4, 0.1, 0.8);
        vec3 pinkNebula = vec3(0.8, 0.2, 0.6);
        vec3 blueNebula = vec3(0.1, 0.3, 0.9);
        vec3 starColor = vec3(1.0, 0.9, 0.8);
        
        // Base gradient from horizon to zenith
        float horizonGradient = abs(direction.y);
        vec3 baseColor = mix(deepSpace, purpleNebula * 0.3, smoothstep(0.0, 1.0, horizonGradient));
        
        // Create galaxy disk using cylindrical coordinates
        float radius = length(vec2(direction.x, direction.z));
        float angle = atan(direction.z, direction.x);
        
        // Galaxy spiral arms
        float spiralTime = time * 0.01;
        float spiral1 = sin(angle * 2.0 - radius * 8.0 + spiralTime) * 0.5 + 0.5;
        float spiral2 = sin(angle * 2.0 - radius * 8.0 + spiralTime + 3.14159) * 0.5 + 0.5;
        
        // Combine spirals
        float spiralPattern = max(spiral1, spiral2);
        spiralPattern = pow(spiralPattern, 3.0);
        
        // Galaxy brightness falloff
        float galaxyMask = exp(-radius * 2.0) * (1.0 - abs(direction.y) * 2.0);
        galaxyMask = max(0.0, galaxyMask);
        
        // Nebula clouds using fractal noise
        vec3 noisePos = direction * 3.0 + vec3(time * 0.01, time * 0.005, time * 0.008);
        float nebula = fbm(noisePos);
        nebula = smoothstep(-0.2, 0.8, nebula);
        
        // Different nebula layers
        float nebula2 = fbm(direction * 5.0 + vec3(time * 0.02));
        nebula2 = smoothstep(0.0, 0.6, nebula2);
        
        // Color the nebulae
        vec3 nebulaColor = mix(purpleNebula, pinkNebula, nebula2);
        nebulaColor = mix(nebulaColor, blueNebula, sin(time * 0.1) * 0.5 + 0.5);
        
        // Apply nebula to base color
        baseColor = mix(baseColor, nebulaColor, nebula * 0.7 * galaxyMask);
        
        // Add spiral arms
        vec3 spiralColor = mix(pinkNebula, purpleNebula, sin(time * 0.05 + angle) * 0.5 + 0.5);
        baseColor = mix(baseColor, spiralColor, spiralPattern * galaxyMask * 0.8);
        
        // Generate stars
        vec3 starPos = direction * 50.0;
        float stars = 0.0;
        
        // Multiple star layers for depth
        for(int i = 0; i < 4; i++) {
          vec3 layer = starPos * (1.0 + float(i) * 0.5);
          float noise = fbm(layer);
          float starMask = smoothstep(0.7, 0.9, noise);
          stars += starMask * (1.0 - float(i) * 0.2);
        }
        
        // Twinkling effect
        float twinkle = sin(time * 2.0 + stars * 100.0) * 0.3 + 0.7;
        stars *= twinkle;
        
        // Add stars to the scene
        baseColor = mix(baseColor, starColor, stars * 0.8);
        
        // Add some bright stars
        float brightStars = fbm(direction * 20.0);
        brightStars = smoothstep(0.85, 1.0, brightStars);
        baseColor += starColor * brightStars * 2.0 * twinkle;
        
        // Galaxy center glow
        float centerGlow = exp(-length(vec2(direction.x, direction.z)) * 5.0);
        centerGlow *= (1.0 - abs(direction.y));
        vec3 centerColor = mix(purpleNebula, vec3(1.0, 0.8, 0.4), 0.5);
        baseColor = mix(baseColor, centerColor, centerGlow * 0.3);
        
        // Final color enhancement
        baseColor = pow(baseColor, vec3(0.8)); // Gamma correction
        baseColor *= 1.2; // Brightness boost
        
        gl_FragColor = vec4(baseColor, 1.0);
      }
    `,
    side: THREE.BackSide,
  });

  const skybox = new THREE.Mesh(skyGeometry, skyMaterial);
  scene.add(skybox);

  // Store reference for animation
  window.galaxyMaterial = skyMaterial;
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
  if (!isComponentMounted) {
    return; // Stop animation if component is unmounted
  }

  animationFrameId = requestAnimationFrame(animate);

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

  // Check for object hover (looking at objects)
  checkObjectHover();

  // Check platform collisions
  checkPlatformCollisions();

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

        // Apply gravity and jumping for third person
        model.position.y += velocity.y * delta;

        // Check platform collisions
        const collision = updatePlatformState();

        if (collision.onPlatform) {
          // Set model to platform height and enable jumping
          if (model.position.y <= collision.platformHeight) {
            model.position.y = collision.platformHeight;
            velocity.y = 0;
            canJump = true;
          }
        } else {
          // Apply gravity when not on platform

          // Keep model on the ground (minimum)
          if (model.position.y < collision.groundLevel) {
            model.position.y = collision.groundLevel;
            velocity.y = 0;
            canJump = true;
          } else {
            canJump = false; // Can't jump while in air
          }
        }

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
        // Set target position to follow model including vertical movement
        const targetPosition = model.position.clone();
        targetPosition.y += 5; // Offset slightly above model center
        orbitControls.target.copy(targetPosition);

        // Smooth camera position update to follow jumping
        orbitControls.update();
      }
    }
  } else {
    // First person mode - use pointer lock controls
    if (controls.isLocked) {
      controls.moveRight(-velocity.x * delta);
      controls.moveForward(-velocity.z * delta);

      // Always apply gravity first
      controls.getObject().position.y += velocity.y * delta;

      // Check platform collisions after movement
      const collision = updatePlatformState();

      if (collision.onPlatform) {
        // Player is on a platform - adjust position and allow jumping
        const targetHeight = collision.platformHeight + 10;
        if (controls.getObject().position.y <= targetHeight) {
          controls.getObject().position.y = targetHeight;
          velocity.y = 0;
          canJump = true; // Can jump from platform
        }
      } else {
        // Ground collision (minimum height)
        if (controls.getObject().position.y < 10) {
          velocity.y = 0;
          controls.getObject().position.y = 10;
          canJump = true; // Can jump from ground
        } else {
          canJump = false; // Can't jump while in air
        }
      }
    }
  }

  // Update galaxy skybox animation
  if (window.galaxyMaterial) {
    window.galaxyMaterial.uniforms.time.value = time * 0.001;
    window.galaxyMaterial.uniforms.resolution.value.set(
      window.innerWidth,
      window.innerHeight
    );
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

      if (isComponentMounted) {
        console.log("Available animations:", Array.from(animationsMap.keys()));
      }
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
  background-color: rgba(45, 22, 80, 0.9);
  color: white;
  padding: 15px 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  font-weight: bold;
  border: 2px solid #cc99ff;
  box-shadow: 0 0 15px rgba(204, 153, 255, 0.3);
  z-index: 100;
}

.crystal-counter i {
  font-size: 1.2rem;
  animation: crystal-pulse 2s infinite;
}

.object-info-overlay {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: linear-gradient(
    135deg,
    rgba(45, 22, 80, 0.95),
    rgba(61, 26, 120, 0.95)
  );
  color: white;
  padding: 15px 20px;
  border-radius: 12px;
  border: 2px solid #cc99ff;
  box-shadow: 0 0 20px rgba(204, 153, 255, 0.4);
  max-width: 300px;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.object-info-overlay h4 {
  margin: 0 0 5px 0;
  color: #cc99ff;
  font-size: 1.2rem;
  text-shadow: 0 0 10px rgba(204, 153, 255, 0.6);
}

.object-info-overlay .subtitle {
  margin: 0 0 8px 0;
  color: #bb99ff;
  font-size: 0.9rem;
  font-style: italic;
}

.object-info-overlay .description {
  margin: 0;
  color: #ddccff;
  font-size: 0.85rem;
  line-height: 1.4;
}

.achievement-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(
    135deg,
    rgba(45, 22, 80, 0.98),
    rgba(74, 44, 122, 0.98)
  );
  color: white;
  padding: 30px 40px;
  border-radius: 20px;
  border: 3px solid #cc99ff;
  box-shadow: 0 0 40px rgba(204, 153, 255, 0.6);
  text-align: center;
  z-index: 1000;
  backdrop-filter: blur(15px);
  animation: achievementAppear 0.5s ease-out;
}

@keyframes achievementAppear {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.achievement-content i {
  font-size: 3rem;
  color: #ffdd44;
  margin-bottom: 15px;
  display: block;
  animation: achievementStar 2s ease-in-out infinite;
}

@keyframes achievementStar {
  0%,
  100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.1) rotate(5deg);
  }
}

.achievement-content h3 {
  margin: 0 0 10px 0;
  font-size: 1.8rem;
  color: #cc99ff;
  text-shadow: 0 0 15px rgba(204, 153, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.achievement-content p {
  margin: 0;
  font-size: 1rem;
  color: #ddccff;
  line-height: 1.5;
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
