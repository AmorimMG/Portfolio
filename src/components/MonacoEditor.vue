<script setup>
import * as monaco from "monaco-editor";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
const props = defineProps({
  modelValue: String,
  readOnly: {
    type: Boolean,
    default: false,
  },
  language: {
    type: String,
    default: "javascript",
  },
});

const editorContainer = ref(null);
let editor = null;

onMounted(() => {
  editor = monaco.editor.create(editorContainer.value, {
    value: props.modelValue,
    language: props.language,
    readOnly: props.readOnly,
    theme: "vs-dark",
  });

  editor.onDidChangeModelContent(() => {
    emit("update:modelValue", editor.getValue());
  });
});

watch(
  () => props.modelValue,
  (newValue) => {
    if (editor && newValue !== editor.getValue()) {
      editor.setValue(newValue);
    }
  }
);

onBeforeUnmount(() => {
  if (editor) {
    editor.dispose();
  }
});
</script>

<template>
  <div ref="editorContainer" class="monaco-editor"></div>
</template>

<style scoped>
.monaco-editor {
  height: 100%;
  width: 100%;
}
</style>
