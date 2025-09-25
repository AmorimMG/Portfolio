<script setup>
import { useFileSystemStore } from '@/stores/useFileSystemStore';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import FileManager from './FileManager.vue';
import Trash from './Trash.vue';

const fileSystemStore = useFileSystemStore();
const selectedItem = ref(null);
const currentComponent = ref(null);

const emit = defineEmits(['select']);

// Estrutura de favoritos e dispositivos baseada na store real
const deviceItems = computed(() => [
    {
        name: 'Computer',
        type: 'directory',
        icon: '💻',
        path: '/',
        isDevice: true
    },
    {
        name: 'Home',
        type: 'directory', 
        icon: '🏠',
        path: '/home/amorim',
        isDevice: true
    }
]);

const favoriteItems = computed(() => [
    {
        name: 'Desktop',
        type: 'directory',
        icon: '🖥️',
        path: '/home/amorim/Desktop'
    },
    {
        name: 'Documents',
        type: 'directory',
        icon: '📄',
        path: '/home/amorim/Documents'
    },
    {
        name: 'Downloads',
        type: 'directory',
        icon: '⬇️',
        path: '/home/amorim/Downloads'
    },
    {
        name: 'Pictures',
        type: 'directory',
        icon: '�️',
        path: '/home/amorim/Pictures'
    },
    {
        name: 'Music',
        type: 'directory',
        icon: '🎵',
        path: '/home/amorim/Music'
    },
    {
        name: 'Videos',
        type: 'directory',
        icon: '🎬',
        path: '/home/amorim/Videos'
    }
]);

const systemItems = computed(() => [
    {
        name: 'Trash',
        type: 'directory',
        icon: '�️',
        path: '/system/trash',
        component: Trash,
        isSystem: true
    }
]);

const handleItemClick = (item) => {
    selectedItem.value = item;
    
    if (item.component) {
        currentComponent.value = item.component;
    } else if (item.isSystem) {
        // Para itens do sistema, usar componente específico
        currentComponent.value = item.component || null;
    } else {
        // Para itens do sistema de arquivos, navegar na store e usar FileManager
        fileSystemStore.changeDirectory(item.path);
        currentComponent.value = FileManager;
    }
    
    emit('select', item);
};

// Escutar mudanças no sistema de arquivos
const unsubscribe = fileSystemStore.onFileSystemChange((event) => {
    // Reativo automaticamente devido aos computeds
    console.log('File system updated in sidebar:', event);
});

onMounted(() => {
    // Selecionar Desktop por padrão
    const desktop = favoriteItems.value.find(item => item.name === 'Desktop');
    if (desktop) {
        handleItemClick(desktop);
    }
});

onUnmounted(() => {
    unsubscribe();
});
</script>

<template>
    <div class="file-manager">
        <div class="sidebar">
            <div class="section">
                <h3>🖥️ Devices</h3>
                <ul>
                    <li v-for="item in deviceItems" :key="item.path" @click="handleItemClick(item)"
                        :class="{ active: selectedItem?.path === item.path }">
                        {{ item.icon }} {{ item.name }}
                    </li>
                </ul>
            </div>
            
            <div class="section">
                <h3>⭐ Favorites</h3>
                <ul>
                    <li v-for="item in favoriteItems" :key="item.path" @click="handleItemClick(item)"
                        :class="{ active: selectedItem?.path === item.path }">
                        {{ item.icon }} {{ item.name }}
                    </li>
                </ul>
            </div>
            
            <div class="section">
                <h3>🔧 System</h3>
                <ul>
                    <li v-for="item in systemItems" :key="item.path" @click="handleItemClick(item)"
                        :class="{ active: selectedItem?.path === item.path }">
                        {{ item.icon }} {{ item.name }}
                    </li>
                </ul>
            </div>
        </div>
        <div class="main-content w-full">
            <component v-if="currentComponent" :is="currentComponent" />
            <slot v-else />
        </div>
    </div>
</template>

<style scoped>
li {
    color: black;
}

.main-content {
    background-color: white;
}

.file-manager {
    display: flex;
    height: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

.sidebar {
    width: 250px;
    height: 100%;
    background-color: #f5f5f5;
    border-right: 1px solid #e0e0e0;
    overflow-y: auto;
    padding: 20px 10px;
}

.section {
    margin-bottom: 20px;
}

.section h3 {
    font-size: 12px;
    color: #888;
    margin-bottom: 5px;
}

.section ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.section li {
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 5px;
}

.section li:hover {
    background-color: #e0e0e0;
}

.active {
    background-color: #e0e0e0;
}

.current-path {
    padding: 10px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
    font-size: 14px;
    color: #666;
}

.section li ul {
    margin-left: 20px;
    margin-top: 5px;
}
</style>
