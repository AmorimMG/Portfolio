<script setup>
import { componentMap } from '@/data/appsDock';
import { useFileSystemStore } from '@/stores/useFileSystemStore';
import { useTrashStore } from '@/stores/useTrashStore';
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

// Registrar componentes dinamicamente

const { t } = useI18n();
const fileSystemStore = useFileSystemStore();
const trashStore = useTrashStore();

// Estados locais
const selectedItems = ref([]);
const contextMenuVisible = ref(false);
const contextMenuPosition = ref({ x: 0, y: 0 });
const showCreateDialog = ref(false);
const createItemType = ref('file');
const newItemName = ref('');
const searchQuery = ref('');
const viewMode = ref('grid'); // 'grid' | 'list'

// Estados para controle de componentes de apps
const currentAppComponent = ref(null);
const currentAppData = ref(null);
const appModalVisible = ref(false);
const appComponentRef = ref(null);

// Props para navegação externa
const props = defineProps({
    initialPath: {
        type: String,
        default: null
    },
    selectedFile: {
        type: String,
        default: null
    }
});

// Computeds
const currentDirectoryContents = computed(() => {
    let items = fileSystemStore.currentDirectoryContents;
    
    if (searchQuery.value) {
        items = items.filter(item => 
            item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
    }
    
    return items;
});

const breadcrumbs = computed(() => {
    const path = fileSystemStore.currentPath;
    const parts = path.split('/').filter(part => part);
    
    const crumbs = [{ name: 'Home', path: '/' }];
    let currentPath = '';
    
    parts.forEach(part => {
        currentPath += '/' + part;
        crumbs.push({
            name: part,
            path: currentPath
        });
    });
    
    return crumbs;
});

// Métodos de navegação
const navigateToPath = (path) => {
    fileSystemStore.changeDirectory(path);
    selectedItems.value = [];
};

const goUp = () => {
    const parentPath = fileSystemStore.currentPath.split('/').slice(0, -1).join('/') || '/';
    navigateToPath(parentPath);
};

const goBack = () => {
    fileSystemStore.goBack();
    selectedItems.value = [];
};

// Métodos de seleção
const toggleSelection = (item) => {
    const index = selectedItems.value.findIndex(selected => selected.path === item.path);
    if (index === -1) {
        selectedItems.value.push(item);
    } else {
        selectedItems.value.splice(index, 1);
    }
};

const selectAll = () => {
    selectedItems.value = [...currentDirectoryContents.value];
};

const clearSelection = () => {
    selectedItems.value = [];
};

const isSelected = (item) => {
    return selectedItems.value.some(selected => selected.path === item.path);
};

// Métodos de arquivo/diretório
const handleDoubleClick = (item) => {
    if (item.type === 'dir') {
        navigateToPath(item.path);
    } else {
        // Abrir arquivo (implementar conforme necessário)
        openFile(item);
    }
};

const openFile = (item) => {
    // Se for um arquivo .app, abrir o componente correspondente
    if (item.name.endsWith('.app') && item.content) {
        try {
            const appData = JSON.parse(item.content);
            const componentName = appData.component || appData.name;
            
            if (componentName && componentMap[componentName]) {
                // Definir o componente e dados
                currentAppComponent.value = componentName;
                currentAppData.value = appData;
                appModalVisible.value = true;
                
                console.log('Opening app component:', componentName, appData);
                
                // Aguardar o próximo tick para o componente ser renderizado
                nextTick(() => {
                    // Tentar diferentes abordagens para abrir o modal
                    if (appComponentRef.value) {
                        const componentElement = appComponentRef.value.$el || appComponentRef.value;
                        
                        if (componentElement) {
                            // Tentar encontrar e clicar no botão principal
                            const buttons = componentElement.querySelectorAll('button');
                            
                            // Priorizar botões com texto específico ou classes específicas
                            let targetButton = null;
                            
                            for (const button of buttons) {
                                const buttonText = button.textContent?.toLowerCase() || '';
                                
                                // Pular botões de fechar/minimizar
                                if (buttonText.includes('close') || 
                                    buttonText.includes('×') || 
                                    button.querySelector('.pi-times') ||
                                    button.classList.contains('p-dialog-header-close')) {
                                    continue;
                                }
                                
                                // Encontrar o primeiro botão válido
                                if (button.offsetParent !== null) { // Botão visível
                                    targetButton = button;
                                    break;
                                }
                            }
                            
                            if (targetButton) {
                                console.log('Auto-clicking button to open modal for:', componentName);
                                targetButton.click();
                            } else {
                                // Se não encontrou botão, tentar definir propriedades internas
                                const componentInstance = appComponentRef.value;
                                if (componentInstance) {
                                    // Tentar diferentes propriedades comuns baseadas no nome do componente
                                    if (componentName === 'LastFMModal' && typeof componentInstance.lastFMVisible !== 'undefined') {
                                        componentInstance.lastFMVisible = true;
                                    } else if (componentName === 'PiModal' && typeof componentInstance.piVisible !== 'undefined') {
                                        componentInstance.piVisible = true;
                                    } else if (componentName === 'CVModal' && typeof componentInstance.cvVisible !== 'undefined') {
                                        componentInstance.cvVisible = true;
                                    } else if (componentName === 'ProjectsModal' && typeof componentInstance.projectsVisible !== 'undefined') {
                                        componentInstance.projectsVisible = true;
                                    } else if (componentName === 'DoomModal' && typeof componentInstance.doomVisible !== 'undefined') {
                                        componentInstance.doomVisible = true;
                                    } else if (componentName === 'SeverenceModal' && typeof componentInstance.severenceVisible !== 'undefined') {
                                        componentInstance.severenceVisible = true;
                                    }
                                    
                                    console.log('Trying to set internal modal state for:', componentName);
                                }
                            }
                        }
                    }
                });
                return;
            }
        } catch (error) {
            console.error('Error parsing app file:', error);
        }
    }
    
    // Implementar abertura de outros tipos de arquivos
    if (item.name.endsWith('.txt') || item.name.endsWith('.md')) {
        // Abrir em editor de texto
        console.log('Opening text file:', item.name);
    } else if (item.name.endsWith('.jpg') || item.name.endsWith('.png')) {
        // Abrir visualizador de imagens
        console.log('Opening image:', item.name);
    }
    // Adicionar mais tipos conforme necessário
};

const createNewItem = () => {
    if (!newItemName.value.trim()) return;
    
    const result = createItemType.value === 'dir' 
        ? fileSystemStore.createDirectory(newItemName.value.trim())
        : fileSystemStore.createFile(newItemName.value.trim(), '');
    
    if (result.success) {
        showCreateDialog.value = false;
        newItemName.value = '';
    } else {
        // Mostrar erro
        console.error(result.error);
    }
};

const deleteSelected = () => {
    if (selectedItems.value.length === 0) return;
    
    if (confirm(`Delete ${selectedItems.value.length} item(s)?`)) {
        selectedItems.value.forEach(item => {
            const pathParts = item.path.split('/');
            const itemName = pathParts.pop();
            const parentPath = pathParts.join('/') || '/';
            
            fileSystemStore.removeItem(itemName, parentPath);
        });
        
        clearSelection();
    }
};

const copyToDesktop = () => {
    if (selectedItems.value.length === 0) return;
    
    selectedItems.value.forEach(item => {
        fileSystemStore.addToDesktop({
            name: item.name,
            type: item.type,
            content: item.content || '',
            size: item.size,
            permissions: item.permissions
        });
    });
    
    clearSelection();
};

// Context menu
const showContextMenu = (event, item) => {
    event.preventDefault();
    
    if (!isSelected(item)) {
        selectedItems.value = [item];
    }
    
    contextMenuPosition.value = { x: event.clientX, y: event.clientY };
    contextMenuVisible.value = true;
};

const hideContextMenu = () => {
    contextMenuVisible.value = false;
};

// Formatação
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
};

const getFileIcon = (item) => {
    if (item.type === 'dir') return '📁';
    
    const ext = item.name.split('.').pop()?.toLowerCase();
    
    // Se for um arquivo .app, tentar extrair o ícone do conteúdo JSON
    if (ext === 'app' && item.content) {
        try {
            const appData = JSON.parse(item.content);
            if (appData.icon) {
                return appData.icon;
            }
        } catch (error) {
            console.warn('Error parsing app file content:', error);
        }
    }
    
    const iconMap = {
        'txt': '📄',
        'md': '📝',
        'js': '📜',
        'json': '📋',
        'pdf': '📕',
        'jpg': '🖼️',
        'jpeg': '🖼️',
        'png': '🖼️',
        'gif': '🖼️',
        'mp3': '🎵',
        'mp4': '🎬',
        'zip': '📦',
        'app': '📱' // Ícone padrão para apps
    };
    
    return iconMap[ext] || '📄';
};

const isImageIcon = (icon) => {
    if (!icon || typeof icon !== 'string') return false;
    // Verificar se é uma URL (começa com http, https, ou /)
    return icon.startsWith('http') || icon.startsWith('/') || icon.includes('.');
};

// Função para fechar modal do app
const closeAppModal = () => {
    appModalVisible.value = false;
    currentAppComponent.value = null;
    currentAppData.value = null;
};

// Função para navegar para um caminho específico e selecionar um arquivo
const navigateToFileLocation = (path, fileName) => {
    if (path) {
        fileSystemStore.changeDirectory(path);
    }
    
    if (fileName) {
        // Aguardar o próximo tick para garantir que o diretório foi carregado
        nextTick(() => {
            const targetFile = currentDirectoryContents.value.find(item => item.name === fileName);
            if (targetFile) {
                selectedItems.value = [targetFile];
            }
        });
    }
};

// Lifecycle
onMounted(() => {
    document.addEventListener('click', hideContextMenu);
    
    // Navegar para caminho inicial se fornecido
    if (props.initialPath) {
        navigateToFileLocation(props.initialPath, props.selectedFile);
    }
});

onUnmounted(() => {
    document.removeEventListener('click', hideContextMenu);
});

// Escutar mudanças no sistema de arquivos
const unsubscribe = fileSystemStore.onFileSystemChange((event) => {
    // Atualizar UI quando houver mudanças
    console.log('File system changed:', event);
});

onUnmounted(() => {
    unsubscribe();
});

// Expor funções para uso externo
defineExpose({
    navigateToFileLocation,
    navigateToPath
});
</script>

<template>
    <div class="file-manager">
        <!-- Toolbar -->
        <div class="toolbar">
            <div class="navigation-buttons">
                <Button 
                    icon="pi pi-arrow-left" 
                    @click="goBack"
                    :disabled="fileSystemStore.history.length === 0"
                    size="small"
                    outlined
                />
                <Button 
                    icon="pi pi-arrow-up" 
                    @click="goUp"
                    :disabled="fileSystemStore.currentPath === '/'"
                    size="small"
                    outlined
                />
            </div>
            
            <!-- Breadcrumbs -->
            <div class="breadcrumbs">
                <span 
                    v-for="(crumb, index) in breadcrumbs"
                    :key="crumb.path"
                    class="breadcrumb"
                    @click="navigateToPath(crumb.path)"
                >
                    {{ crumb.name }}
                    <i v-if="index < breadcrumbs.length - 1" class="pi pi-chevron-right"></i>
                </span>
            </div>
            
            <!-- Search -->
            <div class="search">
                <InputText 
                    v-model="searchQuery"
                    placeholder="Search files..."
                    size="small"
                />
            </div>
            
            <!-- Actions -->
            <div class="actions">
                <Button 
                    icon="pi pi-plus" 
                    @click="showCreateDialog = true"
                    size="small"
                    outlined
                />
                <Button 
                    icon="pi pi-trash" 
                    @click="deleteSelected"
                    :disabled="selectedItems.length === 0"
                    size="small"
                    severity="danger"
                    outlined
                />
            </div>
            
            <!-- View mode -->
            <div class="view-mode">
                <Button 
                    icon="pi pi-th-large"
                    @click="viewMode = 'grid'"
                    :outlined="viewMode !== 'grid'"
                    size="small"
                />
                <Button 
                    icon="pi pi-list"
                    @click="viewMode = 'list'"
                    :outlined="viewMode !== 'list'"
                    size="small"
                />
            </div>
        </div>
        
        <!-- File list -->
        <div class="file-content" :class="{ 'grid-view': viewMode === 'grid', 'list-view': viewMode === 'list' }">
            <div 
                v-for="item in currentDirectoryContents"
                :key="item.path"
                class="file-item"
                :class="{ selected: isSelected(item) }"
                @click="toggleSelection(item)"
                @dblclick="handleDoubleClick(item)"
                @contextmenu="showContextMenu($event, item)"
            >
                <div class="file-icon">
                    <img v-if="isImageIcon(getFileIcon(item))" 
                         :src="getFileIcon(item)" 
                         :alt="item.name"
                         class="file-icon-image"
                         loading="lazy" />
                    <span v-else>{{ getFileIcon(item) }}</span>
                </div>
                <div class="file-info">
                    <div class="file-name">{{ item.name }}</div>
                    <div v-if="viewMode === 'list'" class="file-details">
                        <span class="file-size">{{ formatFileSize(item.size || 0) }}</span>
                        <span class="file-date">{{ formatDate(item.modified) }}</span>
                        <span class="file-permissions">{{ item.permissions }}</span>
                    </div>
                </div>
            </div>
            
            <div v-if="currentDirectoryContents.length === 0" class="empty-folder">
                <i class="pi pi-folder-open" style="font-size: 3rem; color: #ccc;"></i>
                <p>This folder is empty</p>
            </div>
        </div>
        
        <!-- Context Menu -->
        <ContextMenu 
            v-if="contextMenuVisible"
            :style="{ 
                position: 'fixed', 
                left: contextMenuPosition.x + 'px', 
                top: contextMenuPosition.y + 'px',
                zIndex: 1000
            }"
        >
            <template #item="{ item }">
                <div class="context-menu-item" @click="item.command">
                    <i :class="item.icon"></i>
                    <span>{{ item.label }}</span>
                </div>
            </template>
            <template #default>
                <div class="context-menu">
                    <div class="context-menu-item" @click="copyToDesktop">
                        <i class="pi pi-copy"></i>
                        <span>Copy to Desktop</span>
                    </div>
                    <div class="context-menu-item" @click="deleteSelected">
                        <i class="pi pi-trash"></i>
                        <span>Delete</span>
                    </div>
                </div>
            </template>
        </ContextMenu>
        
        <!-- Create Dialog -->
        <Dialog 
            v-model:visible="showCreateDialog" 
            header="Create New Item"
            modal
            :style="{ width: '400px' }"
        >
            <div class="create-dialog">
                <div class="field">
                    <label>Type:</label>
                    <SelectButton 
                        v-model="createItemType" 
                        :options="[
                            { label: 'File', value: 'file' },
                            { label: 'Folder', value: 'dir' }
                        ]"
                        optionLabel="label"
                        optionValue="value"
                    />
                </div>
                
                <div class="field">
                    <label>Name:</label>
                    <InputText 
                        v-model="newItemName"
                        placeholder="Enter name..."
                        @keyup.enter="createNewItem"
                        autofocus
                    />
                </div>
            </div>
            
            <template #footer>
                <Button 
                    label="Cancel" 
                    @click="showCreateDialog = false"
                    outlined
                />
                <Button 
                    label="Create" 
                    @click="createNewItem"
                    :disabled="!newItemName.trim()"
                />
            </template>
        </Dialog>
        
        <!-- Status bar -->
        <div class="status-bar">
            <span>{{ currentDirectoryContents.length }} items</span>
            <span v-if="selectedItems.length > 0">{{ selectedItems.length }} selected</span>
            <span>{{ fileSystemStore.currentPath }}</span>
        </div>
        
        <!-- App Component Modal -->
        <div v-if="appModalVisible && currentAppComponent && componentMap[currentAppComponent]" class="app-modal-container">
            <component 
                :is="componentMap[currentAppComponent]"
                ref="appComponentRef"
                :visible="appModalVisible"
                :isTopbar="true"
                @update:visible="(value) => { if (!value) closeAppModal() }"
                @hide="closeAppModal"
                @close="closeAppModal"
                v-bind="currentAppData"
            />
        </div>
    </div>
</template>

<style scoped>
.file-manager {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: white;
    border-radius: 8px;
    overflow: hidden;
}

.toolbar {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
}

.navigation-buttons {
    display: flex;
    gap: 0.25rem;
}

.breadcrumbs {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
    color: black;
}

.breadcrumb {
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.breadcrumb:hover {
    background: #e9ecef;
}

.search {
    min-width: 200px;
}

.actions, .view-mode {
    display: flex;
    gap: 0.25rem;
}

.file-content {
    flex: 1;
    overflow: auto;
    padding: 1rem;
}

.file-content.grid-view {
    display: grid;
    grid-template-columns: repeat(auto-fill, 120px);
    gap: 1rem;
    justify-content: start;
    align-content: start;
}

.file-content.list-view {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.file-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.75rem;
    border-radius: 8px;
    cursor: pointer;
    user-select: none;
    transition: all 0.2s;
    color: black;
}

.grid-view .file-item {
    height: 120px;
    justify-content: center;
}

.list-view .file-item {
    flex-direction: row;
    text-align: left;
    align-items: center;
    gap: 1rem;
}

.file-item:hover {
    background: #f8f9fa;
}

.file-item.selected {
    background: #e3f2fd;
    border: 1px solid #2196f3;
}

.file-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.file-icon-image {
    width: 2rem;
    height: 2rem;
    object-fit: contain;
}

.list-view .file-icon {
    margin-bottom: 0;
    font-size: 1.5rem;
}

.list-view .file-icon-image {
    width: 1.5rem;
    height: 1.5rem;
}

.file-info {
    flex: 1;
    min-width: 0;
}

.file-name {
    font-weight: 500;
    word-break: break-word;
    margin-bottom: 0.25rem;
}

.file-details {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: #666;
}

.empty-folder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    color: #999;
    grid-column: 1 / -1;
}

.context-menu {
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    overflow: hidden;
}

.context-menu-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: background 0.2s;
}

.context-menu-item:hover {
    background: #f8f9fa;
}

.create-dialog {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 0 20px 20px;    
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.status-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    background: #f8f9fa;
    border-top: 1px solid #e9ecef;
    font-size: 0.875rem;
    color: #666;
}

.app-modal-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    pointer-events: none;
}

.app-modal-container > * {
    pointer-events: auto;
}
</style>
