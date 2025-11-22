<script setup>
import { faSignal, faWifi } from "@fortawesome/free-solid-svg-icons";
import { faBatteryThreeQuarters } from "@fortawesome/free-solid-svg-icons/faBatteryThreeQuarters";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { onMounted, onUnmounted, ref } from "vue";

const props = defineProps({
  isMobile: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['close', 'maximize']);
const closeModal = () => {
    emit('close');
};

const onMaximize = () => {
    emit('maximize');
};

const currentTime = ref("");
let timer;

const updateTime = () => {
  const now = new Date();
  const options = { hour: "2-digit", minute: "2-digit" };
  currentTime.value = now.toLocaleTimeString("pt", options);
};

onMounted(() => {
  if (props.isMobile) {
    updateTime();
    timer = setInterval(updateTime, 1000);
  }
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<template>
  <div v-if="!isMobile" class="modal-header">
    <div class="window-controls">
      <span class="close" @click="closeModal"></span>
      <span class="minimize" @click="closeModal"></span>
      <span v-if="!props.isMobile" class="maximize" @click="onMaximize"></span>
    </div>
    <div class="header-content">
      <slot></slot>
    </div>
  </div>
  <div v-else class="mobile-modal-header">
    <div class="w-full flex justify-evenly items-center">
      <div>
        <span>{{ currentTime }}</span>
      </div>
      <div class="flex items-center justify-center" style="width: 150px">
        <div
          style="
            background-color: black;
            width: 150px;
            height: 30px;
            border-radius: 20px;
            margin-left: 30px;
          "
        ></div>
      </div>
      <div class="flex items-center">
        <FontAwesomeIcon class="pr-2" :icon="faSignal" />
        <FontAwesomeIcon class="pr-2" :icon="faWifi" />
        <FontAwesomeIcon class="pr-2" :icon="faBatteryThreeQuarters" />
      </div>
        <span style="color: red; position: absolute; right: 10px;" class="close-icon pi pi-times" @click="closeModal"></span>
    </div>
  </div>
</template>

<style scoped>
.modal-header {
    background-color: var(--surface-ground);
    padding: 15px;
    z-index: 10;
    position: relative;
    display: flex;
}

.mobile-modal-header {
  background-color: var(--p-menubar-background);
  border: 1px solid var(--p-menubar-border-color);
  border-radius: var(--p-menubar-border-radius);
  overflow-y: hidden;
  font-size: medium;
  height: 50px;
  position: relative;
  width: 100%;
  z-index: 2;
  color: var(--p-text-color);
  padding: 0.75rem;
}

.mobile-modal-header > .p-menubar-start {
  width: 100%;
}

.window-controls {
    display: flex;
    gap: 8px;
    justify-content: start;
    align-items: center;
}

.header-content {
    margin-left: 10px;
    width: 100%;
}

.window-controls span {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: inline-block;
}

.close {
    background-color: #ff5f56;
}

.minimize {
    background-color: #ffbd2e;
}

.maximize {
    background-color: #27c93f;
}

.close-icon {
  margin-left: 10px;
  cursor: pointer;
}

.toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
}

.toolbar button {
    background-color: #d8d8d8;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    font-size: 14px;
    cursor: pointer;
}

.path-input {
    flex-grow: 1;
    background-color: #ffffff;
    border: 1px solid #d1d1d1;
    border-radius: 5px;
    padding: 5px 10px;
    font-size: 14px;
    color: black;
}
</style>
