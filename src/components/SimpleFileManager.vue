<template>
  <div class="simple-file-manager">
    <div class="mb-4">
      <h3 class="text-lg font-semibold mb-2">Gerenciador de Arquivos Simples</h3>
      <p class="text-sm text-surface-600 mb-4">
        Adicione arquivos colocando-os na pasta <code>public/user-files/</code> e registrando aqui.
      </p>
    </div>

    <!-- Formulário para adicionar arquivo -->
    <Card class="mb-4">
      <template #title>Adicionar Arquivo</template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2">Categoria</label>
            <Dropdown 
              v-model="selectedCategory" 
              :options="categories" 
              optionLabel="label" 
              optionValue="value"
              placeholder="Selecione uma categoria"
              class="w-full"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Nome do Arquivo</label>
            <InputText 
              v-model="fileName" 
              placeholder="exemplo: minha-foto.jpg"
              class="w-full"
              @keyup.enter="handleAddFile"
            />
          </div>
          
          <div class="flex items-end">
            <Button 
              @click="handleAddFile"
              :disabled="!selectedCategory || !fileName"
              icon="pi pi-plus"
              label="Adicionar"
              class="w-full"
            />
          </div>
        </div>
      </template>
    </Card>

    <!-- Lista de arquivos registrados -->
    <Card>
      <template #title>Arquivos Registrados</template>
      <template #content>
        <div class="space-y-4">
          <div v-for="(files, category) in registeredFiles" :key="category" class="border rounded p-4">
            <h4 class="font-medium mb-2 capitalize">{{ category }} ({{ files.length }})</h4>
            
            <div v-if="files.length === 0" class="text-surface-500 text-sm">
              Nenhum arquivo registrado nesta categoria
            </div>
            
            <div v-else class="space-y-2">
              <div 
                v-for="file in files" 
                :key="file"
                class="flex items-center justify-between p-2 bg-surface-50 rounded"
              >
                <div class="flex items-center space-x-2">
                  <i :class="getFileIcon(file)" class="text-primary"></i>
                  <span class="text-sm">{{ file }}</span>
                  <Button
                    icon="pi pi-external-link"
                    text
                    size="small"
                    @click="openFile(category, file)"
                    v-tooltip="'Abrir arquivo'"
                  />
                </div>
                
                <div class="flex items-center space-x-2">
                  <Button
                    icon="pi pi-refresh"
                    text
                    size="small"
                    @click="checkFile(category, file)"
                    v-tooltip="'Verificar se existe'"
                  />
                  <Button
                    icon="pi pi-times"
                    text
                    severity="danger"
                    size="small"
                    @click="handleRemoveFile(category, file)"
                    v-tooltip="'Remover do registro'"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-4 pt-4 border-t">
          <Button 
            @click="handleRefreshFiles"
            icon="pi pi-refresh"
            label="Atualizar Todos os Arquivos"
            class="w-full"
            outlined
          />
        </div>
      </template>
    </Card>

    <!-- Instruções -->
    <Card class="mt-4">
      <template #title>Como Usar</template>
      <template #content>
        <ol class="list-decimal list-inside space-y-2 text-sm">
          <li>Coloque seus arquivos na pasta <code>public/user-files/[categoria]/</code></li>
          <li>Use o formulário acima para registrar o arquivo no sistema</li>
          <li>O arquivo aparecerá automaticamente no FileManager e Desktop</li>
          <li>Duplo clique nos arquivos para visualizá-los</li>
        </ol>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { useFileOpener } from '@/composables/useFileOpener';
import { useSimpleFileManager } from '@/composables/useSimpleFileManager';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import { onMounted, ref } from 'vue';

const fileManager = useSimpleFileManager();
const { openFile: openFileViewer } = useFileOpener();

const selectedCategory = ref('');
const fileName = ref('');
const registeredFiles = ref({});

const categories = [
  { label: 'Imagens', value: 'images' },
  { label: 'Vídeos', value: 'videos' },
  { label: 'Documentos', value: 'documents' },
  { label: 'Música', value: 'music' }
];

// Carregar arquivos registrados
function loadRegisteredFiles() {
  registeredFiles.value = fileManager.listRegisteredFiles();
}

// Adicionar arquivo
async function handleAddFile() {
  if (!selectedCategory.value || !fileName.value) return;
  
  const success = await fileManager.addFile(selectedCategory.value, fileName.value);
  if (success) {
    fileName.value = '';
    loadRegisteredFiles();
  }
}

// Remover arquivo
async function handleRemoveFile(category, file) {
  fileManager.removeFile(category, file);
  loadRegisteredFiles();
}

// Atualizar arquivos
async function handleRefreshFiles() {
  await fileManager.refreshFiles();
  loadRegisteredFiles();
}

// Verificar se arquivo existe
async function checkFile(category, file) {
  const exists = await fileManager.checkFileExists(category, file);
  if (exists) {
    // Notificação já é exibida pelo composable
  }
}

// Abrir arquivo
async function openFile(category, file) {
  const path = `/home/amorim/${getCategoryPath(category)}/${file}`;
  await openFileViewer(path);
}

// Obter caminho da categoria
function getCategoryPath(category) {
  const paths = {
    images: 'Pictures',
    videos: 'Videos',
    documents: 'Documents',
    music: 'Music'
  };
  return paths[category] || category;
}

// Obter ícone do arquivo
function getFileIcon(fileName) {
  const extension = fileName.split('.').pop().toLowerCase();
  
  const iconMap = {
    // Imagens
    jpg: 'pi pi-image', jpeg: 'pi pi-image', png: 'pi pi-image', 
    gif: 'pi pi-image', svg: 'pi pi-image', webp: 'pi pi-image',
    
    // Vídeos
    mp4: 'pi pi-video', webm: 'pi pi-video', ogg: 'pi pi-video',
    avi: 'pi pi-video', mov: 'pi pi-video',
    
    // Áudio
    mp3: 'pi pi-music', wav: 'pi pi-music', m4a: 'pi pi-music',
    flac: 'pi pi-music',
    
    // Documentos
    pdf: 'pi pi-file-pdf', txt: 'pi pi-file', md: 'pi pi-file-edit',
    doc: 'pi pi-file-word', docx: 'pi pi-file-word',
    json: 'pi pi-code', js: 'pi pi-code', css: 'pi pi-palette',
    html: 'pi pi-code'
  };
  
  return iconMap[extension] || 'pi pi-file';
}

onMounted(() => {
  loadRegisteredFiles();
});
</script>

<style scoped>
code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-family: monospace;
  font-size: 0.875rem;
}
</style>
