<script setup>
import { onMounted, ref } from "vue";
import CardEffect from "./CardEffect.vue";

const props = defineProps({
  img: String,
  title: String,
  subtitle: String,
  description: String,
  link: String,
  languages: Array,
});

const imageLoaded = ref(false);
const imageError = ref(false);
const preloadedImage = ref(null);

const preloadImage = () => {
  if (!props.img) return;

  preloadedImage.value = new Image();
  preloadedImage.value.src = props.img;

  preloadedImage.value.onload = handleImageLoad;
  preloadedImage.value.onerror = handleImageError;
};

const handleImageLoad = () => {
  setTimeout(() => {
    imageLoaded.value = true;
    imageError.value = false;
  }, 100);
};

const handleImageError = () => {
  imageLoaded.value = false;
  imageError.value = true;
};

onMounted(() => {
  preloadImage();
});
</script>

<template>
  <CardEffect>
    <div
      class="rounded-xl overflow-hidden shadow-lg bg-zinc-900 text-white w-[25rem]"
    >
      <div class="relative w-full h-[200px] overflow-hidden">
        <div
          v-if="!imageLoaded && !imageError"
          class="absolute inset-0 bg-zinc-700 animate-pulse z-10 rounded-t-xl"
        ></div>

        <div
          v-if="imageError"
          class="absolute inset-0 bg-zinc-800 flex items-center justify-center z-20 rounded-t-xl"
        >
          <span class="text-zinc-400">Failed to load image</span>
        </div>

        <img
          v-show="imageLoaded"
          :alt="title"
          :src="props.img"
          class="absolute inset-0 w-full h-full object-cover z-20"
        />
      </div>

      <div class="px-4 pt-4 text-xl font-bold">
        {{ props.title }}
      </div>

      <div class="px-4 mt-1 flex justify-between items-center flex-wrap gap-2">
        <span class="text-sm text-zinc-300">{{ props.subtitle }}</span>
        <div class="flex flex-wrap gap-2 mt-1">
          <span
            v-for="language in languages"
            :key="language"
            class="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded"
          >
            {{ language }}
          </span>
        </div>
      </div>

      <div class="px-4 py-2 text-sm text-zinc-200">
        {{ props.description }}
      </div>

      <div class="px-4 pb-4 mt-2">
        <a
          :href="props.link"
          target="_blank"
          rel="noopener noreferrer"
          class="block"
        >
          <button
            class="w-full bg-transparent border border-white text-white py-2 rounded hover:bg-white hover:text-black transition"
          >
            Open
          </button>
        </a>
      </div>
    </div>
  </CardEffect>
</template>
