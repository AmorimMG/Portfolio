<script setup>
import AmorimIcon from "@/assets/images/cards/login.jpg";
import LoginBackground from "@/assets/images/wallpapers/login_background.png";
import { onMounted, ref } from "vue";

const showClock = ref(true);
const password = ref("");
const userName = ref("Gabriel Amorim");

const emit = defineEmits(["login"]);

const handleLogin = () => {
  emit("login");
};

// Data/Hora
const now = ref(new Date());
onMounted(() => {
  setInterval(() => {
    now.value = new Date();
  }, 1000);
});
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-cover bg-center relative"
    :style="{ backgroundImage: `url(${LoginBackground})` }"
    :class="showClock ? 'cursor-pointer' : ''"
    @click="showClock && (showClock = false)"
  >
    <!-- Overlay escuro -->
    <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

    <!-- Transição entre tela clock e tela login -->
    <transition name="fade-scale" mode="out-in">
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
.animate-fadeIn {
  animation: fadeIn 0.8s ease forwards;
}
.animate-scaleIn {
  animation: scaleIn 0.6s ease-out forwards;
}
.animate-horizontal {
  animation: horizontal 1s infinite;
}
</style>
