<script setup>
import { defineEmits, ref } from 'vue';
import ModalHeader from "./ModalHeader.vue";

    const props = defineProps ({
        visible: {
            type: Boolean,
            default: false,
        }
    });

    const emit = defineEmits(["update:visible"]);
    
    const webcam = ref(null);
    const isLive = ref(false);
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
        stream.getTracks().forEach(track => track.stop());
      }
      stream = null;
    };

    const closeModal = () => {
        isLive.value = false;
        emit("update:visible", false);
        stopWebcam();
    }

</script>

<template>
  <div>
    <Dialog class="dialog-terminal" 
    :visible.sync="visible"                                                 
    :closable="false"
    :unstyled="true"
    :style="{ width: '80rem', height: '50rem'}"
>
    <template #header>
        <ModalHeader @close="closeModal"/>
    </template>
    <div class="flex justify-content-center align-item-center">
        <Button v-if="!isLive" @click="startWebcam()">Start Webcam</Button>
        <video ref="webcam" autoplay playsinline width="100%" :style="{ display: isLive ? 'block' : 'none' }"></video>
    </div>
    </Dialog>
  </div>
</template>

<style scoped>
video {
  max-width: 100%;
}
</style>
