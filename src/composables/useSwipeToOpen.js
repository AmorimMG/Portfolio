import { onUnmounted, ref, watch } from "vue";

export function useSwipeToOpen(targetRef, onSwipeDown) {
  let touchStartY = 0;
  const element = ref(null);

  const onTouchStart = (e) => {
    touchStartY = e.touches[0].clientY;
  };

  const onTouchMove = (e) => {
    const touchY = e.touches[0].clientY;
    const deltaY = touchY - touchStartY;

    if (deltaY > 50) {
      // Swipe down threshold
      if (typeof onSwipeDown === "function") {
        onSwipeDown();
      }
    }
  };

  const cleanup = () => {
    if (element.value) {
      element.value.removeEventListener("touchstart", onTouchStart);
      element.value.removeEventListener("touchmove", onTouchMove);
    }
  };

  watch(
    targetRef,
    (newTarget) => {
      cleanup(); // Clean up previous listeners

      if (newTarget) {
        // For PrimeVue components, the element is in $el. For regular elements, it's the element itself.
        element.value = newTarget.$el || newTarget;

        if (element.value) {
          element.value.addEventListener("touchstart", onTouchStart, {
            passive: true,
          });
          element.value.addEventListener("touchmove", onTouchMove, {
            passive: true,
          });
        }
      }
    },
    { immediate: true }
  );

  onUnmounted(cleanup);
}
