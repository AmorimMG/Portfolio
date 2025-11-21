<script setup>
import { useDialogService } from '@/composables/useDialogService';
import ConfirmDialog from './ConfirmDialog.vue';
import PromptDialog from './PromptDialog.vue';

const {
  promptState,
  confirmState,
  handlePromptConfirm,
  handlePromptCancel,
  handleConfirmYes,
  handleConfirmNo
} = useDialogService();
</script>

<template>
  <div>
    <PromptDialog
      v-model:visible="promptState.visible"
      :header="promptState.header"
      :message="promptState.message"
      :default-value="promptState.defaultValue"
      :placeholder="promptState.placeholder"
      @confirm="handlePromptConfirm"
      @cancel="handlePromptCancel"
    />
    
    <ConfirmDialog
      v-model:visible="confirmState.visible"
      :header="confirmState.header"
      :message="confirmState.message"
      :severity="confirmState.severity"
      confirm-label="Sim"
      cancel-label="Não"
      @confirm="handleConfirmYes"
      @cancel="handleConfirmNo"
    />
  </div>
</template>
