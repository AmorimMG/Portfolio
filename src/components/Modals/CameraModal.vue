<script setup>
import { defineEmits, ref } from 'vue';
import vueNeonLight from '../VueNeonLight/vue-neon-light.vue';
import CustomDialog from './CustomDialog.vue';

defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    isTopbar: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:visible']);

const webcam = ref(null);
const isLive = ref(false);
const openCamera = ref(false);
let stream = null;

const startWebcam = async () => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (webcam.value) {
            isLive.value = true;
            webcam.value.srcObject = stream;
        }
    } catch (error) {
        console.error('Error accessing webcam: ', error);
        isLive.value = false;
    }
};

const stopWebcam = () => {
    if (stream) {
        stream.getTracks().forEach((track) => track.stop());
    }
    stream = null;
};

const closeModal = () => {
    isLive.value = false;
    emit('update:visible', false);
    openCamera.value = false;
    stopWebcam();
};
</script>

<template>
    <div class="portfolio-root" v-bind="$attrs">
        <Button v-if="!isTopbar" text class="w-full h-full" @click="openCamera = true"
            style="width: 100%; height: 100%; justify-content: center">
            <vueNeonLight size="15px" :flash="false" style="color: white"></vueNeonLight>
        </Button>
        <CustomDialog :visible="visible || openCamera" @update:visible="closeModal" :maximized="false">
            <div class="flex justify-center items-center video-container">
                <Button style="height: 50px" size="large" v-if="!isLive" @click="startWebcam()">Start Webcam</Button>
                <video ref="webcam" autoplay playsinline width="100%" height="100%"
                    :style="{ display: isLive ? 'block' : 'none' }"></video>
            </div>
        </CustomDialog>
    </div>
</template>

<style scoped>
.video-container {
    aspect-ratio: 16 / 9;
    width: 100%;
    height: 100%;
    max-width: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
}

video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
