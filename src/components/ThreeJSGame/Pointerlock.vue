<script setup>
import * as THREE from "three";
import { nextTick, onMounted, ref } from "vue";
import { RESTAPI } from "../../service/api";
import InfoOverlay from "./overlays/InfoOverlay.vue";
import InstructionsOverlay from "./overlays/InstructionsOverlay.vue";
import { useFirstPerson } from "./useFirstPerson";
import { usePointerLock } from "./usePointerLock";
import { useScene } from "./useScene";
import { useThirdPerson } from "./useThirdPerson";
/* import { KeyDisplay } from '../ThreeJSGame/keys'; */

const rendererRef = ref(null);
const instructionsRef = ref(null);
const blockerRef = ref(null);

const {
  instructionsVisible,
  showInstructions,
  hideInstructions,
  setupInstructionsListener,
  setupPointerLockEvents,
} = usePointerLock(
  rendererRef,
  () => instructionsRef.value,
  () => instructionsRef.value,
  (isLocked) => {
    // This callback is called when pointer lock changes
    if (isLocked) {
      // Pointer lock is active, start animation
      canRender.value = true;
      if (!thirdPerson.value) {
        startFirstPersonAnimation(speed, canRender);
      }
    } else {
      // Pointer lock is not active, stop animation
      canRender.value = false;
      if (!thirdPerson.value) {
        stopFirstPersonAnimation();
      }
    }
  }
);

const { scene, createScene, generateFloor, addToScene, removeFromScene } =
  useScene();

const {
  camera: firstPersonCamera,
  controls: firstPersonControls,
  createFirstPersonCamera,
  createFirstPersonControls,
  setupFirstPersonControls,
  startFirstPersonAnimation,
  stopFirstPersonAnimation,
  cleanupFirstPerson,
} = useFirstPerson(rendererRef, scene);

const {
  camera: thirdPersonCamera,
  orbitControls,
  model,
  mixer,
  characterControls,
  createThirdPersonCamera,
  createOrbitControls,
  setupThirdPersonControls,
  loadCharacterModel,
  startThirdPersonAnimation,
  stopThirdPersonAnimation,
  cleanupThirdPerson,
} = useThirdPerson(rendererRef, scene);

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

// Variáveis globais
let camera, renderer;
const objects = [];
let prevTime = performance.now();

// Refs

const blocker = ref(null);
const instructions = ref(null);
const firstPersonContainer = ref(null);
const thirdPersonContainer = ref(null);
const selectedTotem = ref(null);
const speed = ref(1200.0);
const toggleRun = ref(false);
const thirdPerson = ref(false);
const canRender = ref(true);

// Variáveis do modelo e animação
let characterModel = null;

onMounted(async () => {
  console.log("Pointerlock component mounted");

  // Initialize base scene using composable
  createScene();

  // Wait for next tick to ensure components are mounted
  await nextTick();

  // Now create renderer after DOM is ready
  createRenderer();
  rendererRef.value = renderer;
  generateFloor();

  // Setup pointer lock instructions overlay
  setupInstructionsListener();
  const cleanupPointerLock = setupPointerLockEvents();

  // Setup global key listeners
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  // Start basic render loop immediately
  function simpleRenderLoop() {
    if (renderer && scene.value && camera) {
      renderer.render(scene.value, camera);
    }
    requestAnimationFrame(simpleRenderLoop);
  }

  // Initialize camera controls and start first person mode
  const init = async () => {
    try {
      const response = await RESTAPI.ProjetoObterTodos();
      await createTotems(response.data);

      // Start in first person mode
      thirdPerson.value = false;
      FirstPerson();

      // Start render loop
      simpleRenderLoop();

      console.log("Initialization complete, render loop started");
    } catch (error) {
      console.error("Error initializing scene:", error);
    }
  };

  init();
});

function createRenderer() {
  if (renderer) {
    // Stop any existing render loop
    renderer.setAnimationLoop(null);

    // Clean up existing renderer
    if (renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
    renderer.dispose();
  }

  // Create new renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Add canvas styling to ensure it's visible
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = "0";
  renderer.domElement.style.left = "0";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  renderer.domElement.style.zIndex = "1";

  if (firstPersonContainer.value) {
    firstPersonContainer.value.appendChild(renderer.domElement);
    console.log(
      "Canvas added to DOM, size:",
      renderer.domElement.width,
      "x",
      renderer.domElement.height
    );
  }

  // Set up resize handler
  window.removeEventListener("resize", onWindowResize);
  window.addEventListener("resize", onWindowResize);
}

/* function generateObjects() {
    // Create objects
    const boxGeometry = new THREE.BoxGeometry(20, 20, 20).toNonIndexed();
    var position = boxGeometry.attributes.position;
    const colorsBox = [];
    for (let i = 0, l = position.count; i < l; i++) {
        color.setHSL(Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
        colorsBox.push(color.r, color.g, color.b);
    }
    boxGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsBox, 3));
    for (let i = 0; i < 500; i++) {
        const boxMaterial = new THREE.MeshPhongMaterial({ specular: 0xffffff, flatShading: true, vertexColors: true });
        boxMaterial.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.x = Math.floor(Math.random() * 20 - 10) * 20;
        box.position.y = Math.floor(Math.random() * 20) * 20 + 10;
        box.position.z = Math.floor(Math.random() * 20 - 10) * 20;
        scene.add(box);
        objects.push(box);
    }
}
 */

function switchRunToggle() {
  toggleRun.value = !toggleRun.value;
  if (toggleRun.value) {
    speed.value = 12000.0; // Velocidade de corrida aumentada
  } else {
    speed.value = 1200.0; // Velocidade normal
  }
}

function onKeyDown(event) {
  switch (event.code) {
    case "ShiftLeft":
      switchRunToggle();
      break;
    case "KeyR":
      // Toggle mode
      thirdPerson.value = !thirdPerson.value;

      // Initialize new mode
      if (thirdPerson.value) {
        setTimeout(() => ThirdPerson(), 100); // Small delay for cleanup
      } else {
        FirstPerson();
      }
      break;
  }
}

function onKeyUp(event) {
  // Only handle global keys that are not handled by composables
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  /*     keyDisplayQueue.updatePosition(); */

  window.addEventListener("resize", onWindowResize);
}

function createTotems(data) {
  const totems = [];

  data.forEach((item, index) => {
    // Create a canvas element
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Set canvas size (match the size of the totem face)
    canvas.width = 512;
    canvas.height = 1024;

    // Draw the content onto the canvas
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "black";
    context.font = "24px Arial";
    context.textAlign = "center";
    context.fillText(item.title, canvas.width / 2, 50);
    context.font = "20px Arial";
    context.fillText(item.subtitle, canvas.width / 2, 100);
    context.font = "16px Arial";
    context.fillText(item.description, canvas.width / 2, 150);

    // Load the image
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Ensure cross-origin images are handled
    img.src = item.img;
    img.onload = () => {
      // Draw the image on the canvas after it's loaded
      context.drawImage(img, 0, 200, canvas.width, canvas.height - 200);
      const texture = new THREE.CanvasTexture(canvas);

      // Create totem geometry and material
      const geometry = new THREE.BoxGeometry(10, 20, 10);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const totem = new THREE.Mesh(geometry, material);

      // Position the totem
      totem.position.set(index * 30 - 30, 10, 30); // Adjust positions as needed

      // Store the link in the totem's userData
      totem.userData.link = item.link;

      // Add the totem to the scene and the array
      scene.value.add(totem);
      totems.push(totem);
    };
  });

  return totems;
}

function onDocumentClick(event) {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.camera = camera;
  raycaster.ray = new THREE.Ray(
    camera.position,
    new THREE.Vector3(mouse.x, mouse.y, 1)
      .unproject(camera)
      .sub(camera.position)
      .normalize()
  );

  const intersects = raycaster.intersectObjects(scene.value.children);

  for (const intersect of intersects) {
    if (intersect.object.userData.link) {
      instructions.value.style.display = "none";
      blocker.value.style.display = "none";
      if (!instructionsVisible.value) {
        window.open(intersect.object.userData.link, "_blank");
        selectedTotem.value = intersect.object.userData.info;
        break;
      }
    } else {
      selectedTotem.value = null;
    }
  }
}

function FirstPerson() {
  console.log("Setting up FirstPerson mode");

  // Clean up third person mode
  cleanupThirdPerson();

  // Create first person camera and controls
  createFirstPersonCamera();
  createFirstPersonControls();

  // Set up camera as the main camera
  camera = firstPersonCamera.value;

  console.log("FirstPerson camera setup complete:", {
    camera: !!camera,
    renderer: !!renderer,
    scene: !!scene.value,
  });

  // Setup event listeners
  setupFirstPersonControls(speed);

  // Don't start animation loop here - it's handled in the main mount

  // Show instructions overlay after camera setup
  showInstructions();
}

function ThirdPerson() {
  if (!canRender.value) return;

  // Clean up first person mode
  cleanupFirstPerson();

  // Hide instructions overlay
  hideInstructions();

  // Create third person camera and controls
  createThirdPersonCamera();
  createOrbitControls();

  // Set up camera as the main camera
  camera = thirdPersonCamera.value;

  // Setup event listeners
  setupThirdPersonControls(speed);

  // Load character model and start animation
  loadCharacterModel(speed)
    .then(() => {
      startThirdPersonAnimation(canRender);
    })
    .catch((error) => {
      console.error("Error loading character model:", error);
    });
}
</script>

<template>
  <div style="position: relative; width: 100%; height: 100vh; overflow: hidden">
    <div
      ref="firstPersonContainer"
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"
    ></div>
    <div
      ref="thirdPersonContainer"
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"
    ></div>
    <InstructionsOverlay v-if="instructionsVisible" ref="instructionsRef" />
    <div class="info-overlay">
      <i class="pi pi-bolt" v-if="toggleRun"></i><br v-if="toggleRun" />
      <i class="pi pi-users" v-if="thirdPerson"></i>
      <i class="pi pi-user" v-if="!thirdPerson"></i>
    </div>
    <InfoOverlay v-if="selectedTotem" :totem="selectedTotem" />
    <div
      id="key-display"
      style="position: absolute; top: 0; left: 0; z-index: 1000"
    ></div>
  </div>
</template>

<style scoped>
.blocker {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.instructions {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
  color: white;
}

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
}
</style>
