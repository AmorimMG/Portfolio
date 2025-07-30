import { ref } from "vue";

export function usePointerLock(
  renderer,
  getInstructions,
  getBlocker,
  onLockChange
) {
  const instructionsVisible = ref(true);

  function showInstructions() {
    const instructionsComponent = getInstructions();

    if (instructionsComponent && instructionsComponent.instructions) {
      instructionsComponent.instructions.style.display = "";
    }
    if (instructionsComponent && instructionsComponent.blocker) {
      instructionsComponent.blocker.style.display = "block";
    }
    instructionsVisible.value = true;
  }

  function hideInstructions() {
    const instructionsComponent = getInstructions();

    if (instructionsComponent && instructionsComponent.instructions) {
      instructionsComponent.instructions.style.display = "none";
    }
    if (instructionsComponent && instructionsComponent.blocker) {
      instructionsComponent.blocker.style.display = "none";
    }
    instructionsVisible.value = false;
  }

  function handleInstructionsClick() {
    if (renderer.value && renderer.value.domElement) {
      // Check if pointer lock is available
      if (
        document.pointerLockElement ||
        document.mozPointerLockElement ||
        document.webkitPointerLockElement
      ) {
        return; // Already locked
      }

      try {
        // Request pointer lock without hiding instructions first
        renderer.value.domElement.requestPointerLock();
      } catch (error) {
        console.warn("Pointer lock request failed:", error);
      }
    }
  }

  function setupInstructionsListener() {
    const instructionsComponent = getInstructions();

    if (instructionsComponent && instructionsComponent.instructions) {
      instructionsComponent.instructions.removeEventListener(
        "click",
        handleInstructionsClick,
        false
      );
      instructionsComponent.instructions.addEventListener(
        "click",
        handleInstructionsClick,
        false
      );
    }
  }

  function setupPointerLockEvents() {
    const handlePointerLockChange = () => {
      const isLocked =
        document.pointerLockElement === renderer.value?.domElement ||
        document.mozPointerLockElement === renderer.value?.domElement ||
        document.webkitPointerLockElement === renderer.value?.domElement;

      if (isLocked) {
        hideInstructions();
        // Call optional callback when pointer lock is activated
        if (onLockChange) {
          onLockChange(true);
        }
      } else {
        showInstructions();
        // Call optional callback when pointer lock is deactivated
        if (onLockChange) {
          onLockChange(false);
        }
      }
    };

    document.addEventListener("pointerlockchange", handlePointerLockChange);
    document.addEventListener("mozpointerlockchange", handlePointerLockChange);
    document.addEventListener(
      "webkitpointerlockchange",
      handlePointerLockChange
    );

    // Return cleanup function
    return () => {
      document.removeEventListener(
        "pointerlockchange",
        handlePointerLockChange
      );
      document.removeEventListener(
        "mozpointerlockchange",
        handlePointerLockChange
      );
      document.removeEventListener(
        "webkitpointerlockchange",
        handlePointerLockChange
      );
    };
  }

  return {
    instructionsVisible,
    showInstructions,
    hideInstructions,
    handleInstructionsClick,
    setupInstructionsListener,
    setupPointerLockEvents,
  };
}
