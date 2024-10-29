<script setup>
</script>

<template>
    <div
        class="surface-ground flex flex-column align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <h2 class="">Página não encontrada!</h2>
        <img src="../../assets/images/404.gif" width="400px" height="300px">
        <router-link to="/"
            class="w-full flex justify-content-center align-items-center py-5 border-300 border-bottom-1">
            <span class="flex justify-content-center align-items-center bg-cyan-400 border-round"
                style="height: 3.5rem; width: 3.5rem">
                <i class="text-50 pi pi-fw pi-angle-left text-2xl"></i>
            </span>
            <span class="ml-4 flex flex-column">
                <span class="text-600 lg:text-xl">Voltar a página inicial!</span>
            </span>
        </router-link>
    </div>
</template>
