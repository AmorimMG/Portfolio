<script setup>
import { useNotificationCenterStore } from "@/stores/useNotificationCenterStore";
import Dialog from "primevue/dialog";
import { computed, onMounted, onUnmounted, ref } from "vue";
import ModalHeader from "../Modals/ModalHeader.vue";

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  style: {
    type: Object,
    default: () => ({}),
  },
  contentStyle: {
    type: Object,
    default: () => ({}),
  },
  modal: {
    type: Boolean,
    default: true,
  },
  closable: {
    type: Boolean,
    default: false,
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
  header: {
    type: String,
    default: "",
  },
  footer: {
    type: String,
    default: "",
  },
  maximized: {
    type: Boolean,
    default: true,
  },
  breakpoints: {
    type: Object,
    default: () => ({ "1199px": "75vw", "575px": "90vw" }),
  },
  unstyled: {
    type: Boolean,
    default: true,
  },
  class: {
    type: String,
    default: "dialog-terminal",
  },
});

const emit = defineEmits(["update:visible"]);

const notificationCenterStore = useNotificationCenterStore();
const isMobile = ref(window.innerWidth <= 991);
const isMaximized = ref(props.maximized);
let touchStartY = 0;

const checkMobile = () => {
  const wasMobile = isMobile.value;
  isMobile.value = window.innerWidth <= 991;
  if (!wasMobile && isMobile.value) {
    isMaximized.value = true;
  }
};

const handleKeyDown = (event) => {
  if (event.key === "Escape" && props.visible) {
    closeModal();
  }
};

onMounted(() => {
  isMaximized.value = isMobile.value || props.maximized;
  window.addEventListener("resize", checkMobile);
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
  window.removeEventListener("keydown", handleKeyDown);
});

const dialogClass = computed(() => {
  return isMaximized.value || isMobile.value
    ? `${props.class} p-dialog-maximized`
    : props.class;
});

const mergedStyle = computed(() => ({
  width: "80%",
  height: "80%",
  overflowY: "none",
  backgroundColor: "var(--surface-ground)",
  ...props.style,
}));

const mergedContentStyle = computed(() => ({
  width: "100%",
  height: "100%",
  overflowY: "auto",
  ...props.contentStyle,
}));

const handleVisibilityChange = (newVisibility) => {
  emit("update:visible", newVisibility);
};

const onMaximize = () => {
  isMaximized.value = !isMaximized.value;
};

const closeModal = () => {
  emit("update:visible", false);
};

const onTouchStart = (e) => {
  touchStartY = e.touches[0].clientY;
};

const onTouchMove = (e) => {
  const touchY = e.touches[0].clientY;
  const deltaY = touchY - touchStartY;

  if (deltaY > 50) {
    // Swipe down threshold
    notificationCenterStore.show();
  }
};
</script>

<template>
  <Dialog
    v-if="visible"
    :visible="visible"
    :modal="modal"
    :closable="closable"
    :showHeader="showHeader"
    :header="header"
    :footer="footer"
    :maximized="isMaximized"
    :breakpoints="breakpoints"
    :unstyled="unstyled"
    :class="dialogClass"
    :style="mergedStyle"
    :contentStyle="mergedContentStyle"
    @update:visible="handleVisibilityChange"
    @hide="closeModal"
  >
    <template #header>
      <div @touchstart.passive="onTouchStart" @touchmove.passive="onTouchMove">
        <ModalHeader
          :is-mobile="isMobile"
          @maximize="onMaximize"
          @close="closeModal"
        >
          <slot name="header"></slot>
        </ModalHeader>
      </div>
    </template>
    <slot></slot>
  </Dialog>
</template>

<style></style>
