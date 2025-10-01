<script>
import { useAppsStore } from "@/stores/useAppsStore";
import { useFileSystemStore } from "@/stores/useFileSystemStore";
import { useTrashStore } from "@/stores/useTrashStore";

import SelectableDraggableGrid from "./SelectableDraggableGrid.vue";

import { computed, onMounted, onUnmounted, ref } from "vue";
import { componentMap } from "../data/appsDock";

import ContextMenu from "primevue/contextmenu";
import { useI18n } from "vue-i18n";
import { getUserCookie } from "../service/session.js";
import LoginToast from "./LoginToast.vue";

export default {
  components: {
    SelectableDraggableGrid,
    LoginToast,
    ContextMenu,
    ...componentMap,
  },
  emits: ["open-file-manager"],
  setup() {
    const { t } = useI18n();
    const appsStore = useAppsStore();
    const trashStore = useTrashStore();
    const fileSystemStore = useFileSystemStore();
    const contextMenuRef = ref(null);
    const loginToastRef = ref(null);
    const userLoggedIn = ref(!!getUserCookie());

    const checkLoginStatus = () => {
      userLoggedIn.value = !!getUserCookie();
    };

    const canAccessApp = (app) => {
      if (!app.locked) return true;
      const userSession = getUserCookie();
      return !!userSession && userLoggedIn.value;
    };

    // Computed para integrar apps da store com todos os arquivos do desktop
    const desktopApps = computed(() => {
      const desktop = fileSystemStore.getItemAtPath("/home/amorim/Desktop");
      const desktopFiles = desktop.success ? desktop.item.contents || {} : {};

      // Pegar apps tradicionais da store
      const storeApps = appsStore.apps.filter((app) => app.id !== null);

      // Função para obter ícone baseado no tipo de arquivo
      const getFileIcon = (name, file) => {
        const ext = name.split(".").pop()?.toLowerCase();
        const iconMap = {
          txt: "📄",
          md: "📝",
          js: "📜",
          json: "📋",
          pdf: "📕",
          jpg: "🖼️",
          jpeg: "🖼️",
          png: "🖼️",
          gif: "🖼️",
          mp3: "🎵",
          mp4: "🎬",
          zip: "📦",
          dir: "📁",
        };

        if (file.type === "dir") return "📁";
        return iconMap[ext] || "📄";
      };

      // Pegar todos os arquivos e pastas do desktop
      const desktopItems = Object.entries(desktopFiles)
        .map(([name, file]) => {
          // Se for um arquivo .app, verificar se já não está representado na store
          if (name.endsWith(".app") && file.type === "file") {
            // Verificar se já existe um app da store para este arquivo
            const existingStoreApp = storeApps.find(
              (app) => app.desktopFile === name
            );
            if (existingStoreApp) {
              // Já existe na store, não criar duplicata
              return null;
            }

            try {
              const appData = JSON.parse(file.content || "{}");
              return {
                id: `desktop-app-${name}`,
                title: appData.title || name.replace(".app", ""),
                icon: appData.icon || "/favicon.ico",
                name: appData.component || "DefaultApp",
                locked: appData.locked || false,
                colSpan: appData.colSpan || 1,
                rowSpan: appData.rowSpan || 1,
                isDesktopFile: true,
                isApp: true,
                filePath: `/home/amorim/Desktop/${name}`,
                fileType: "app",
              };
            } catch (error) {
              console.error("Error parsing app file:", name, error);
              return null;
            }
          } else {
            // Arquivo ou pasta comum
            return {
              id: `desktop-file-${name}`,
              title: name,
              icon: getFileIcon(name, file),
              name: "FileItem", // Componente genérico para arquivos
              locked: false,
              colSpan: 1,
              rowSpan: 1,
              isDesktopFile: true,
              isApp: false,
              filePath: `/home/amorim/Desktop/${name}`,
              fileType: file.type,
              originalFile: file,
            };
          }
        })
        .filter((item) => item !== null);

      // Combinar apps tradicionais com itens do desktop
      return [...storeApps, ...desktopItems];
    });

    onMounted(() => {
      appsStore.loadIcons();
      appsStore.updateSlots();

      // Sincronizar apps com o sistema de arquivos
      appsStore.syncWithFileSystem();

      window.addEventListener("resize", () => appsStore.updateSlots());

      const loginCheckInterval = setInterval(checkLoginStatus, 1000);

      const interceptAppEvents = (event) => {
        if (event.type === "appOpen" && event.detail?.app) {
          const app = event.detail.app;
          if (!canAccessApp(app)) {
            event.preventDefault();
            event.stopPropagation();
            console.warn("Acesso negado via evento customizado:", app.name);
            return false;
          }
        }
      };

      document.addEventListener("appOpen", interceptAppEvents, true);

      // Escutar mudanças no sistema de arquivos do desktop
      const unsubscribeFileSystem = fileSystemStore.onFileSystemChange(
        (event) => {
          if (event.path.startsWith("/home/amorim/Desktop")) {
            console.log("Desktop file system changed:", event);
            // O computed desktopApps será automaticamente atualizado
          }
        }
      );

      onUnmounted(() => {
        window.removeEventListener("resize", () => appsStore.updateSlots());
        document.removeEventListener("appOpen", interceptAppEvents, true);
        clearInterval(loginCheckInterval);
        unsubscribeFileSystem?.();
      });
    });

    return {
      appsStore,
      trashStore,
      fileSystemStore,
      contextMenuRef,
      loginToastRef,
      userLoggedIn,
      canAccessApp,
      desktopApps,
    };
  },
  data() {
    return {
      contextApp: null,
      trash: [],
      pendingLockedApp: null,
      selectedApps: [],
      contextItems: [],
    };
  },

  computed: {
    filledGrid: {
      get() {
        // Usar os apps da store (que já inclui a lógica de slots vazios)
        return this.appsStore.apps;
      },
      set(val) {
        // Atualizar apenas apps da store tradicionais (não arquivos do desktop)
        const storeApps = val.filter(
          (app) => app.id !== null && !app.isDesktopFile
        );
        this.appsStore.apps = val;
      },
    },
    getComponent() {
      return (name) => componentMap[name] || "div";
    },
    isUserLoggedIn() {
      return this.userLoggedIn;
    },
    // Computed para o menu de contexto baseado na seleção
    dynamicContextItems() {
      if (this.selectedApps.length > 1) {
        // Múltiplos itens selecionados - apenas remover
        return [
          {
            label: `Remover ${this.selectedApps.length} itens`,
            icon: "pi pi-trash",
            command: () => this.removeMultipleApps(this.selectedApps),
          },
        ];
      } else {
        // Um item selecionado - renomear e remover
        return [
          {
            label: "Renomear",
            icon: "pi pi-pencil",
            command: () => this.renameApp(this.contextApp),
          },
          {
            label: "Remover",
            icon: "pi pi-trash",
            command: () => {
              if (this.contextApp) this.removeApp(this.contextApp);
            },
          },
        ];
      }
    },
  },
  watch: {
    "appsStore.apps": {
      handler(newApps) {
        // Atualiza a grid quando a store muda
        this.$nextTick(() => {
          this.refreshGrid();
        });
      },
      deep: true,
      immediate: false,
    },
  },
  methods: {
    onContextMenu(event, app) {
      event.preventDefault();
      this.contextApp = app;
      // Atualiza o menu de contexto baseado na seleção atual
      this.contextItems = this.dynamicContextItems;
      this.$refs.contextMenuRef.show(event);
    },
    renameApp(app) {
      if (!app) return;
      const newName = prompt("Novo nome:", app.title);
      if (newName && newName !== app.title) {
        if (app.isDesktopFile) {
          if (app.isApp) {
            // Renomear arquivo .app do desktop
            const oldPath = app.filePath;
            const newPath = oldPath.replace(/\/[^/]+\.app$/, `/${newName}.app`);

            // Ler conteúdo atual
            const fileContent = this.fileSystemStore.readFile(oldPath);
            if (fileContent.success) {
              try {
                const appData = JSON.parse(fileContent.content);
                appData.title = newName;

                // Criar novo arquivo com nome atualizado
                this.fileSystemStore.createFile(
                  newPath.split("/").pop(),
                  JSON.stringify(appData, null, 2),
                  "/home/amorim/Desktop"
                );
                // Remover arquivo antigo
                this.fileSystemStore.removeItem(
                  oldPath.split("/").pop(),
                  "/home/amorim/Desktop"
                );
              } catch (error) {
                console.error("Error updating app file:", error);
              }
            }
          } else {
            // Renomear arquivo/pasta comum do desktop
            const oldFileName = app.filePath.split("/").pop();
            const fileContent = this.fileSystemStore.readFile(app.filePath);

            if (app.fileType === "dir") {
              // Renomear diretório
              const dirContents = this.fileSystemStore.getItemAtPath(
                app.filePath
              );
              if (dirContents && dirContents.contents) {
                this.fileSystemStore.createDirectory(
                  newName,
                  "/home/amorim/Desktop"
                );
                // Copiar conteúdo se necessário (implementação simplificada)
                this.fileSystemStore.removeItem(
                  oldFileName,
                  "/home/amorim/Desktop"
                );
              }
            } else {
              // Renomear arquivo
              if (fileContent.success) {
                this.fileSystemStore.createFile(
                  newName,
                  fileContent.content,
                  "/home/amorim/Desktop"
                );
                this.fileSystemStore.removeItem(
                  oldFileName,
                  "/home/amorim/Desktop"
                );
              }
            }
          }
        } else {
          // App tradicional da store
          app.title = newName;
        }
      }
    },
    restoreApp(app) {
      if (!app) return;
      this.appsStore.restoreApp(app);
      this.trashStore.trash = this.trash.filter((a) => a && a.id !== app.id);
    },
    deleteApp(app) {
      if (!app) return;
      this.trash = this.trash.filter((a) => a && a.id !== app.id);
    },
    onSelectionChange({ selectedIds, selectedItems }) {
      // Atualiza a lista de apps selecionados para o menu de contexto
      this.selectedApps = selectedItems;
    },
    onItemsUpdated(newItems) {
      console.log("📝 AppsGrid: Updating store with new items");
      this.appsStore.apps = newItems;
      // Força atualização dos slots se necessário
      // TEMPORARIAMENTE COMENTADO PARA TESTE
      // this.$nextTick(() => {
      //     this.appsStore.updateSlots();
      // });
    },
    onItemClick({ event, item: app, index }) {
      // Clique simples agora apenas seleciona o item
      // A abertura será feita apenas no duplo clique
    },

    onItemDoubleClick({ event, item: app, index }) {
      // Duplo clique - abre o item
      // Se for um arquivo/pasta comum do desktop, emitir evento para abrir no FileManager
      if (app.isDesktopFile && !app.isApp) {
        this.openDesktopFile(app);
        return;
      }

      // Para apps, verificar permissões
      if (!this.canAccessApp(app)) {
        this.pendingLockedApp = app;
        this.$refs.loginToastRef.show();
        return;
      }

      this.openAppNormally(app);
    },

    openAppNormally(app) {
      if (!this.canAccessApp(app)) {
        console.warn("Tentativa de acesso negada:", app.name);
        return;
      }

      const currentUserSession = getUserCookie();
      if (app.locked && (!currentUserSession || !this.isUserLoggedIn)) {
        console.warn("Sessão inválida detectada:", app.name);
        this.userLoggedIn = false; // Reset do estado
        return;
      }

      this.$nextTick(() => {
        const appElement = document.querySelector(`[data-id="${app.id}"]`);
        if (appElement) {
          // Tenta encontrar o container do app dentro da grid
          const appContainer = appElement.querySelector(".app-container");
          if (appContainer) {
            const appCard = appContainer.querySelector(".app-card");
            if (appCard) {
              const button = appCard.querySelector("button");
              if (button) {
                if (app.locked && !this.canAccessApp(app)) {
                  console.warn("Bloqueio final ativado:", app.name);
                  return;
                }
                button.click();
                return;
              }
            }
          }

          // Se não encontrou a estrutura esperada, despacha evento customizado
          const event = new CustomEvent("appOpen", { detail: { app } });
          appElement.dispatchEvent(event);
        }
      });
    },

    openDesktopFile(fileItem) {
      // Emitir evento para que o componente pai (AppLayout) possa abrir o FileManager
      // navegando para o Desktop e selecionando o arquivo
      this.$emit("open-file-manager", {
        path: "/home/amorim/Desktop",
        selectedFile: fileItem.title,
        fileType: fileItem.fileType,
      });
    },

    onLoginSuccess() {
      this.userLoggedIn = true;
      if (this.pendingLockedApp) {
        console.log("App unlocked:", this.pendingLockedApp.name);
        this.openAppNormally(this.pendingLockedApp);
        this.pendingLockedApp = null;
      }
    },

    removeApp(app) {
      if (!app) return;

      if (app.isDesktopFile) {
        // Remover arquivo/pasta do desktop
        const fileName = app.filePath.split("/").pop();
        this.fileSystemStore.removeItem(fileName, "/home/amorim/Desktop");
      } else {
        // App tradicional da store
        this.appsStore.removeApp(app);
      }
    },

    removeMultipleApps(apps) {
      if (!apps || apps.length === 0) return;

      // Confirmar remoção múltipla
      const confirmed = confirm(
        `Tem certeza que deseja remover ${apps.length} ${apps.length === 1 ? "item" : "itens"}?`
      );
      if (!confirmed) return;

      // Remover cada app
      apps.forEach((app) => {
        if (app.isDesktopFile) {
          // Remover arquivo/pasta do desktop
          const fileName = app.filePath.split("/").pop();
          this.fileSystemStore.removeItem(fileName, "/home/amorim/Desktop");
        } else {
          // App tradicional da store
          this.appsStore.removeApp(app);
        }
      });

      // Limpar seleção após remoção
      if (this.$refs.selectableDraggableGrid) {
        this.$refs.selectableDraggableGrid.clearSelection();
      }
    },

    refreshGrid() {
      // Método para forçar atualização da grid
      if (this.$refs.selectableDraggableGrid) {
        this.$refs.selectableDraggableGrid.refreshList();
      }
    },

    range(to, offset = 0) {
      return new Array(to).fill(0).map((_, i) => offset + i);
    },

    calculateTotalSlots() {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const slotSize = 110;
      const columns = Math.floor(viewportWidth / slotSize);
      const rows = Math.floor((viewportHeight * 0.78) / slotSize);
      return columns * rows;
    },

    handleResize() {
      this.appsStore.updateSlots();
    },
  },
};
</script>

<template>
  <div class="container">
    <SelectableDraggableGrid
      ref="selectableDraggableGrid"
      v-model="filledGrid"
      item-key="id"
      selectable-class="selectable"
      :multi-select="true"
      :drag-enabled="true"
      @selection-change="onSelectionChange"
      @item-click="onItemClick"
      @item-double-click="onItemDoubleClick"
      @contextmenu="onContextMenu"
      @update:model-value="onItemsUpdated"
    >
      <template #item="{ element, selected }">
        <div
          v-if="element && element.id !== null"
          class="app-container"
          :class="{
            selected: selected,
            'locked-app': element.locked && !isUserLoggedIn,
          }"
        >
          <component
            class="app-card"
            :is="getComponent(element.name)"
            :style="{
              'grid-column': 'span ' + element.colSpan,
              'grid-row': 'span ' + element.rowSpan,
              'pointer-events':
                element.locked && !isUserLoggedIn ? 'none' : 'auto',
            }"
            @click.stop.prevent="
              element.locked && !isUserLoggedIn ? null : null
            "
          />

          <div
            v-if="element.locked && !isUserLoggedIn"
            class="security-overlay"
          ></div>

          <div
            class="app-icon-wrapper"
            :title="
              element.locked
                ? isUserLoggedIn
                  ? 'App desbloqueado - Duplo clique para abrir'
                  : 'App bloqueado - Duplo clique para fazer login'
                : element.isDesktopFile && !element.isApp
                  ? `${element.fileType === 'dir' ? 'Pasta' : 'Arquivo'}: ${element.title} - Duplo clique para abrir`
                  : `${element.title} - Duplo clique para abrir`
            "
          >
            <div class="app-icon-container">
              <!-- Para arquivos que têm URL de imagem -->
              <img
                v-if="
                  element.icon &&
                  (element.icon.startsWith('http') ||
                    element.icon.startsWith('/') ||
                    element.icon.startsWith('data:') ||
                    (element.icon.includes('.') &&
                      !element.icon.match(/^[\u{1F000}-\u{1F9FF}]/u)))
                "
                loading="lazy"
                :src="element.icon"
                width="50px"
                height="50px"
                style="height: 50px"
                draggable="false"
              />
              <!-- Para arquivos com ícone emoji/unicode -->
              <span v-else class="file-icon-emoji" style="font-size: 50px">{{
                element.icon
              }}</span>

              <div
                v-if="element.locked"
                class="lock-overlay"
                :class="{ unlocked: isUserLoggedIn }"
              >
                <i
                  class="lock-icon pi"
                  :class="isUserLoggedIn ? 'pi-unlock' : 'pi-lock'"
                ></i>
              </div>
            </div>
            <div class="app-title">{{ element.title }}</div>
          </div>
        </div>
      </template>
    </SelectableDraggableGrid>

    <ContextMenu ref="contextMenuRef" :model="dynamicContextItems" />
    <LoginToast ref="loginToastRef" @login-success="onLoginSuccess" />
  </div>
</template>

<style>
/* Estilos removidos - agora controlados pelo SelectableDraggableGrid */

.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  transition: background-color 0.3s ease;
  width: 100px;
  height: 100px;
  cursor: pointer;
}

/* Hover agora é controlado pelo SelectableDraggableGrid */

.app-title {
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.app-card {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  opacity: 0;
}

.app-icon-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: -80px;
}

.app-icon-container {
  position: relative;
  display: inline-block;
}

.lock-overlay {
  position: absolute;
  top: -5px;
  right: -5px;
  background: linear-gradient(135deg, #ff6b6b, #ff8787);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ffffff;
  animation: pulse 2s infinite;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.lock-overlay.unlocked {
  background: linear-gradient(135deg, #51cf66, #69db7c);
  animation: none;
}

.lock-icon {
  color: #ffffff;
  font-size: 10px;
  font-weight: bold;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.app-container .app-icon-container img {
  transition: all 0.3s ease;
}

.app-container:has(.lock-overlay:not(.unlocked)) {
  opacity: 0.7;
  filter: grayscale(0.3);
}

.app-container:has(.lock-overlay:not(.unlocked)):hover {
  opacity: 0.9;
  filter: grayscale(0.1);
  transform: scale(1.05);
}

.app-container:has(.lock-overlay:not(.unlocked)) .app-title {
  opacity: 0.8;
}

.app-container:has(.lock-overlay.unlocked) {
  opacity: 1;
  filter: none;
}

.app-container:has(.lock-overlay.unlocked):hover {
  transform: scale(1.02);
}

.security-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  cursor: pointer;
  background: transparent;
}

.locked-app {
  position: relative;
}

.locked-app .app-card {
  pointer-events: none !important;
  user-select: none !important;
}

.locked-app .app-card * {
  pointer-events: none !important;
  user-select: none !important;
}

.locked-app .app-card::before,
.locked-app .app-card::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  pointer-events: none;
}

.file-icon-emoji {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  line-height: 1;
}

.container {
  padding: 0.5rem;
  width: 100vw;
  height: 100vh;
  border-radius: 0.5rem;
  user-select: none;
  max-width: none;
}

/* Seleção agora é controlada pelo SelectableDraggableGrid */

@media (max-width: 991px) {
  .container {
    padding: 0;
  }

  .app-icon-wrapper > img {
    width: 50px !important;
  }
}
</style>
