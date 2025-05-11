<script setup lang="ts">
import { ref } from 'vue'
import Trash from './Trash.vue'

interface FileItem {
    name: string
    type: 'file' | 'directory'
    icon: string
    path: string
    children?: FileItem[]
    component?: any
}

const currentPath = ref('')
const selectedItem = ref<FileItem | null>(null)
const currentComponent = ref<any>(null)

const emit = defineEmits(['select'])

const handleItemClick = (item: FileItem) => {
    selectedItem.value = item
    currentPath.value = item.path
    currentComponent.value = item.component || null
    emit('select', item)
}

// Add more file system items
const fileSystem = ref<FileItem[]>([
    {
        name: 'System',
        type: 'directory',
        icon: '💻',
        path: '/system',
        children: [
            {
                name: 'Config',
                type: 'file',
                icon: '⚙️',
                path: '/system/config'
            },
            {
                name: 'Settings',
                type: 'file',
                icon: '🔧',
                path: '/system/settings'
            }
        ]
    },
    {
        name: 'Documents',
        type: 'directory',
        icon: '📄',
        path: '/documents',
        children: [
            {
                name: 'Projects',
                type: 'directory',
                icon: '📁',
                path: '/documents/projects'
            },
            {
                name: 'Resume.pdf',
                type: 'file',
                icon: '📄',
                path: '/documents/resume.pdf'
            }
        ]
    },
    {
        name: 'Trash',
        type: 'directory',
        icon: '🗑️',
        path: '/system/trash',
        component: Trash
    }
])
</script>

<template>
    <div class="file-manager">
        <div class="sidebar">
            <div class="section">
                <h3>🖥️ Devices</h3>
                <ul>
                    <li v-for="item in fileSystem" :key="item.path" @click="handleItemClick(item)"
                        :class="{ active: selectedItem?.path === item.path }">
                        {{ item.icon }} {{ item.name }}
                        <ul v-if="item.children && selectedItem?.path === item.path">
                            <li v-for="child in item.children" :key="child.path" @click.stop="handleItemClick(child)"
                                :class="{ active: selectedItem?.path === child.path }">
                                {{ child.icon }} {{ child.name }}
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="section">
                <h3>⭐ Favorites</h3>
                <ul>
                    <li>📦 Applications</li>
                    <li>🖥️ Desktop</li>
                    <li>📄 Documents</li>
                    <li>⬇️ Downloads</li>
                    <li>🖼️ Pictures</li>
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
    overflow-y: auto;
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
