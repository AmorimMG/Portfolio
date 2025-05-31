<script setup>
import AmorimIcon from '@/assets/images/cards/profilePic.png';
import { ref } from 'vue';

const password = ref('');
const userName = ref('Amorim');

const handleLogin = () => {
    console.log('Login com:', password.value);
    emit('login');
};

const emit = defineEmits(['login']);
</script>

<template>
    <div class="min-h-screen bg-[#2d2d2d] flex items-center justify-center bg-cover bg-center"
        style="background-image: url('/path-to-wallpaper.jpg')">
        <!-- Adicione um wallpaper do macOS -->
        <div class="w-full max-w-sm text-center">
            <!-- Círculo da foto do usuário -->
            <div class="mb-8">
                <div class="w-24 h-24 mx-auto rounded-full border-4 border-white/20 overflow-hidden">
                    <img :src="AmorimIcon" alt="User" class="w-full h-full object-cover"
                        onerror="this.src='https://cdn.iconscout.com/icon/free/png-256/free-avatar-370-456322.png'" />
                </div>
                <h2 class="mt-4 text-2xl text-white font-light">{{ userName }}</h2>
            </div>

            <form @submit.prevent="handleLogin" class="space-y-4">
                <div class="relative">
                    <!-- <input type="password" v-model="password" placeholder="Digite sua senha"
                        class="w-full px-4 py-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/30 transition-all duration-300" /> -->
                </div>

                <div class="flex justify-center mt-4">
                    <button type="submit"
                        class="px-8 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all duration-300">
                        <span>→</span>
                    </button>
                </div>
            </form>

            <!-- Ícones inferiores -->
            <div class="fixed bottom-8 flex justify-center w-full gap-8">
                <button class="text-white/70 hover:text-white">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                    </svg>
                </button>
                <button class="text-white/70 hover:text-white">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                </button>
                <button class="text-white/70 hover:text-white">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
                <button class="text-white/70 hover:text-white">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>
