<script setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import { ref, watch } from 'vue';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  header: {
    type: String,
    default: 'Entrada'
  },
  message: {
    type: String,
    default: 'Digite um valor:'
  },
  defaultValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:visible', 'confirm', 'cancel']);

const inputValue = ref('');
const inputRef = ref(null);

watch(() => props.visible, (newVal) => {
  if (newVal) {
    inputValue.value = props.defaultValue;
    setTimeout(() => {
      inputRef.value?.$el?.focus();
      inputRef.value?.$el?.select();
    }, 100);
  }
});

const handleConfirm = () => {
  emit('confirm', inputValue.value);
  emit('update:visible', false);
};

const handleCancel = () => {
  emit('cancel');
  emit('update:visible', false);
};

const handleKeydown = (event) => {
  if (event.key === 'Enter') {
    handleConfirm();
  } else if (event.key === 'Escape') {
    handleCancel();
  }
};
</script>

<template>
  <Dialog
    :visible="visible"
    :header="header"
    :modal="true"
    :closable="true"
    :style="{ width: '450px' }"
    @update:visible="$emit('update:visible', $event)"
  >
    <div class="prompt-dialog-content">
      <p class="prompt-message">{{ message }}</p>
      <InputText
        ref="inputRef"
        v-model="inputValue"
        :placeholder="placeholder"
        class="w-full"
        @keydown="handleKeydown"
      />
    </div>

    <template #footer>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        text
        severity="secondary"
        @click="handleCancel"
      />
      <Button
        label="Confirmar"
        icon="pi pi-check"
        @click="handleConfirm"
      />
    </template>
  </Dialog>
</template>

<style scoped>
.prompt-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
}

.prompt-message {
  margin: 0;
  color: var(--text-color);
  font-size: 1rem;
}
</style>
