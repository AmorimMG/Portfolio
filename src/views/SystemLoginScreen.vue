<script setup>
import AmorimIcon from "@/assets/images/cards/login.jpg";
import LoginBackground from "@/assets/images/wallpapers/login_background.png";
import { faCamera, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { onMounted, onUnmounted, ref } from "vue";

const showClock = ref(true);
const password = ref("");
const userName = ref("Gabriel Amorim");
const isMobile = ref(window.innerWidth < 768);

// Swipe gesture
const touchStartY = ref(0);
const touchCurrentY = ref(0);
const isDragging = ref(false);
const swipeProgress = ref(0);
const hasMoved = ref(false); // Flag para verificar se realmente arrastou
const SWIPE_THRESHOLD = 150; // pixels necessários para desbloquear
const MIN_SWIPE_DISTANCE = 10; // pixels mínimos para considerar como swipe

const emit = defineEmits(["login"]);

const handleLogin = () => {
  emit("login");
};

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
};

const handleTouchStart = (e) => {
  if (!isMobile.value) return;
  touchStartY.value = e.touches[0].clientY;
  isDragging.value = true;
  hasMoved.value = false; // Resetar flag de movimento
  swipeProgress.value = 0;
};

const handleTouchMove = (e) => {
  if (!isDragging.value || !isMobile.value) return;
  
  touchCurrentY.value = e.touches[0].clientY;
  const deltaY = touchStartY.value - touchCurrentY.value;
  
  // Marcar que houve movimento significativo
  if (Math.abs(deltaY) > MIN_SWIPE_DISTANCE) {
    hasMoved.value = true;
  }
  
  // Só permite arrastar para cima
  if (deltaY > 0) {
    swipeProgress.value = Math.min(deltaY / SWIPE_THRESHOLD, 1);
  } else {
    swipeProgress.value = 0;
  }
};

const handleTouchEnd = () => {
  if (!isDragging.value || !isMobile.value) return;
  
  const deltaY = touchStartY.value - touchCurrentY.value;
  
  // Só desbloqueia se realmente houve movimento E atingiu o threshold
  if (hasMoved.value && deltaY >= SWIPE_THRESHOLD) {
    // Desbloquear
    handleLogin();
  } else {
    // Resetar animação
    swipeProgress.value = 0;
  }
  
  isDragging.value = false;
  hasMoved.value = false;
  touchStartY.value = 0;
  touchCurrentY.value = 0;
};

// Data/Hora
const now = ref(new Date());
let intervalId;
onMounted(() => {
  intervalId = setInterval(() => {
    now.value = new Date();
  }, 1000);
  window.addEventListener("resize", checkScreenSize);
});

onUnmounted(() => {
  clearInterval(intervalId);
  window.removeEventListener("resize", checkScreenSize);
});

const notifications = ref([
  { id: 1, app: "Whatsapp", text: "Nova mensagem de Galinho", time: "agora" },
  { id: 2, app: "Instagram", text: "José curtiu sua foto", time: "5m" },
  { id: 3, app: "System", text: "Atualização disponível", time: "1h" },
]);
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-cover bg-center relative"
    :style="{ backgroundImage: `url(${LoginBackground})` }"
    :class="showClock && !isMobile ? 'cursor-pointer' : ''"
    @click="showClock && !isMobile && (showClock = false)"
  >
    <!-- Overlay escuro -->
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

    <!-- Layout para Mobile -->
    <div
      v-if="isMobile"
      class="relative z-10 flex flex-col h-screen w-full p-6 text-white"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <!-- Overlay de progresso do swipe (cobre toda a tela) -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-white/20 via-white/10 to-transparent pointer-events-none transition-all duration-100"
        :style="{
          opacity: swipeProgress,
          transform: `translateY(${100 - swipeProgress * 100}%)`,
        }"
      ></div>

      <!-- Clock -->
      <div
        class="flex-grow flex flex-col items-center justify-start pt-20 text-center relative z-10"
        :style="{
          transform: `translateY(-${swipeProgress * 50}px)`,
          opacity: 1 - swipeProgress * 0.3,
        }"
      >
        <h1 class="text-8xl font-thin">
          {{
            now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }}
        </h1>
        <p class="text-lg mt-2">
          {{
            now.toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "2-digit",
              month: "long",
            })
          }}
        </p>


      <!-- Notificações -->
      <div
        class="w-full max-w-md mx-auto space-y-2 mb-4 relative z-10 transition-all duration-200"
        :style="{
          transform: `translateY(-${swipeProgress * 80}px) scale(${1 - swipeProgress * 0.1})`,
          opacity: 1 - swipeProgress * 0.5,
        }"
      >
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="bg-black/30 backdrop-blur-md rounded-xl p-3 flex items-center text-left"
        >
          <div class="flex-grow">
            <p class="text-xs text-white/70">{{ notification.app }}</p>
            <p class="text-sm">{{ notification.text }}</p>
          </div>
          <span class="text-xs text-white/50 ml-2">{{
            notification.time
          }}</span>
        </div>
      </div>

      </div>

      <!-- Atalhos e Login -->
      <div
        class="w-full max-w-sm mx-auto flex items-center justify-between relative z-10 transition-all duration-200"
        :style="{
          transform: `translateY(-${swipeProgress * 100}px)`,
          opacity: 1 - swipeProgress * 0.7,
        }"
      >
        <button
          class="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center"
        >
          <FontAwesomeIcon :icon="faPhone" class="text-2xl" />
        </button>
        <div class="flex-grow mx-4 relative">
          <!-- Fundo do swipe -->
          <div
            class="w-full py-3 rounded-full bg-white/20 text-white font-medium flex items-center justify-center gap-2 relative overflow-hidden"
          >
            <!-- Indicador de progresso -->
            <div
              class="absolute bottom-0 left-0 right-0 h-full bg-white/30 transition-all duration-100"
              :style="{
                transform: `translateY(${100 - swipeProgress * 100}%)`,
              }"
            ></div>

            <!-- Texto e ícone -->
            <span
              class="relative z-10 transition-all duration-200"
              :style="{
                opacity: 1 - swipeProgress * 0.5,
              }"
            >
              Deslize para desbloquear
            </span>
            <span
              class="relative z-10 text-xl transition-all duration-200"
              :style="{
                opacity: 0.5 + swipeProgress * 0.5,
              }"
            >
              ↑
            </span>
          </div>
        </div>
        <button
          class="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center"
        >
          <FontAwesomeIcon :icon="faCamera" class="text-2xl" />
        </button>
      </div>

      <!-- Feedback visual quando completar - Tela cheia -->
      <div
        v-if="swipeProgress >= 1"
        class="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
      >
        <div
          class="w-32 h-32 rounded-full bg-white/30 animate-ping-once"
        ></div>
      </div>

    </div>

    <!-- Layout para Desktop -->
    <transition v-else name="fade-scale" mode="out-in">
      <!-- Tela de hora/data -->
      <div
        v-if="showClock"
        key="clock"
        class="relative z-10 text-center text-white"
      >
        <h1 class="text-6xl font-light animate-fadeIn">
          {{
            now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }}
        </h1>
        <p class="text-xl mt-2 animate-fadeIn">
          {{
            now.toLocaleDateString("pt-BR", {
              weekday: "long",
              day: "2-digit",
              month: "long",
            })
          }}
        </p>
      </div>

      <!-- Tela de login -->
      <div
        v-else
        key="login"
        class="relative z-10 w-full max-w-sm p-8 rounded-2xl bg-black/30 backdrop-blur-md shadow-xl animate-fadeIn"
      >
        <!-- Avatar -->
        <div class="flex flex-col items-center mb-6">
          <div
            class="w-28 h-28 rounded-full border-4 border-white/30 overflow-hidden shadow-lg animate-scaleIn"
          >
            <img
              :src="AmorimIcon"
              alt="User"
              class="w-full h-full object-cover"
              onerror="this.src='https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png'"
            />
          </div>
          <h2 class="mt-4 text-2xl text-white font-light tracking-wide">
            {{ userName }}
          </h2>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!--           <input
            type="password"
            v-model="password"
            placeholder="Digite sua senha"
            class="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/40 transition-all duration-300"
          /> -->

          <button
            type="submit"
            class="w-full py-3 rounded-lg bg-white/20 text-white font-medium hover:bg-white/30 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Entrar
            <span class="animate-horizontal">→</span>
          </button>
        </form>
      </div>
    </transition>
  </div>
</template>

<style>
/* Fade + scale para transição clock -> login */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.6s ease;
}
.fade-scale-enter-from {
  opacity: 0;
  transform: scale(1.05);
}
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Animações custom extra */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes horizontal {
  0%,
  100% {
    transform: translateX(-15%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateX(15%);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
@keyframes pingOnce {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
}
@keyframes bounceSlow {
  0%,
  100% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(-10px);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.8s ease forwards;
}
.animate-scaleIn {
  animation: scaleIn 0.6s ease-out forwards;
}
.animate-horizontal {
  animation: horizontal 1s infinite;
}
.animate-ping-once {
  animation: pingOnce 0.6s ease-out forwards;
}
.animate-bounce-slow {
  animation: bounceSlow 2s infinite;
}
</style>
