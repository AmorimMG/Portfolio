<template>
  <div style="position: relative; width: 100%; height: 100vh; background: red">
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
    <div
      v-if="showInstructions"
      style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        cursor: pointer;
      "
      @click="startGame"
    >
      <div style="text-align: center">
        <h2>TESTE - Click to Start</h2>
        <p>Simple Three.js Test</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { onMounted, ref } from "vue";

const gameContainer = ref(null);
const showInstructions = ref(true);

let scene, camera, renderer, cube;

onMounted(() => {
  console.log("Test component mounted");
  initThreeJS();
});

function initThreeJS() {
  console.log("Initializing Three.js");

  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 5);
  camera.lookAt(0, 0, 0);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.top = "0";
  renderer.domElement.style.left = "0";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";

  if (gameContainer.value) {
    gameContainer.value.appendChild(renderer.domElement);
    console.log("Canvas added to container");
  }

  // Add a cube at origin
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, 0, 0);
  scene.add(cube);

  console.log("Cube added at position:", cube.position);

  // Add light
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1);
  scene.add(light);

  // Start animation
  animate();

  console.log("Three.js initialized");
}

function animate() {
  requestAnimationFrame(animate);

  if (cube) {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}

function startGame() {
  console.log("Starting game");
  showInstructions.value = false;
}
</script>
