import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { ref } from "vue";
import { CharacterControls } from "./characterControls";

export function useThirdPerson(renderer, scene) {
  const camera = ref(null);
  const orbitControls = ref(null);
  const model = ref(null);
  const mixer = ref(null);
  const characterControls = ref(null);
  const clock = new THREE.Clock();

  const keysPressed = ref({});
  let cleanupKeyListeners = null;

  function createThirdPersonCamera() {
    camera.value = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.value.position.set(0, 30, -80);
    return camera.value;
  }

  function createOrbitControls() {
    if (!renderer.value || !camera.value) return;

    orbitControls.value = new OrbitControls(
      camera.value,
      renderer.value.domElement
    );
    orbitControls.value.enableDamping = true;
    orbitControls.value.dampingFactor = 0.05;
    orbitControls.value.minDistance = 20;
    orbitControls.value.maxDistance = 200;
    orbitControls.value.enablePan = false;
    orbitControls.value.enableRotate = true;
    orbitControls.value.rotateSpeed = 0.5;
    orbitControls.value.maxPolarAngle = Math.PI / 1.5;
    orbitControls.value.minPolarAngle = Math.PI / 6;
    orbitControls.value.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: null,
      RIGHT: null,
    };
    orbitControls.value.target.set(0, 15, 0);
    orbitControls.value.update();

    return orbitControls.value;
  }

  function setupThirdPersonControls(speed) {
    const onKeyDown = (event) => {
      if (event.code === "Space") {
        keysPressed.value[" "] = true;
      } else {
        keysPressed.value[event.key.toLowerCase()] = true;
      }
      if (event.key === "Shift" && characterControls.value) {
        characterControls.value.toggleRun(true);
      }
    };

    const onKeyUp = (event) => {
      if (event.code === "Space") {
        keysPressed.value[" "] = false;
      } else {
        keysPressed.value[event.key.toLowerCase()] = false;
      }
      if (event.key === "Shift" && characterControls.value) {
        characterControls.value.toggleRun(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    // Return cleanup function
    cleanupKeyListeners = () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };

    return cleanupKeyListeners;
  }

  function loadCharacterModel(speed) {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        "/threejs/models/Soldier.glb",
        (gltf) => {
          model.value = gltf.scene;
          model.value.scale.set(10, 10, 10);
          model.value.traverse((object) => {
            if (object.isMesh) object.castShadow = true;
          });

          if (scene.value) {
            scene.value.add(model.value);
          }

          mixer.value = new THREE.AnimationMixer(model.value);
          const gltfAnimations = gltf.animations;
          const animationsMap = new Map();
          gltfAnimations.forEach((a) => {
            animationsMap.set(a.name, mixer.value.clipAction(a));
          });

          characterControls.value = new CharacterControls(
            model.value,
            mixer.value,
            animationsMap,
            orbitControls.value,
            camera.value,
            "Idle",
            speed
          );

          resolve(characterControls.value);
        },
        undefined,
        (error) => {
          reject(error);
        }
      );
    });
  }

  function startThirdPersonAnimation(canRender) {
    if (!renderer.value || !camera.value) return;

    function animate() {
      if (!canRender.value) return;

      const delta = clock.getDelta();
      if (characterControls.value) {
        characterControls.value.update(delta, keysPressed.value);
      }
      if (orbitControls.value) {
        orbitControls.value.update();
      }

      // Direct access to the values without using refs in render
      try {
        renderer.value.render(scene.value, camera.value);
      } catch (error) {
        console.error("Render error:", error);
      }
    }

    renderer.value.setAnimationLoop(animate);
  }

  function stopThirdPersonAnimation() {
    if (renderer.value) {
      renderer.value.setAnimationLoop(null);
    }
  }

  function cleanupThirdPerson() {
    stopThirdPersonAnimation();

    if (model.value && scene.value) {
      scene.value.remove(model.value);
      model.value = null;
    }

    if (mixer.value) {
      mixer.value.stopAllAction();
      mixer.value = null;
    }

    if (orbitControls.value) {
      orbitControls.value.dispose();
      orbitControls.value = null;
    }

    if (cleanupKeyListeners) {
      cleanupKeyListeners();
      cleanupKeyListeners = null;
    }

    characterControls.value = null;
    keysPressed.value = {};
  }

  return {
    camera,
    orbitControls,
    model,
    mixer,
    characterControls,
    keysPressed,
    createThirdPersonCamera,
    createOrbitControls,
    setupThirdPersonControls,
    loadCharacterModel,
    startThirdPersonAnimation,
    stopThirdPersonAnimation,
    cleanupThirdPerson,
  };
}
