<template>
  <div class="file-viewer">
    <!-- Visualizador de Imagem -->
    <div v-if="fileType === 'image'" class="image-viewer">
      <img :src="fileUrl" :alt="fileName" class="max-w-full max-h-96 object-contain" />
    </div>

    <!-- Visualizador de Vídeo -->
    <div v-else-if="fileType === 'video'" class="video-viewer">
      <video :src="fileUrl" controls class="max-w-full max-h-96">
        Seu navegador não suporta vídeo HTML5.
      </video>
    </div>

    <!-- Visualizador de Áudio -->
    <div v-else-if="fileType === 'audio'" class="audio-viewer">
      <audio :src="fileUrl" controls class="w-full">
        Seu navegador não suporta áudio HTML5.
      </audio>
      <div class="mt-2 p-4 bg-surface-50 rounded">
        <i class="pi pi-music text-4xl text-primary mb-2"></i>
        <p class="font-semibold">{{ fileName }}</p>
      </div>
    </div>

    <!-- Visualizador de Documento -->
    <div v-else-if="fileType === 'document'" class="document-viewer">
      <div v-if="extension === 'txt' || extension === 'md'" class="text-viewer">
        <pre v-if="extension === 'txt'" class="whitespace-pre-wrap bg-surface-50 p-4 rounded border overflow-auto max-h-96">{{ content }}</pre>
        <div v-else-if="extension === 'md'" class="markdown-viewer bg-surface-50 p-4 rounded border overflow-auto max-h-96" v-html="renderedMarkdown"></div>
      </div>
      
      <div v-else-if="extension === 'pdf'" class="pdf-viewer">
        <iframe :src="fileUrl" class="w-full h-96 border rounded"></iframe>
      </div>
      
      <div v-else class="generic-document">
        <div class="text-center p-8 bg-surface-50 rounded border">
          <i class="pi pi-file text-6xl text-primary mb-4"></i>
          <h3 class="text-xl font-semibold mb-2">{{ fileName }}</h3>
          <p class="text-surface-600 mb-4">Documento de {{ extension.toUpperCase() }}</p>
          <Button 
            label="Baixar Arquivo" 
            icon="pi pi-download" 
            @click="downloadFile"
            class="p-button-outlined"
          />
        </div>
      </div>
    </div>

    <!-- Visualizador Genérico -->
    <div v-else class="generic-viewer">
      <div class="text-center p-8 bg-surface-50 rounded border">
        <i class="pi pi-file text-6xl text-surface-400 mb-4"></i>
        <h3 class="text-xl font-semibold mb-2">{{ fileName }}</h3>
        <p class="text-surface-600 mb-4">Arquivo de {{ extension.toUpperCase() }}</p>
        <Button 
          label="Baixar Arquivo" 
          icon="pi pi-download" 
          @click="downloadFile"
          class="p-button-outlined"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import Button from 'primevue/button';
import { onMounted, ref } from 'vue';

const props = defineProps({
  fileName: String,
  fileUrl: String,
  fileType: String,
  extension: String,
  content: String
});

const renderedMarkdown = ref('');

// Função simples para renderizar Markdown básico
function renderMarkdown(text) {
  return text
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>')
    .replace(/\n/gim, '<br>');
}

onMounted(() => {
  if (props.extension === 'md' && props.content) {
    renderedMarkdown.value = renderMarkdown(props.content);
  }
});

function downloadFile() {
  const link = document.createElement('a');
  link.href = props.fileUrl;
  link.download = props.fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
</script>

<style scoped>
.file-viewer {
  width: 100%;
}

.markdown-viewer {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.markdown-viewer h1 {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 1rem 0;
}

.markdown-viewer h2 {
  font-size: 1.25rem;
  font-weight: bold;
  margin: 0.75rem 0;
}

.markdown-viewer h3 {
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0.5rem 0;
}

.markdown-viewer code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-family: monospace;
}

.markdown-viewer pre {
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.markdown-viewer ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.markdown-viewer li {
  list-style-type: disc;
}
</style>
