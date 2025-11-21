<script setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  header: {
    type: String,
    default: 'Confirmação'
  },
  message: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    default: 'warn',
    validator: (value) => ['info', 'success', 'warn', 'danger'].includes(value)
  },
  confirmLabel: {
    type: String,
    default: 'Sim'
  },
  cancelLabel: {
    type: String,
    default: 'Não'
  }
});

const emit = defineEmits(['update:visible', 'confirm', 'cancel']);

const handleConfirm = () => {
  emit('confirm');
  emit('update:visible', false);
};

const handleCancel = () => {
  emit('cancel');
  emit('update:visible', false);
};

const getSeverityClass = () => {
  const severityMap = {
    info: 'p-button-info',
    success: 'p-button-success',
    warn: 'p-button-warning',
    danger: 'p-button-danger'
  };
  return severityMap[props.severity] || 'p-button-warning';
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
    <div class="confirm-dialog-content">
      <div class="confirm-icon">
        <i
          class="pi"
          :class="{
            'pi-info-circle': severity === 'info',
            'pi-check-circle': severity === 'success',
            'pi-exclamation-triangle': severity === 'warn',
            'pi-times-circle': severity === 'danger'
          }"
        ></i>
      </div>
      <p class="confirm-message">{{ message }}</p>
    </div>

    <template #footer>
      <Button
        :label="cancelLabel"
        icon="pi pi-times"
        text
        severity="secondary"
        @click="handleCancel"
      />
      <Button
        :label="confirmLabel"
        icon="pi pi-check"
        :class="getSeverityClass()"
        @click="handleConfirm"
      />
    </template>
  </Dialog>
</template>

<style scoped>
.confirm-dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 0;
}

.confirm-icon {
  font-size: 3rem;
  color: var(--primary-color);
}

.confirm-icon .pi-info-circle {
  color: #3b82f6;
}

.confirm-icon .pi-check-circle {
  color: #10b981;
}

.confirm-icon .pi-exclamation-triangle {
  color: #f59e0b;
}

.confirm-icon .pi-times-circle {
  color: #ef4444;
}

.confirm-message {
  margin: 0;
  color: var(--text-color);
  font-size: 1rem;
  text-align: center;
}
</style>
