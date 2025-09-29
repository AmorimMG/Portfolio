<!-- Exemplo de como usar no FileManager ou Desktop -->
<template>
  <div class="file-item" @dblclick="handleDoubleClick">
    <!-- Conteúdo do item de arquivo -->
    <div class="file-icon">
      <i :class="getFileIcon(item)"></i>
    </div>
    <div class="file-name">{{ item.name }}</div>
  </div>

  <!-- Modal de visualização -->
  <FileViewerModal 
    v-model:visible="isViewerOpen" 
    :file-data="currentFileData" 
  />

  <!-- Sistema de notificações -->
  <NotificationToast />
</template>

<script setup>
import FileViewerModal from '@/components/FileViewerModal.vue';
import NotificationToast from '@/components/NotificationToast.vue';
import { useFileOpener } from '@/composables/useFileOpener';

const props = defineProps({
  item: Object // Item do sistema de arquivos
});

const { isViewerOpen, currentFileData, openFile, canOpen } = useFileOpener();

async function handleDoubleClick() {
  if (props.item.type === 'dir') {
    // Navegar para o diretório
    return;
  }
  
  // Tentar abrir o arquivo
  await openFile(props.item.path);
}

function getFileIcon(item) {
  if (item.type === 'dir') return 'pi pi-folder';
  
  const extension = item.extension || item.name.split('.').pop().toLowerCase();
  const fileType = item.fileType;
  
  // Ícones por tipo
  if (fileType === 'image') return 'pi pi-image';
  if (fileType === 'video') return 'pi pi-video';
  if (fileType === 'audio') return 'pi pi-music';
  
  // Ícones por extensão
  const iconMap = {
    'pdf': 'pi pi-file-pdf',
    'txt': 'pi pi-file',
    'md': 'pi pi-file-edit',
    'json': 'pi pi-code',
    'js': 'pi pi-code',
    'css': 'pi pi-palette',
    'html': 'pi pi-code'
  };
  
  return iconMap[extension] || 'pi pi-file';
}
</script>

<style scoped>
.file-item {
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.file-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.file-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.file-name {
  text-align: center;
  font-size: 0.875rem;
  word-break: break-word;
}
</style>
