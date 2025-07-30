import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { ref } from "vue";

export function useFirstPerson(renderer, scene) {
  const camera = ref(null);
  const controls = ref(null);
  const velocity = new THREE.Vector3();
  const direction = new THREE.Vector3();

  // Movement state
  const moveForward = ref(false);
  const moveBackward = ref(false);
  const moveLeft = ref(false);
  const moveRight = ref(false);
  const canJump = ref(false);

  let prevTime = performance.now();
  let animationId = null;

  function createFirstPersonCamera() {
    camera.value = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.value.position.y = 10;
    return camera.value;
  }

  function createFirstPersonControls() {
    if (!renderer.value || !camera.value) return;

    controls.value = new PointerLockControls(
      camera.value,
      renderer.value.domElement
    );

    if (scene.value) {
      scene.value.add(controls.value.getObject());
      controls.value.getObject().position.set(0, 10, 0);
    }

    return controls.value;
  }

  function setupFirstPersonControls(speed) {
    if (!controls.value || !renderer.value) return;

    const raycaster = new THREE.Raycaster(
      new THREE.Vector3(),
      new THREE.Vector3(0, -1, 0),
      0,
      10
    );

    // Key event handlers
    const onKeyDown = (event) => {
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          moveForward.value = true;
          break;
        case "ArrowLeft":
        case "KeyA":
          moveLeft.value = true;
          break;
        case "ArrowDown":
        case "KeyS":
          moveBackward.value = true;
          break;
        case "ArrowRight":
        case "KeyD":
          moveRight.value = true;
          break;
        case "Space":
          if (canJump.value === true) velocity.y += 350;
          canJump.value = false;
          break;
      }
    };

    const onKeyUp = (event) => {
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          moveForward.value = false;
          break;
        case "ArrowLeft":
        case "KeyA":
          moveLeft.value = false;
          break;
        case "ArrowDown":
        case "KeyS":
          moveBackward.value = false;
          break;
        case "ArrowRight":
        case "KeyD":
          moveRight.value = false;
          break;
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    // Return cleanup function
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }

  function startFirstPersonAnimation(speed, canRender) {
    if (!controls.value || !renderer.value || !camera.value) return;

    function animate() {
      // Always render, regardless of canRender state
      const time = performance.now();
      const delta = (time - prevTime) / 1000;

      velocity.x -= velocity.x * 10.0 * delta;
      velocity.z -= velocity.z * 10.0 * delta;
      velocity.y -= 9.8 * 100.0 * delta;

      direction.z = Number(moveForward.value) - Number(moveBackward.value);
      direction.x = Number(moveRight.value) - Number(moveLeft.value);
      direction.normalize();

      if (moveForward.value || moveBackward.value)
        velocity.z -= direction.z * speed.value * delta;
      if (moveLeft.value || moveRight.value)
        velocity.x -= direction.x * speed.value * delta;

      if (controls.value) {
        controls.value.moveRight(-velocity.x * delta);
        controls.value.moveForward(-velocity.z * delta);

        controls.value.getObject().position.y += velocity.y * delta;
        if (controls.value.getObject().position.y < 10) {
          velocity.y = 0;
          controls.value.getObject().position.y = 10;
          canJump.value = true;
        }
      }

      prevTime = time;

      // Always render
      try {
        if (renderer.value && scene.value && camera.value) {
          renderer.value.render(scene.value, camera.value);
        }
      } catch (error) {
        console.error("Render error:", error);
      }
    }

    renderer.value.setAnimationLoop(animate);
  }

  function stopFirstPersonAnimation() {
    if (renderer.value) {
      renderer.value.setAnimationLoop(null);
    }
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  function cleanupFirstPerson() {
    stopFirstPersonAnimation();

    if (controls.value && scene.value) {
      scene.value.remove(controls.value.getObject());
      if (controls.value.dispose) {
        controls.value.dispose();
      }
      controls.value = null;
    }

    // Reset movement state
    moveForward.value = false;
    moveBackward.value = false;
    moveLeft.value = false;
    moveRight.value = false;
    canJump.value = false;
  }

  return {
    camera,
    controls,
    moveForward,
    moveBackward,
    moveLeft,
    moveRight,
    canJump,
    createFirstPersonCamera,
    createFirstPersonControls,
    setupFirstPersonControls,
    startFirstPersonAnimation,
    stopFirstPersonAnimation,
    cleanupFirstPerson,
  };
}
