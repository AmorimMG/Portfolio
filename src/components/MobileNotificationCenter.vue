<template>
  <div
    ref="notificationCenter"
    class="notification-center"
    :class="{ 'is-open': store.isVisible }"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div
      class="overlay-filter"
      :style="{ backdropFilter: `brightness(${brightness / 100})` }"
    ></div>
    <div class="handle-bar"></div>
    <div class="content-wrapper" ref="contentWrapper">
      <div class="content-page notifications-page" ref="notificationsPage">
        <h2 class="page-title">Central de Notificações</h2>
        <ul v-if="notifications.length" class="notification-list">
          <li
            v-for="notification in notifications"
            :key="notification.id"
            class="notification-item notification-item-swipeable"
            :ref="(el) => setItemRef(el, notification.id)"
            @touchstart.stop="onSwipeStart($event, notification.id)"
            @touchmove.stop="onSwipeMove($event, notification.id)"
            @touchend.stop="onSwipeEnd(notification.id)"
          >
            <i
              :class="[notification.icon, 'notification-icon']"
              :style="{ color: notification.color }"
            ></i>
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
          <div
            class="setting-tile"
            :class="{ active: wifiEnabled }"
            @click="wifiEnabled = !wifiEnabled"
          >
            <i class="pi pi-wifi"></i>
            <span>Wi-Fi</span>
          </div>
          <div
            class="setting-tile"
            :class="{ active: bluetoothEnabled }"
            @click="bluetoothEnabled = !bluetoothEnabled"
          >
            <i class="pi pi-bluetooth"></i>
            <span>Bluetooth</span>
          </div>
          <div
            class="setting-tile"
            :class="{ active: dndEnabled }"
            @click="dndEnabled = !dndEnabled"
          >
            <i class="pi pi-moon"></i>
            <span>Não Perturbe</span>
          </div>
          <div
            class="setting-tile"
            :class="{ active: airplaneEnabled }"
            @click="airplaneEnabled = !airplaneEnabled"
          >
            <i class="pi pi-send" style="transform: rotate(-45deg)"></i>
            <span>Modo Avião</span>
          </div>
        </div>
        <div class="slider-control">
          <i class="pi pi-sun"></i>
          <Slider v-model="brightness" class="flex-grow mx-3" />
        </div>

        <div class="theme-section" style="margin-top: 25px">
          <h3 class="section-subtitle">Idioma do Sistema</h3>
          <div class="language-list">
            <button
              v-for="lang of languageOptions"
              :key="lang.value"
              @click="changeLanguage(lang)"
              :class="[
                'language-button',
                { active: currentLanguage?.value === lang.value },
              ]"
            >
              <img
                loading="lazy"
                :alt="lang.name"
                src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png"
                :class="`flag flag-${lang.code.toLowerCase()}`"
                style="width: 24px; height: 15px"
              />
              <span class="language-name">{{ lang.name }}</span>
              <i
                v-if="currentLanguage?.value === lang.value"
                class="pi pi-check"
              ></i>
            </button>
          </div>
        </div>
      </div>
      <div class="content-page theme-page" ref="themePage">
        <h2 class="page-title">Personalização</h2>

        <div class="theme-section">
          <h3 class="section-subtitle">Cor Primária</h3>
          <div class="color-grid">
            <button
              v-for="primaryColor of primaryColors"
              :key="primaryColor.name"
              type="button"
              :title="primaryColor.name"
              @click="updateColors('primary', primaryColor)"
              :class="[
                'color-button',
                { active: layoutConfig.primary === primaryColor.name },
              ]"
              :style="{
                backgroundColor: `${primaryColor.name === 'noir' ? 'var(--text-color)' : primaryColor.palette['500']}`,
              }"
            ></button>
          </div>
        </div>

        <div class="theme-section">
          <h3 class="section-subtitle">Cor de Superfície</h3>
          <div class="color-grid">
            <button
              v-for="surface of surfaces"
              :key="surface.name"
              type="button"
              :title="surface.name"
              @click="updateColors('surface', surface)"
              :class="[
                'color-button',
                {
                  active: layoutConfig.surface
                    ? layoutConfig.surface === surface.name
                    : isDarkTheme
                      ? surface.name === 'zinc'
                      : surface.name === 'slate',
                },
              ]"
              :style="{ backgroundColor: `${surface.palette['500']}` }"
            ></button>
          </div>
        </div>

        <div class="theme-section">
          <h3 class="section-subtitle">Preset de Tema</h3>
          <div class="preset-buttons">
            <button
              v-for="presetOption of presetOptions"
              :key="presetOption"
              @click="changePreset(presetOption)"
              :class="['preset-button', { active: preset === presetOption }]"
            >
              {{ presetOption }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSwipeToDismiss } from "@/composables/useSwipeToDismiss";
import { useLayout } from "@/layout/composables/layout";
import {
  getLanguageCookie,
  setColorThemeCookie,
  setLanguageCookie,
} from "@/service/session.js";
import { useNotificationCenterStore } from "@/stores/useNotificationCenterStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { $t, updatePreset, updateSurfacePalette } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";
import Lara from "@primeuix/themes/lara";
import Nora from "@primeuix/themes/nora";
import { storeToRefs } from "pinia";
import Slider from "primevue/slider";
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const store = useNotificationCenterStore();
const { layoutConfig, isDarkTheme } = useLayout();
const { locale } = useI18n();

const notificationCenter = ref(null);
const contentWrapper = ref(null);
const notificationsPage = ref(null);
const settingsPage = ref(null);
const themePage = ref(null);

const notificationStore = useNotificationStore();
const { notifications } = storeToRefs(notificationStore);
const { removeNotification } = notificationStore;

const {
  onTouchStart: onSwipeStart,
  onTouchMove: onSwipeMove,
  onTouchEnd: onSwipeEnd,
  setItemRef,
} = useSwipeToDismiss(removeNotification);

const brightness = ref(100);
const wifiEnabled = ref(true);
const bluetoothEnabled = ref(false);
const dndEnabled = ref(false);
const airplaneEnabled = ref(false);

// Theme configuration
const presets = {
  Aura,
  Lara,
  Nora,
};

const preset = ref(layoutConfig.preset);
const presetOptions = ref(Object.keys(presets));

// Language configuration
const languageOptions = ref([
  { name: "Português", code: "BR", value: "pt" },
  { name: "Español", code: "ES", value: "es" },
  { name: "English", code: "UK", value: "en" },
]);
const currentLanguage = ref(null);

const primaryColors = ref([
  { name: "noir", palette: {} },
  {
    name: "emerald",
    palette: {
      50: "#ecfdf5",
      100: "#d1fae5",
      200: "#a7f3d0",
      300: "#6ee7b7",
      400: "#34d399",
      500: "#10b981",
      600: "#059669",
      700: "#047857",
      800: "#065f46",
      900: "#064e3b",
      950: "#022c22",
    },
  },
  {
    name: "green",
    palette: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
      950: "#052e16",
    },
  },
  {
    name: "lime",
    palette: {
      50: "#f7fee7",
      100: "#ecfccb",
      200: "#d9f99d",
      300: "#bef264",
      400: "#a3e635",
      500: "#84cc16",
      600: "#65a30d",
      700: "#4d7c0f",
      800: "#3f6212",
      900: "#365314",
      950: "#1a2e05",
    },
  },
  {
    name: "orange",
    palette: {
      50: "#fff7ed",
      100: "#ffedd5",
      200: "#fed7aa",
      300: "#fdba74",
      400: "#fb923c",
      500: "#f97316",
      600: "#ea580c",
      700: "#c2410c",
      800: "#9a3412",
      900: "#7c2d12",
      950: "#431407",
    },
  },
  {
    name: "amber",
    palette: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
      950: "#451a03",
    },
  },
  {
    name: "yellow",
    palette: {
      50: "#fefce8",
      100: "#fef9c3",
      200: "#fef08a",
      300: "#fde047",
      400: "#facc15",
      500: "#eab308",
      600: "#ca8a04",
      700: "#a16207",
      800: "#854d0e",
      900: "#713f12",
      950: "#422006",
    },
  },
  {
    name: "teal",
    palette: {
      50: "#f0fdfa",
      100: "#ccfbf1",
      200: "#99f6e4",
      300: "#5eead4",
      400: "#2dd4bf",
      500: "#14b8a6",
      600: "#0d9488",
      700: "#0f766e",
      800: "#115e59",
      900: "#134e4a",
      950: "#042f2e",
    },
  },
  {
    name: "cyan",
    palette: {
      50: "#ecfeff",
      100: "#cffafe",
      200: "#a5f3fc",
      300: "#67e8f9",
      400: "#22d3ee",
      500: "#06b6d4",
      600: "#0891b2",
      700: "#0e7490",
      800: "#155e75",
      900: "#164e63",
      950: "#083344",
    },
  },
  {
    name: "sky",
    palette: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#bae6fd",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0ea5e9",
      600: "#0284c7",
      700: "#0369a1",
      800: "#075985",
      900: "#0c4a6e",
      950: "#082f49",
    },
  },
  {
    name: "blue",
    palette: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
      950: "#172554",
    },
  },
  {
    name: "indigo",
    palette: {
      50: "#eef2ff",
      100: "#e0e7ff",
      200: "#c7d2fe",
      300: "#a5b4fc",
      400: "#818cf8",
      500: "#6366f1",
      600: "#4f46e5",
      700: "#4338ca",
      800: "#3730a3",
      900: "#312e81",
      950: "#1e1b4b",
    },
  },
  {
    name: "violet",
    palette: {
      50: "#f5f3ff",
      100: "#ede9fe",
      200: "#ddd6fe",
      300: "#c4b5fd",
      400: "#a78bfa",
      500: "#8b5cf6",
      600: "#7c3aed",
      700: "#6d28d9",
      800: "#5b21b6",
      900: "#4c1d95",
      950: "#2e1065",
    },
  },
  {
    name: "purple",
    palette: {
      50: "#faf5ff",
      100: "#f3e8ff",
      200: "#e9d5ff",
      300: "#d8b4fe",
      400: "#c084fc",
      500: "#a855f7",
      600: "#9333ea",
      700: "#7e22ce",
      800: "#6b21a8",
      900: "#581c87",
      950: "#3b0764",
    },
  },
  {
    name: "fuchsia",
    palette: {
      50: "#fdf4ff",
      100: "#fae8ff",
      200: "#f5d0fe",
      300: "#f0abfc",
      400: "#e879f9",
      500: "#d946ef",
      600: "#c026d3",
      700: "#a21caf",
      800: "#86198f",
      900: "#701a75",
      950: "#4a044e",
    },
  },
  {
    name: "pink",
    palette: {
      50: "#fdf2f8",
      100: "#fce7f3",
      200: "#fbcfe8",
      300: "#f9a8d4",
      400: "#f472b6",
      500: "#ec4899",
      600: "#db2777",
      700: "#be185d",
      800: "#9d174d",
      900: "#831843",
      950: "#500724",
    },
  },
  {
    name: "rose",
    palette: {
      50: "#fff1f2",
      100: "#ffe4e6",
      200: "#fecdd3",
      300: "#fda4af",
      400: "#fb7185",
      500: "#f43f5e",
      600: "#e11d48",
      700: "#be123c",
      800: "#9f1239",
      900: "#881337",
      950: "#4c0519",
    },
  },
]);

const surfaces = ref([
  {
    name: "slate",
    palette: {
      0: "#ffffff",
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
      950: "#020617",
    },
  },
  {
    name: "gray",
    palette: {
      0: "#ffffff",
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
      950: "#030712",
    },
  },
  {
    name: "zinc",
    palette: {
      0: "#ffffff",
      50: "#fafafa",
      100: "#f4f4f5",
      200: "#e4e4e7",
      300: "#d4d4d8",
      400: "#a1a1aa",
      500: "#71717a",
      600: "#52525b",
      700: "#3f3f46",
      800: "#27272a",
      900: "#18181b",
      950: "#09090b",
    },
  },
  {
    name: "neutral",
    palette: {
      0: "#ffffff",
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
      950: "#0a0a0a",
    },
  },
  {
    name: "stone",
    palette: {
      0: "#ffffff",
      50: "#fafaf9",
      100: "#f5f5f4",
      200: "#e7e5e4",
      300: "#d6d3d1",
      400: "#a8a29e",
      500: "#78716c",
      600: "#57534e",
      700: "#44403c",
      800: "#292524",
      900: "#1c1917",
      950: "#0c0a09",
    },
  },
  {
    name: "soho",
    palette: {
      0: "#ffffff",
      50: "#f4f4f4",
      100: "#e8e9e9",
      200: "#d2d2d4",
      300: "#bbbcbe",
      400: "#a5a5a9",
      500: "#8e8f93",
      600: "#77787d",
      700: "#616268",
      800: "#4a4b52",
      900: "#34343d",
      950: "#1d1e27",
    },
  },
  {
    name: "viva",
    palette: {
      0: "#ffffff",
      50: "#f3f3f3",
      100: "#e7e7e8",
      200: "#cfd0d0",
      300: "#b7b8b9",
      400: "#9fa1a1",
      500: "#87898a",
      600: "#6e7173",
      700: "#565a5b",
      800: "#3e4244",
      900: "#262b2c",
      950: "#0e1315",
    },
  },
  {
    name: "ocean",
    palette: {
      0: "#ffffff",
      50: "#fbfcfc",
      100: "#F7F9F8",
      200: "#EFF3F2",
      300: "#DADEDD",
      400: "#B1B7B6",
      500: "#828787",
      600: "#5F7274",
      700: "#415B61",
      800: "#29444E",
      900: "#183240",
      950: "#0c1920",
    },
  },
]);

function getPresetExt() {
  const color = primaryColors.value.find(
    (c) => c.name === layoutConfig.primary
  );

  if (color.name === "noir") {
    return {
      semantic: {
        primary: {
          50: "{surface.50}",
          100: "{surface.100}",
          200: "{surface.200}",
          300: "{surface.300}",
          400: "{surface.400}",
          500: "{surface.500}",
          600: "{surface.600}",
          700: "{surface.700}",
          800: "{surface.800}",
          900: "{surface.900}",
          950: "{surface.950}",
        },
        colorScheme: {
          light: {
            primary: {
              color: "{primary.950}",
              contrastColor: "#ffffff",
              hoverColor: "{primary.800}",
              activeColor: "{primary.700}",
            },
            highlight: {
              background: "{primary.950}",
              focusBackground: "{primary.700}",
              color: "#ffffff",
              focusColor: "#ffffff",
            },
          },
          dark: {
            primary: {
              color: "{primary.50}",
              contrastColor: "{primary.950}",
              hoverColor: "{primary.200}",
              activeColor: "{primary.300}",
            },
            highlight: {
              background: "{primary.50}",
              focusBackground: "{primary.300}",
              color: "{primary.950}",
              focusColor: "{primary.950}",
            },
          },
        },
      },
    };
  } else {
    return {
      semantic: {
        primary: color.palette,
        colorScheme: {
          light: {
            primary: {
              color: "{primary.500}",
              contrastColor: "#ffffff",
              hoverColor: "{primary.600}",
              activeColor: "{primary.700}",
            },
            highlight: {
              background: "{primary.50}",
              focusBackground: "{primary.100}",
              color: "{primary.700}",
              focusColor: "{primary.800}",
            },
          },
          dark: {
            primary: {
              color: "{primary.400}",
              contrastColor: "{surface.900}",
              hoverColor: "{primary.300}",
              activeColor: "{primary.200}",
            },
            highlight: {
              background: "color-mix(in srgb, {primary.400}, transparent 84%)",
              focusBackground:
                "color-mix(in srgb, {primary.400}, transparent 76%)",
              color: "rgba(255,255,255,.87)",
              focusColor: "rgba(255,255,255,.87)",
            },
          },
        },
      },
    };
  }
}

function updateColors(type, color) {
  if (type === "primary") {
    layoutConfig.primary = color.name;
    setColorThemeCookie(color.name);
  } else if (type === "surface") {
    layoutConfig.surface = color.name;
  }
  applyTheme(type, color);
}

function applyTheme(type, color) {
  if (type === "primary") {
    updatePreset(getPresetExt());
  } else if (type === "surface") {
    updateSurfacePalette(color.palette);
  }
}

function changePreset(presetValue) {
  preset.value = presetValue;
  layoutConfig.preset = presetValue;
  const selectedPreset = presets[presetValue];
  const surfacePalette = surfaces.value.find(
    (s) => s.name === layoutConfig.surface
  )?.palette;
  $t()
    .preset(selectedPreset)
    .preset(getPresetExt())
    .surfacePalette(surfacePalette)
    .use({ useDefaultOptions: true });
}

function changeLanguage(language) {
  currentLanguage.value = language;
  locale.value = language.value;
  setLanguageCookie(language.value);
}

let touchStartY = 0;
let touchStartX = 0;
let currentTranslateY = 0;
let currentContentTranslateX = 0;

watch(
  () => store.isVisible,
  (newValue) => {
    if (newValue) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => {
        if (notificationCenter.value) {
          notificationCenter.value.style.transform = "translateY(0)";
          currentTranslateY = 0;
        }
      });
    } else {
      document.body.style.overflow = "";
    }
  }
);

watch(locale, (newLocale) => {
  const newLanguage = languageOptions.value.find(
    (lang) => lang.value === newLocale
  );
  if (newLanguage) {
    currentLanguage.value = newLanguage;
  }
});

const onTouchStart = (e) => {
  if (!store.isVisible) return;
  // Stop container swipe if the touch starts on a dismissible item
  if (e.target.closest(".notification-item-swipeable")) {
    return;
  }
  touchStartY = e.touches[0].clientY;
  touchStartX = e.touches[0].clientX;
  notificationCenter.value.style.transition = "none";
  contentWrapper.value.style.transition = "none";
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
    if (newTranslateY > -window.innerHeight && newTranslateY < 50) {
      // Allow some upward movement
      notificationCenter.value.style.transform = `translateY(${newTranslateY}px)`;
    }
  } else {
    // Horizontal swipe for content
    const newTranslateX = currentContentTranslateX + deltaX;
    if (
      newTranslateX <= 0 &&
      newTranslateX > -contentWrapper.value.offsetWidth
    ) {
      contentWrapper.value.style.transform = `translateX(${newTranslateX}px)`;
    }
  }
};

const onTouchEnd = (e) => {
  if (!store.isVisible) return;

  notificationCenter.value.style.transition = "transform 0.3s ease";
  contentWrapper.value.style.transition = "transform 0.3s ease";

  const finalTransform = new DOMMatrix(
    window.getComputedStyle(notificationCenter.value).transform
  );
  currentTranslateY = finalTransform.m42;

  const finalContentTransform = new DOMMatrix(
    window.getComputedStyle(contentWrapper.value).transform
  );
  currentContentTranslateX = finalContentTransform.m41;

  // Vertical swipe logic
  if (currentTranslateY < -100) {
    // Threshold to close
    close();
  } else {
    // Snap back to fully open
    notificationCenter.value.style.transform = "translateY(0)";
    currentTranslateY = 0;
  }

  // Horizontal swipe logic - Three pages
  const pageWidth = notificationsPage.value.offsetWidth;

  if (currentContentTranslateX < -pageWidth * 1.5) {
    // Snap to theme page (third page)
    contentWrapper.value.style.transform = `translateX(-${pageWidth * 2}px)`;
    currentContentTranslateX = -pageWidth * 2;
  } else if (currentContentTranslateX < -pageWidth / 2) {
    // Snap to settings page (second page)
    contentWrapper.value.style.transform = `translateX(-${pageWidth}px)`;
    currentContentTranslateX = -pageWidth;
  } else {
    // Snap to notifications page (first page)
    contentWrapper.value.style.transform = "translateX(0)";
    currentContentTranslateX = 0;
  }
};

const close = () => {
  notificationCenter.value.style.transform = "translateY(-100%)";
  setTimeout(() => {
    store.hide();
  }, 300);
  currentTranslateY = -window.innerHeight;
};

onMounted(() => {
  // Initialize language
  const savedLanguage = getLanguageCookie();
  if (savedLanguage) {
    currentLanguage.value = languageOptions.value.find(
      (lang) => lang.value === savedLanguage
    );
  } else {
    currentLanguage.value = languageOptions.value.find(
      (lang) => lang.value === "en"
    );
  }

  if (contentWrapper.value) {
    contentWrapper.value.style.width = "300%"; // Three pages
    notificationsPage.value.style.width = "33.33%";
    settingsPage.value.style.width = "33.33%";
    themePage.value.style.width = "33.33%";
  }

  // Initialize position based on store visibility
  if (notificationCenter.value) {
    if (store.isVisible) {
      notificationCenter.value.style.transform = "translateY(0)";
      currentTranslateY = 0;
    } else {
      notificationCenter.value.style.transform = "translateY(-100%)";
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
  width: 300%; /* Three pages */
  flex-grow: 1;
  height: calc(100% - 25px); /* Adjust based on handle bar */
  transition: transform 0.3s ease;
}

.content-page {
  width: 33.33%; /* Each page takes one third of the wrapper */
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

/* Theme Page */
.theme-section {
  margin-bottom: 30px;
}

.section-subtitle {
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  margin-bottom: 10px;
}

.color-button {
  width: 100%;
  aspect-ratio: 1;
  border: 2px solid transparent;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.color-button.active {
  border-color: white;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.color-button:active {
  transform: scale(0.95);
}

.preset-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.preset-button {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px 20px;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  min-width: 80px;
}

.preset-button.active {
  background: rgba(50, 150, 255, 0.8);
  border-color: rgba(50, 150, 255, 1);
}

.preset-button:active {
  transform: scale(0.95);
}

/* Language Page */
.language-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.language-button {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 16px 20px;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 15px;
}

.language-button .flag {
  flex-shrink: 0;
}

.language-name {
  flex-grow: 1;
  text-align: left;
}

.language-button i {
  margin-left: auto;
  font-size: 1.2rem;
}

.language-button.active {
  background: rgba(50, 150, 255, 0.8);
  border-color: rgba(50, 150, 255, 1);
}

.language-button:active {
  transform: scale(0.98);
}
</style>
