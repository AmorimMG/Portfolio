import { ref } from 'vue';

export function useSwipeToDismiss(onDismiss) {
  const itemRefs = ref({});
  const activeSwipeId = ref(null);
  let touchStartX = 0;
  let currentTranslateX = 0;

  const onTouchStart = (e, id) => {
    // Prevent swipe if another one is already active
    if (activeSwipeId.value && activeSwipeId.value !== id) {
      resetPosition(activeSwipeId.value);
    }
    
    activeSwipeId.value = id;
    touchStartX = e.touches[0].clientX;
    currentTranslateX = 0;
    
    const el = itemRefs.value[id];
    if (el) {
      el.style.transition = 'none';
    }
  };

  const onTouchMove = (e, id) => {
    if (activeSwipeId.value !== id) return;

    const touchX = e.touches[0].clientX;
    const deltaX = touchX - touchStartX;
    
    // Only allow swipe from left to right
    if (deltaX < 0) {
      currentTranslateX = 0;
    } else {
      currentTranslateX = deltaX;
    }

    const el = itemRefs.value[id];
    if (el) {
      el.style.transform = `translateX(${currentTranslateX}px)`;
      el.style.opacity = 1 - (currentTranslateX / el.offsetWidth);
    }
  };

  const onTouchEnd = (id) => {
    if (activeSwipeId.value !== id) return;

    const el = itemRefs.value[id];
    if (!el) return;

    const threshold = el.offsetWidth * 0.5; // Dismiss if swiped 50% of the width

    if (currentTranslateX > threshold) {
      // Animate out and dismiss
      el.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      el.style.transform = `translateX(100%)`;
      el.style.opacity = '0';
      
      // Wait for animation to finish before removing from store
      setTimeout(() => {
        onDismiss(id);
        // Reset might not be needed if component is removed, but good practice
        resetPosition(id, false); 
      }, 300);

    } else {
      // Reset position
      resetPosition(id);
    }
    
    activeSwipeId.value = null;
  };

  const resetPosition = (id, withTransition = true) => {
    const el = itemRefs.value[id];
    if (el) {
      if (withTransition) {
        el.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      }
      el.style.transform = 'translateX(0)';
      el.style.opacity = '1';
    }
  };

  const setItemRef = (el, id) => {
    if (el) {
      itemRefs.value[id] = el;
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    setItemRef
  };
}
