<template>
  <div ref="blocker" class="blocker">
    <div ref="instructions" class="instructions">
      <p style="font-size: 12px; color: red">------- in Development -------</p>
      <p style="font-size: 36px">Click to play</p>
      <p>
        Move: WASD<br />
        Jump: SPACE<br />
        Look: MOUSE<br />
        Run: Shift<br />
        Change POV: R<br />
        Exit: ESC
      </p>
      <p style="font-size: 12px; color: red">------- in Development -------</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const blocker = ref(null);
const instructions = ref(null);

// Expose refs to parent component
defineExpose({
  blocker,
  instructions,
});

onMounted(() => {
  // Any initialization logic specific to instructions overlay
});
</script>

<style scoped>
.blocker {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  pointer-events: auto;
}

.instructions {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
  color: white;
  pointer-events: auto;
}
</style>
