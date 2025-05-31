<script setup>
import AppConfig from '@/layout/AppConfigurator.vue';
</script>

<template>
    <div class="surface-ground flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, rgba(233, 30, 99, 0.4) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8 flex flex-col items-center" style="border-radius: 53px">
                    <div class="flex flex-col items-center">
                        <div class="flex justify-center items-center bg-pink-500 rounded" style="height: 3.2rem; width: 3.2rem">
                            <i class="pi pi-fw pi-exclamation-circle text-2xl text-white"></i>
                        </div>
                        <h1 class="text-900 font-bold text-5xl mb-2">Error Occured</h1>
                        <span class="text-600 mb-5">Requested resource is not available.</span>
                        <img loading="lazy" src="@/assets/images/cards/profilePic.png" alt="Error" class="mb-5" width="100px" />
                        <div class="col-span-12 mt-5 text-center">
                            <i class="pi pi-fw pi-arrow-left text-blue-500 mr-2" style="vertical-align: center"></i>
                            <router-link to="/" class="text-blue-500">Go to Desktop </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>
