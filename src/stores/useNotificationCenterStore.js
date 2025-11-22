import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationCenterStore = defineStore('notificationCenter', () => {
  const isVisible = ref(false);

  function show() {
    isVisible.value = true;
  }

  function hide() {
    isVisible.value = false;
  }

  function toggle() {
    isVisible.value = !isVisible.value;
  }

  return { isVisible, show, hide, toggle };
});
