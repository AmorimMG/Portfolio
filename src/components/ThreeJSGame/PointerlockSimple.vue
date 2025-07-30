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

  // Lights
  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
  scene.add(hemisphereLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Floor
  generateFloor();

  // Add stars
  addStars();

  // Start render loop
  animate();

  console.log("Three.js initialized");
}

function generateFloor() {
  let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
  floorGeometry.rotateX(-Math.PI / 2);

  // Displace vertices to simulate craters
  const position = floorGeometry.attributes.position;
  const vertex = new THREE.Vector3();
  const color = new THREE.Color();

  for (let i = 0, l = position.count; i < l; i++) {
    vertex.fromBufferAttribute(position, i);
    const displacement =
      Math.sin(vertex.x * 0.05) * Math.cos(vertex.z * 0.05) * Math.random() * 5;
    vertex.y += displacement;
    position.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  floorGeometry = floorGeometry.toNonIndexed();
  const colorsFloor = [];
  for (let i = 0, l = position.count; i < l; i++) {
    color.setHSL(0.6, 0.4, 0.4);
    colorsFloor.push(color.r, color.g, color.b);
  }
  floorGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colorsFloor, 3)
  );
  const floorMaterial = new THREE.MeshBasicMaterial({ vertexColors: true });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  scene.add(floor);
}

function addStars() {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.0,
    transparent: true,
    opacity: 0.9,
  });

  const starCount = 15000;
  const positions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount * 3; i += 3) {
    positions[i] = Math.random() * 3000 - 1500; // X
    positions[i + 1] = Math.random() * 3000 - 1500; // Y
    positions[i + 2] = Math.random() * 3000 - 1500; // Z
  }

  starGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}

function createTotems(data) {
  data.forEach((item, index) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 512;
    canvas.height = 1024;

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

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = item.img;
    img.onload = () => {
      context.drawImage(img, 0, 200, canvas.width, canvas.height - 200);
      const texture = new THREE.CanvasTexture(canvas);
      const geometry = new THREE.BoxGeometry(10, 20, 10);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const totem = new THREE.Mesh(geometry, material);
      totem.position.set(index * 30 - 30, 10, 30);
      totem.userData.link = item.link;
      totem.userData.info = {
        title: item.title,
        subtitle: item.subtitle,
        description: item.description,
        img: item.img,
      };
      scene.add(totem);
    };
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
  if (!controls.isLocked) return;

  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children);

  for (const intersect of intersects) {
    if (intersect.object.userData.link) {
      // Exit pointer lock and open link
      document.exitPointerLock();
      window.open(intersect.object.userData.link, "_blank");
      selectedTotem.value = intersect.object.userData.info;
      break;
    }
  }
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
        orbitControls.target.copy(model.position);
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
</style>
