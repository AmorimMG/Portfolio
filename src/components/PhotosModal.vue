<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useFileSystemStore } from "../stores/useFileSystemStore";
import CustomDialog from "./Modals/CustomDialog.vue";

const props = defineProps({
  visible: Boolean,
});

const emit = defineEmits(["close"]);

const fileSystemStore = useFileSystemStore();

const images = ref([]);
const currentImageIndex = ref(0);
const isZoomed = ref(false);
const isLoading = ref(false);

const currentImage = computed(() => {
  return images.value[currentImageIndex.value];
});

const closeModal = () => {
  emit("close");
  isZoomed.value = false;
  currentImageIndex.value = 0;
};

const nextImage = () => {
  if (currentImageIndex.value < images.value.length - 1) {
    currentImageIndex.value++;
  } else {
    currentImageIndex.value = 0;
  }
};

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  } else {
    currentImageIndex.value = images.value.length - 1;
  }
};

const selectImage = (index) => {
  currentImageIndex.value = index;
  isZoomed.value = true;
};

const toggleZoom = () => {
  isZoomed.value = !isZoomed.value;
};

const loadImages = async () => {
  isLoading.value = true;

  try {
    await fileSystemStore.loadCdnImagesData();
    const cdnImages = fileSystemStore.getCdnImages();
    images.value = cdnImages;
  } catch (error) {
    images.value = [];
  } finally {
    isLoading.value = false;
  }
};

const handleKeyPress = (event) => {
  if (!props.visible) return;

  switch (event.key) {
    case "ArrowLeft":
      prevImage();
      break;
    case "ArrowRight":
      nextImage();
      break;
    case "Escape":
      if (isZoomed.value) {
        isZoomed.value = false;
      } else {
        closeModal();
      }
      break;
    case " ":
    case "Enter":
      toggleZoom();
      break;
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyPress);
  loadImages();
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyPress);
});

const onModalClose = () => {
  closeModal();
};
</script>

<template>
  <CustomDialog
    :visible="props.visible"
    @update:visible="onModalClose"
    class="photos-modal"
    :style="{
      width: isZoomed ? '95vw' : '80vw',
      height: isZoomed ? '95vh' : '80vh',
    }"
    :maximizable="false"
  >
    <template #header>
      <div class="photos-header">
        <h3>📷 Photos</h3>
        <div class="header-controls">
          <button
            @click="loadImages"
            class="refresh-button"
            title="Atualizar imagens"
            :disabled="isLoading"
          >
            <i class="pi pi-refresh" :class="{ 'pi-spin': isLoading }"></i>
          </button>
          <span v-if="images.length > 0" class="image-counter">
            {{ images.length }} {{ images.length === 1 ? "imagem" : "imagens" }}
          </span>
        </div>
      </div>
    </template>

    <div class="photos-container">
      <div v-if="isLoading" class="loading">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        <p>Carregando fotos...</p>
      </div>

      <div v-else-if="images.length === 0" class="no-images">
        <i class="pi pi-image" style="font-size: 3rem; color: #ccc"></i>
        <p>Nenhuma imagem encontrada no CDN</p>
        <button @click="loadImages" class="refresh-large-button">
          <i class="pi pi-refresh"></i>
          Tentar novamente
        </button>
      </div>

      <div v-else-if="!isZoomed" class="gallery-grid">
        <div
          v-for="(image, index) in images"
          :key="image.id"
          class="image-thumbnail"
          @click="selectImage(index)"
        >
          <img :src="image.src" :alt="image.alt" loading="lazy" />
          <div class="image-overlay">
            <i class="pi pi-search-plus"></i>
          </div>
        </div>
      </div>

      <div v-else class="image-viewer">
        <button
          class="nav-button prev"
          @click="prevImage"
          title="Imagem anterior (←)"
        >
          <i class="pi pi-chevron-left"></i>
        </button>

        <div class="main-image-container" @click="toggleZoom">
          <img
            :src="currentImage.src"
            :alt="currentImage.alt"
            class="main-image"
          />
        </div>

        <button
          class="nav-button next"
          @click="nextImage"
          title="Próxima imagem (→)"
        >
          <i class="pi pi-chevron-right"></i>
        </button>

        <div class="viewer-controls">
          <button
            @click="isZoomed = false"
            class="control-button"
            title="Voltar à galeria (Esc)"
          >
            <i class="pi pi-th-large"></i>
            Galeria
          </button>
          <button
            @click="toggleZoom"
            class="control-button"
            title="Zoom (Space)"
          >
            <i class="pi pi-search-plus"></i>
            Zoom
          </button>
        </div>
      </div>
    </div>
  </CustomDialog>
</template>

<style scoped>
.photos-modal {
  transition: all 0.3s ease;
}

.photos-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.photos-header h3 {
  margin: 0;
  color: #333;
  font-size: 16px;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.refresh-button {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 6px 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #495057;
  font-size: 14px;
}

.refresh-button:hover:not(:disabled) {
  background: #e9ecef;
  border-color: #adb5bd;
}

.refresh-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.image-counter {
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: #666;
}

.photos-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.loading,
.no-images {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  gap: 1rem;
}

.refresh-large-button {
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.refresh-large-button:hover {
  background: #0056b3;
  transform: translateY(-1px);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  padding: 20px;
  overflow-y: auto;
  height: 100%;
}

.image-thumbnail {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.image-thumbnail:hover {
  transform: scale(1.05);
}

.image-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  color: white;
  font-size: 2rem;
}

.image-thumbnail:hover .image-overlay {
  opacity: 1;
}

.image-viewer {
  display: flex;
  align-items: center;
  height: 100%;
  position: relative;
}

.nav-button {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 20px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
  margin: 0 20px;
}

.nav-button:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.nav-button i {
  font-size: 1.5rem;
}

.main-image-container {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-in;
}

.main-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.viewer-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 20px;
}

.control-button {
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.control-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

/* Responsivo */
@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
    padding: 16px;
  }

  .nav-button {
    padding: 15px;
    margin: 0 10px;
  }

  .viewer-controls {
    bottom: 10px;
    padding: 8px;
  }

  .control-button {
    padding: 6px 12px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
    padding: 12px;
  }

  .nav-button {
    padding: 12px;
    margin: 0 8px;
  }
}
</style>
