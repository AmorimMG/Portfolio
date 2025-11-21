<script setup>
import { useFileSystemStore } from "@/stores/useFileSystemStore";
import { computed, onMounted, onUnmounted, ref } from "vue";
import FileManager from "./FileManager.vue";
import Trash from "./Trash.vue";

const props = defineProps({
  initialView: {
    type: String,
    default: "desktop",
  },
});

const fileSystemStore = useFileSystemStore();
const selectedItem = ref(null);
const currentComponent = ref(null);
const sidebarVisible = ref(false);

const emit = defineEmits(["select"]);

// Estrutura de favoritos e dispositivos baseada na store real
const deviceItems = computed(() => [
  {
    name: "Computer",
    type: "directory",
    icon: "💻",
    path: "/",
    isDevice: true,
  },
  {
    name: "Home",
    type: "directory",
    icon: "🏠",
    path: "/home/amorim",
    isDevice: true,
  },
]);

const favoriteItems = computed(() => [
  {
    name: "Desktop",
    type: "directory",
    icon: "🖥️",
    path: "/home/amorim/Desktop",
  },
  {
    name: "Documents",
    type: "directory",
    icon: "📄",
    path: "/home/amorim/Documents",
  },
  {
    name: "Downloads",
    type: "directory",
    icon: "⬇️",
    path: "/home/amorim/Downloads",
  },
  {
    name: "Pictures",
    type: "directory",
    icon: "🖼️",
    path: "/home/amorim/Pictures",
  },
  {
    name: "Music",
    type: "directory",
    icon: "🎵",
    path: "/home/amorim/Music",
  },
  {
    name: "Videos",
    type: "directory",
    icon: "🎬",
    path: "/home/amorim/Videos",
  },
]);

const systemItems = computed(() => [
  {
    name: "Trash",
    type: "directory",
    icon: "🗑️",
    path: "/system/trash",
    component: Trash,
    isSystem: true,
  },
]);

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value;
};

const closeSidebar = () => {
  sidebarVisible.value = false;
};

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

  // Fechar sidebar em mobile após seleção
  if (window.innerWidth <= 768) {
    closeSidebar();
  }

  emit("select", item);
};

// Escutar mudanças no sistema de arquivos
const unsubscribe = fileSystemStore.onFileSystemChange((event) => {
  // Reativo automaticamente devido aos computeds
  console.log("File system updated in sidebar:", event);
});

onMounted(() => {
  // Selecionar item baseado no initialView
  let itemToSelect = null;

  if (props.initialView === "trash") {
    itemToSelect = systemItems.value.find((item) => item.name === "Trash");
  } else {
    // Selecionar Desktop por padrão
    itemToSelect = favoriteItems.value.find((item) => item.name === "Desktop");
  }

  if (itemToSelect) {
    handleItemClick(itemToSelect);
  }
});

onUnmounted(() => {
  unsubscribe();
});
</script>

<template>
  <div class="file-manager">
    <!-- Overlay para mobile -->
    <div 
      v-if="sidebarVisible" 
      class="sidebar-overlay"
      @click="closeSidebar"
    ></div>

    <!-- Sidebar -->
    <div class="sidebar" :class="{ 'sidebar-visible': sidebarVisible }">
      <div class="sidebar-header">
        <h2>File System</h2>
        <Button 
          icon="pi pi-times" 
          @click="closeSidebar"
          class="sidebar-close-btn"
          size="small"
          text
        />
      </div>

      <div class="section">
        <h3>🖥️ Devices</h3>
        <ul>
          <li
            v-for="item in deviceItems"
            :key="item.path"
            @click="handleItemClick(item)"
            :class="{ active: selectedItem?.path === item.path }"
          >
            {{ item.icon }} {{ item.name }}
          </li>
        </ul>
      </div>

      <div class="section">
        <h3>⭐ Favorites</h3>
        <ul>
          <li
            v-for="item in favoriteItems"
            :key="item.path"
            @click="handleItemClick(item)"
            :class="{ active: selectedItem?.path === item.path }"
          >
            {{ item.icon }} {{ item.name }}
          </li>
        </ul>
      </div>

      <div class="section">
        <h3>🔧 System</h3>
        <ul>
          <li
            v-for="item in systemItems"
            :key="item.path"
            @click="handleItemClick(item)"
            :class="{ active: selectedItem?.path === item.path }"
          >
            {{ item.icon }} {{ item.name }}
          </li>
        </ul>
      </div>
    </div>
    
    <div class="main-content w-full">
      <component 
        v-if="currentComponent" 
        :is="currentComponent" 
        :sidebar-toggle="toggleSidebar"
      />
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
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
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

/* Sidebar header (hidden on desktop) */
.sidebar-header {
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: 15px 10px 10px 10px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 10px;
}

.sidebar-header h2 {
  font-size: 16px;
  margin: 0;
  color: #333;
}

.sidebar-close-btn {
  color: #666;
}

/* Overlay (hidden on desktop) */
.sidebar-overlay {
  display: none;
}

/* Responsive Styles for Mobile */
@media (max-width: 768px) {
  .file-manager {
    position: relative;
  }

  /* Show sidebar header */
  .sidebar-header {
    display: flex;
  }

  /* Sidebar as overlay */
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    height: 100%;
    z-index: 1002;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
  }

  .sidebar.sidebar-visible {
    transform: translateX(0);
  }

  /* Overlay */
  .sidebar-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1001;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .main-content {
    width: 100%;
  }

  .section li {
    padding: 8px 10px;
    font-size: 14px;
  }

  .section h3 {
    font-size: 11px;
    padding-left: 5px;
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 240px;
  }

  .sidebar-header h2 {
    font-size: 14px;
  }

  .section li {
    padding: 7px 10px;
    font-size: 13px;
  }

  .section h3 {
    font-size: 10px;
  }
}

/* Scrollbar styling */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>
