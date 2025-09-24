<template>
  <div class="info-overlay">
    <h2>{{ totem.title }}</h2>
    <h3>{{ totem.subtitle }}</h3>
    <p>{{ totem.description }}</p>
  </div>
</template>

<script setup>
defineProps({
  totem: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.info-overlay {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px;
  border-radius: 8px;
  max-width: 300px;
  z-index: 1000;
}

.info-overlay h2 {
  margin: 0 0 8px 0;
  font-size: 1.2rem;
}

.info-overlay h3 {
  margin: 0 0 8px 0;
  font-size: 1rem;
  color: #ccc;
}

.info-overlay p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
}
</style>
