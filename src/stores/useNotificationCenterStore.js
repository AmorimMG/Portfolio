import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationCenterStore = defineStore('notificationCenter', () => {
  const isVisible = ref(false);

  function show() {
    isVisible.value = true;
    console.log('Notification Center shown', isVisible.value);
  }

  function hide() {
    isVisible.value = false;
    console.log('Notification Center hidden', isVisible.value);
  }

  function toggle() {
    isVisible.value = !isVisible.value;
    console.log('Notification Center toggled', isVisible.value);
  }

  return { isVisible, show, hide, toggle };
});
