<template>
  <div
    ref="notificationCenter"
    class="notification-center"
    :class="{ 'is-open': store.isVisible }"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div class="overlay-filter" :style="{ backdropFilter: `brightness(${brightness / 100})` }"></div>
    <div class="handle-bar"></div>
    <div class="content-wrapper" ref="contentWrapper">
      <div class="content-page notifications-page" ref="notificationsPage">
        <h2 class="page-title">Central de Notificações</h2>
        <ul v-if="notifications.length" class="notification-list">
          <li v-for="notification in notifications" :key="notification.id" class="notification-item notification-item-swipeable"
            :ref="el => setItemRef(el, notification.id)"
            @touchstart.stop="onSwipeStart($event, notification.id)"
            @touchmove.stop="onSwipeMove($event, notification.id)"
            @touchend.stop="onSwipeEnd(notification.id)">
            <i :class="[notification.icon, 'notification-icon']" :style="{ color: notification.color }"></i>
            <div class="notification-content">
              <p class="notification-app">{{ notification.app }}</p>
              <p class="notification-text">{{ notification.text }}</p>
            </div>
            <span class="notification-time">{{ notification.time }}</span>
          </li>
        </ul>
        <div v-else class="empty-state">
            <i class="pi pi-bell" style="font-size: 2rem"></i>
            <p>Nenhuma notificação nova.</p>
        </div>
      </div>
      <div class="content-page settings-page" ref="settingsPage">
        <h2 class="page-title">Painel de Controle</h2>
        <div class="settings-grid">
            <div class="setting-tile" :class="{ active: wifiEnabled }" @click="wifiEnabled = !wifiEnabled">
                <i class="pi pi-wifi"></i>
                <span>Wi-Fi</span>
            </div>
             <div class="setting-tile" :class="{ active: bluetoothEnabled }" @click="bluetoothEnabled = !bluetoothEnabled">
                <i class="pi pi-bluetooth"></i>
                <span>Bluetooth</span>
            </div>
             <div class="setting-tile" :class="{ active: dndEnabled }" @click="dndEnabled = !dndEnabled">
                <i class="pi pi-moon"></i>
                <span>Não Perturbe</span>
            </div>
             <div class="setting-tile" :class="{ active: airplaneEnabled }" @click="airplaneEnabled = !airplaneEnabled">
                <i class="pi pi-send" style="transform: rotate(-45deg);"></i>
                <span>Modo Avião</span>
            </div>
        </div>
        <div class="slider-control">
            <i class="pi pi-sun"></i>
            <Slider v-model="brightness" class="flex-grow mx-3" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSwipeToDismiss } from '@/composables/useSwipeToDismiss';
import { useNotificationCenterStore } from '@/stores/useNotificationCenterStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { storeToRefs } from 'pinia';
import Slider from 'primevue/slider';
import { onMounted, ref, watch } from 'vue';

const store = useNotificationCenterStore();

const notificationCenter = ref(null);
const contentWrapper = ref(null);
const notificationsPage = ref(null);
const settingsPage = ref(null);

const notificationStore = useNotificationStore();
const { notifications } = storeToRefs(notificationStore);
const { removeNotification } = notificationStore;

const { onTouchStart: onSwipeStart, onTouchMove: onSwipeMove, onTouchEnd: onSwipeEnd, setItemRef } = useSwipeToDismiss(removeNotification);

const brightness = ref(100);
const wifiEnabled = ref(true);
const bluetoothEnabled = ref(false);
const dndEnabled = ref(false);
const airplaneEnabled = ref(false);

let touchStartY = 0;
let touchStartX = 0;
let currentTranslateY = 0;
let currentContentTranslateX = 0;

watch(() => store.isVisible, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      if (notificationCenter.value) {
        notificationCenter.value.style.transform = 'translateY(0)';
        currentTranslateY = 0;
      }
    });
  } else {
    document.body.style.overflow = '';
  }
});

const onTouchStart = (e) => {
  if (!store.isVisible) return;
  // Stop container swipe if the touch starts on a dismissible item
  if (e.target.closest('.notification-item-swipeable')) {
    return;
  }
  touchStartY = e.touches[0].clientY;
  touchStartX = e.touches[0].clientX;
  notificationCenter.value.style.transition = 'none';
  contentWrapper.value.style.transition = 'none';
};

const onTouchMove = (e) => {
  if (!store.isVisible) return;

  const touchY = e.touches[0].clientY;
  const touchX = e.touches[0].clientX;
  const deltaY = touchY - touchStartY;
  const deltaX = touchX - touchStartX;

  // Vertical swipe to open/close
  if (Math.abs(deltaY) > Math.abs(deltaX)) {
    const newTranslateY = currentTranslateY + deltaY;
    if (newTranslateY > -window.innerHeight && newTranslateY < 50) { // Allow some upward movement
      notificationCenter.value.style.transform = `translateY(${newTranslateY}px)`;
    }
  } else { // Horizontal swipe for content
    const newTranslateX = currentContentTranslateX + deltaX;
    if (newTranslateX <= 0 && newTranslateX > -contentWrapper.value.offsetWidth) {
        contentWrapper.value.style.transform = `translateX(${newTranslateX}px)`;
    }
  }
};

const onTouchEnd = (e) => {
  if (!store.isVisible) return;

  notificationCenter.value.style.transition = 'transform 0.3s ease';
  contentWrapper.value.style.transition = 'transform 0.3s ease';

  const finalTransform = new DOMMatrix(window.getComputedStyle(notificationCenter.value).transform);
  currentTranslateY = finalTransform.m42;

  const finalContentTransform = new DOMMatrix(window.getComputedStyle(contentWrapper.value).transform);
  currentContentTranslateX = finalContentTransform.m41;

  // Vertical swipe logic
  if (currentTranslateY < -100) { // Threshold to close
    close();
  } else {
    // Snap back to fully open
    notificationCenter.value.style.transform = 'translateY(0)';
    currentTranslateY = 0;
  }

  // Horizontal swipe logic
  const settingsWidth = settingsPage.value.offsetWidth;
  if (currentContentTranslateX < -settingsWidth / 2) {
    // Snap to settings
    contentWrapper.value.style.transform = `translateX(-${settingsWidth}px)`;
    currentContentTranslateX = -settingsWidth;
  } else {
    // Snap to notifications
    contentWrapper.value.style.transform = 'translateX(0)';
    currentContentTranslateX = 0;
  }
};

const close = () => {
  notificationCenter.value.style.transform = 'translateY(-100%)';
  setTimeout(() => {
    store.hide();
  }, 300);
  currentTranslateY = -window.innerHeight;
};

onMounted(() => {
  if (contentWrapper.value) {
      contentWrapper.value.style.width = '200%'; // Assuming two pages
      notificationsPage.value.style.width = '50%';
      settingsPage.value.style.width = '50%';
  }
  
  // Initialize position based on store visibility
  if (notificationCenter.value) {
    if (store.isVisible) {
      console.log('Initializing as visible');
      notificationCenter.value.style.transform = 'translateY(0)';
      currentTranslateY = 0;
    } else {
      console.log('Initializing as hidden');
      notificationCenter.value.style.transform = 'translateY(-100%)';
      currentTranslateY = -window.innerHeight;
    }
  }
});
</script>

<style scoped>
.notification-center {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  color: white;
  transform: translateY(-100%);
  transition: transform 0.3s ease-in-out;
  z-index: 9999999; /* Maior que o z-index do modal */
  pointer-events: none; /* Desativa eventos de ponteiro quando oculto */
}

.overlay-filter {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: -1;
    transition: backdrop-filter 0.2s ease;
}

.notification-center.is-open {
  transform: translateY(0);
  pointer-events: auto; /* Ativa eventos de ponteiro quando visível */
}

.handle-bar {
  width: 40px;
  height: 5px;
  background-color: #ccc;
  border-radius: 2.5px;
  margin: 10px auto;
  cursor: grab;
  flex-shrink: 0;
}

.content-wrapper {
    display: flex;
    width: 200%; /* Two pages */
    flex-grow: 1;
    height: calc(100% - 25px); /* Adjust based on handle bar */
    transition: transform 0.3s ease;
}

.content-page {
    width: 50%; /* Each page takes half of the wrapper */
    padding: 0 20px 20px 20px;
    overflow-y: auto;
    box-sizing: border-box;
}

.page-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 20px;
}

/* Notifications Page */
.notification-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notification-item {
  background: rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 16px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.notification-item-swipeable {
  touch-action: pan-y; /* Allow vertical page scroll but capture horizontal swipe */
  position: relative;
}

.notification-icon {
    font-size: 1.5rem;
    margin-right: 12px;
}

.notification-content {
    flex-grow: 1;
}

.notification-app {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 2px;
}

.notification-text {
    font-size: 0.95rem;
}

.notification-time {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.5);
    margin-left: 10px;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 50%;
    color: rgba(255, 255, 255, 0.5);
}

/* Settings Page */
.settings-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin-bottom: 20px;
}

.setting-tile {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.setting-tile.active {
    background: rgba(50, 150, 255, 0.8);
    color: white;
}

.setting-tile i {
    font-size: 1.8rem;
    margin-bottom: 10px;
}

.slider-control {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 15px;
    display: flex;
    align-items: center;
}

.slider-control i {
    font-size: 1.2rem;
}
</style>
