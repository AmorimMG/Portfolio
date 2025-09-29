<template>
  <Dialog 
    v-model:visible="visible" 
    :modal="true" 
    :style="{ width: '80vw', maxWidth: '1200px' }" 
    :closable="true"
    :header="fileData?.name || 'Visualizador de Arquivo'"
    class="file-modal"
  >
    <div v-if="fileData" class="file-modal-content">
      <!-- Visualizador de Imagem -->
      <div v-if="fileData.type === 'image'" class="image-viewer text-center">
        <img 
          :src="fileData.url" 
          :alt="fileData.name" 
          class="max-w-full max-h-[70vh] object-contain mx-auto rounded"
          @error="handleImageError"
        />
        <div class="mt-4 text-sm text-surface-600">
          <p>{{ formatFileSize(fileData.size) }} • {{ fileData.extension.toUpperCase() }}</p>
        </div>
      </div>

      <!-- Visualizador de Vídeo -->
      <div v-else-if="fileData.type === 'video'" class="video-viewer text-center">
        <video 
          :src="fileData.url" 
          controls 
          class="max-w-full max-h-[70vh] mx-auto rounded"
          @error="handleVideoError"
        >
          Seu navegador não suporta reprodução de vídeo HTML5.
        </video>
        <div class="mt-4 text-sm text-surface-600">
          <p>{{ formatFileSize(fileData.size) }} • {{ fileData.extension.toUpperCase() }}</p>
        </div>
      </div>

      <!-- Visualizador de Áudio -->
      <div v-else-if="fileData.type === 'audio'" class="audio-viewer text-center">
        <div class="bg-surface-50 p-8 rounded-lg">
          <i class="pi pi-music text-6xl text-primary mb-4"></i>
          <h3 class="text-xl font-semibold mb-4">{{ fileData.name }}</h3>
          <audio 
            :src="fileData.url" 
            controls 
            class="w-full max-w-md mx-auto"
            @error="handleAudioError"
          >
            Seu navegador não suporta reprodução de áudio HTML5.
          </audio>
        </div>
        <div class="mt-4 text-sm text-surface-600">
          <p>{{ formatFileSize(fileData.size) }} • {{ fileData.extension.toUpperCase() }}</p>
        </div>
      </div>

      <!-- Visualizador de Documento -->
      <div v-else-if="fileData.type === 'document'" class="document-viewer">
        <!-- Texto/Markdown -->
        <div v-if="['txt', 'md', 'json', 'js', 'css', 'html'].includes(fileData.extension)" class="text-viewer">
          <div class="bg-surface-50 p-4 rounded border max-h-[70vh] overflow-auto">
            <pre v-if="fileData.extension === 'txt'" class="whitespace-pre-wrap font-mono text-sm">{{ fileData.content }}</pre>
            <div v-else-if="fileData.extension === 'md'" class="markdown-content prose max-w-none" v-html="renderedMarkdown"></div>
            <pre v-else class="whitespace-pre-wrap font-mono text-sm"><code>{{ fileData.content }}</code></pre>
          </div>
        </div>
        
        <!-- PDF -->
        <div v-else-if="fileData.extension === 'pdf'" class="pdf-viewer">
          <iframe 
            :src="fileData.url" 
            class="w-full h-[70vh] border rounded"
            @error="handlePDFError"
          ></iframe>
        </div>
        
        <!-- Documento Genérico -->
        <div v-else class="generic-document text-center p-8">
          <i class="pi pi-file text-6xl text-primary mb-4"></i>
          <h3 class="text-xl font-semibold mb-2">{{ fileData.name }}</h3>
          <p class="text-surface-600 mb-4">Documento {{ fileData.extension.toUpperCase() }}</p>
          <p class="text-sm text-surface-500 mb-4">
            {{ formatFileSize(fileData.size) }} • Modificado em {{ formatDate(fileData.modified) }}
          </p>
        </div>
      </div>

      <!-- Visualizador Genérico -->
      <div v-else class="generic-viewer text-center p-8">
        <i class="pi pi-file text-6xl text-surface-400 mb-4"></i>
        <h3 class="text-xl font-semibold mb-2">{{ fileData.name }}</h3>
        <p class="text-surface-600 mb-4">Arquivo {{ fileData.extension.toUpperCase() }}</p>
        <p class="text-sm text-surface-500 mb-4">
          {{ formatFileSize(fileData.size) }} • Modificado em {{ formatDate(fileData.modified) }}
        </p>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between items-center w-full">
        <div class="text-sm text-surface-500">
          {{ fileData?.path }}
        </div>
        <div class="space-x-2">
          <Button 
            v-if="fileData?.url" 
            label="Baixar" 
            icon="pi pi-download" 
            @click="downloadFile"
            class="p-button-outlined"
          />
          <Button 
            label="Fechar" 
            icon="pi pi-times" 
            @click="visible = false"
            class="p-button-secondary"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { useNotifications } from '@/composables/useNotifications';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { computed, ref, watch } from 'vue';

const props = defineProps({
  visible: Boolean,
  fileData: Object
});

const emit = defineEmits(['update:visible']);

const { notifyError } = useNotifications();

const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

const renderedMarkdown = ref('');

// Renderizar Markdown
function renderMarkdown(text) {
  if (!text) return '';
  
  return text
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
    .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-100 p-3 rounded mt-2 mb-2 overflow-x-auto"><code>$1</code></pre>')
    .replace(/`([^`]+)`/gim, '<code class="bg-gray-100 px-1 rounded font-mono text-sm">$1</code>')
    .replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/(<li>.*<\/li>)/gims, '<ul class="list-disc pl-4 mb-2">$1</ul>')
    .replace(/\n\n/gim, '</p><p class="mb-2">') 
    .replace(/\n/gim, '<br>');
}

// Watchers
watch(() => props.fileData, (newData) => {
  if (newData?.extension === 'md' && newData?.content) {
    renderedMarkdown.value = renderMarkdown(newData.content);
  }
}, { immediate: true });

// Métodos de tratamento de erro
function handleImageError() {
  notifyError('Erro de Imagem', 'Não foi possível carregar a imagem');
}

function handleVideoError() {
  notifyError('Erro de Vídeo', 'Não foi possível reproduzir o vídeo');
}

function handleAudioError() {
  notifyError('Erro de Áudio', 'Não foi possível reproduzir o áudio');
}

function handlePDFError() {
  notifyError('Erro de PDF', 'Não foi possível visualizar o PDF');
}

// Utilitários
function formatFileSize(bytes) {
  if (!bytes) return '0 bytes';
  
  const sizes = ['bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function downloadFile() {
  if (!props.fileData?.url) return;
  
  const link = document.createElement('a');
  link.href = props.fileData.url;
  link.download = props.fileData.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>

<style scoped>
.file-modal-content {
  min-height: 200px;
}

.prose {
  max-width: none;
}

.prose h1, .prose h2, .prose h3 {
  color: inherit;
}

.prose code {
  color: inherit;
  background-color: #f3f4f6;
}

.prose pre {
  background-color: #f3f4f6;
  color: inherit;
}
</style>
