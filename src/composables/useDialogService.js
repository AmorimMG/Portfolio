import { ref } from 'vue';

// Estado global para as modais
const promptState = ref({
  visible: false,
  header: '',
  message: '',
  defaultValue: '',
  placeholder: '',
  resolve: null,
  reject: null
});

const confirmState = ref({
  visible: false,
  header: '',
  message: '',
  severity: 'warn',
  resolve: null,
  reject: null
});

export function useDialogService() {
  const showPrompt = ({ header = 'Entrada', message = 'Digite um valor:', defaultValue = '', placeholder = '' }) => {
    return new Promise((resolve, reject) => {
      promptState.value = {
        visible: true,
        header,
        message,
        defaultValue,
        placeholder,
        resolve,
        reject
      };
    });
  };

  const showConfirm = ({ header = 'Confirmação', message, severity = 'warn' }) => {
    return new Promise((resolve, reject) => {
      confirmState.value = {
        visible: true,
        header,
        message,
        severity,
        resolve,
        reject
      };
    });
  };

  const handlePromptConfirm = (value) => {
    if (promptState.value.resolve) {
      promptState.value.resolve(value);
    }
    promptState.value.visible = false;
  };

  const handlePromptCancel = () => {
    if (promptState.value.reject) {
      promptState.value.reject(new Error('Cancelled'));
    }
    promptState.value.visible = false;
  };

  const handleConfirmYes = () => {
    if (confirmState.value.resolve) {
      confirmState.value.resolve(true);
    }
    confirmState.value.visible = false;
  };

  const handleConfirmNo = () => {
    if (confirmState.value.resolve) {
      confirmState.value.resolve(false);
    }
    confirmState.value.visible = false;
  };

  return {
    promptState,
    confirmState,
    showPrompt,
    showConfirm,
    handlePromptConfirm,
    handlePromptCancel,
    handleConfirmYes,
    handleConfirmNo
  };
}
