import { apps as initialApps } from "@/data/appsDock";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { RESTAPI } from "../service/api.js";
import { useFileSystemStore } from "./useFileSystemStore";
import { useTrashStore } from "./useTrashStore";

const getGameIcon = async (gameName) => {
  try {
    const response = await RESTAPI.RecebeIconeJogo(gameName);
    return response.data.imageUrl;
  } catch (e) {
    console.log(e);
  }
};
export const useAppsStore = defineStore("apps", () => {
  const { t } = useI18n();
  const trashStore = useTrashStore();
  let fileSystemStore = null; // Lazy loading para evitar problemas de dependência circular

  const EMPTY_SLOT = { id: null };
  const apps = ref([]);

  function calculateTotalSlots() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const slotSize = 110;
    const columns = Math.floor(viewportWidth / slotSize);
    const rows = Math.floor((viewportHeight * 0.78) / slotSize);
    return columns * rows;
  }

  function updateSlots() {
    const totalSlots = calculateTotalSlots();
    const currentApps = apps.value.filter((app) => app.id !== null);
    apps.value = Array(totalSlots).fill(EMPTY_SLOT);

    currentApps.forEach((app, index) => {
      if (index < totalSlots) {
        apps.value[index] = app;
      }
    });

    if (currentApps.length === 0) {
      initialApps.forEach((app, index) => {
        if (index < totalSlots) {
          apps.value[index] = {
            ...app,
            id: Date.now() + Math.random(),
            title: t(`apps.${app.title}`),
          };
        }
      });
    }
  }

  // Inicializa os slots
  updateSlots();

  function addApp(newApp, forceAdd = false) {
    console.log("addApp called with:", newApp, "forceAdd:", forceAdd);
    const emptyIndex = apps.value.findIndex((slot) => slot.id === null);
    console.log("Empty slot index:", emptyIndex);

    if (emptyIndex === -1) {
      console.log("No empty slots available");
      if (!forceAdd) {
        return null;
      } else {
        // Se forceAdd for true, expandir os slots
        console.log("Force adding - expanding slots");
        updateSlots();
        // Tentar novamente após expansão
        const newEmptyIndex = apps.value.findIndex((slot) => slot.id === null);
        if (newEmptyIndex === -1) {
          console.log("Still no empty slots after expansion");
          return null;
        }
        // Usar o novo índice encontrado
        const finalEmptyIndex = newEmptyIndex;
        const appData = {
          ...newApp,
          id: Date.now() + Math.random(),
          title: newApp.title,
        };
        apps.value[finalEmptyIndex] = appData;
        return appData;
      }
    }

    if (!newApp.title) {
      const newName = t("newName");
      const appName = prompt(newName);
      newApp.title = appName;
    }

    const appData = {
      ...newApp,
      id: Date.now(),
      title: newApp.title,
    };

    apps.value[emptyIndex] = appData;

    // Se o app representa um arquivo do desktop, criar no sistema de arquivos
    if (newApp.createOnDesktop && !fileSystemStore) {
      fileSystemStore = useFileSystemStore();
    }

    if (newApp.createOnDesktop && fileSystemStore) {
      fileSystemStore.createFile(
        `${newApp.title}.app`,
        JSON.stringify({
          type: "application",
          component: newApp.component,
          icon: newApp.icon,
          title: newApp.title,
        }),
        "/home/amorim/Desktop"
      );
    }

    return appData;
  }

  function removeApp(app, fromFileSystem = false) {
    if (!app || app.id == null) return;

    const index = apps.value.findIndex((a) => a?.id === app.id);
    if (index !== -1) {
      apps.value[index] = EMPTY_SLOT;

      // Só adicionar à lixeira se:
      // 1. Não foi chamado pelo sistema de arquivos (pois já adicionou o arquivo)
      // 2. E o app não tem arquivo correspondente no desktop (evitar duplicação)
      if (!fromFileSystem && !app.desktopFile) {
        trashStore.addToTrash(app);
      }

      // Se o app tinha arquivo no desktop, remover também (apenas se não veio do sistema de arquivos)
      if (app.desktopFile && !fileSystemStore && !fromFileSystem) {
        fileSystemStore = useFileSystemStore();
      }

      if (app.desktopFile && fileSystemStore && !fromFileSystem) {
        fileSystemStore.removeItem(app.desktopFile, "/home/amorim/Desktop");
      }
    }
  }

  function restoreApp(app) {
    addApp(app);
    trashStore.removeFromTrash(app);
  }

  async function loadIcons() {
    const doomIcon = await getGameIcon("Doom");
    this.apps = this.apps.map((app) =>
      app.name === "DoomModal" ? { ...app, icon: doomIcon } : app
    );
  }

  function isEmptySlot(app) {
    return !app || app.id === null;
  }

  function syncWithFileSystem() {
    if (!fileSystemStore) {
      fileSystemStore = useFileSystemStore();
    }

    // Primeiro, sincronizar apps existentes para o sistema de arquivos
    syncAppsToFileSystem();

    // Escutar mudanças no desktop
    const unsubscribe = fileSystemStore.onFileSystemChange((event) => {
      if (
        event.path.startsWith("/home/amorim/Desktop") &&
        event.path.endsWith(".app")
      ) {
        const fileName = event.path.split("/").pop();
        const appName = fileName.replace(".app", "");

        if (event.operation === "create") {
          // Criar app baseado no arquivo (apenas se não foi criado por nós)
          const existingApp = apps.value.find(
            (a) => a.desktopFile === fileName
          );
          console.log(
            "Create event for .app file:",
            fileName,
            "existing app:",
            !!existingApp
          );
          if (!existingApp) {
            // Tentar diferentes abordagens para ler o conteúdo
            let fileContent = fileSystemStore.readFile(event.path);
            console.log(
              "Reading file content:",
              event.path,
              "success:",
              fileContent?.success
            );

            // Se readFile falhou, tentar acessar diretamente através do getItemAtPath
            if (!fileContent?.success) {
              console.log("Direct readFile failed, trying getItemAtPath...");
              const item = fileSystemStore.getItemAtPath(event.path);
              console.log("getItemAtPath result:", item);
              console.log("item.content:", item?.content);
              console.log(
                "item properties:",
                item ? Object.keys(item) : "no item"
              );

              if (item && item.content) {
                fileContent = {
                  success: true,
                  content: item.content,
                };
                console.log("Got content from getItemAtPath:", item.content);
              }
            }

            if (fileContent?.success && fileContent.content) {
              console.log("File content:", fileContent.content);
              try {
                const appData = JSON.parse(fileContent.content);
                console.log("Creating app from file:", appData);
                const newApp = addApp(
                  {
                    ...appData,
                    desktopFile: fileName,
                  },
                  true
                ); // Forçar adição para restauração
                console.log("App added successfully:", newApp);
              } catch (error) {
                console.error("Error parsing app file:", error);
              }
            } else {
              console.error(
                "Failed to read file content:",
                fileContent?.error || "No content available"
              );

              // Como último recurso, usar um timeout para tentar novamente
              setTimeout(() => {
                console.log("Retrying file read after timeout...");
                const retryContent = fileSystemStore.readFile(event.path);
                console.log("Retry readFile result:", retryContent);
                if (retryContent?.success) {
                  try {
                    const appData = JSON.parse(retryContent.content);
                    console.log(
                      "Retry successful, creating app from file:",
                      appData
                    );
                    addApp(
                      {
                        ...appData,
                        desktopFile: fileName,
                      },
                      true
                    );
                  } catch (error) {
                    console.error("Error parsing app file on retry:", error);
                  }
                } else {
                  console.log(
                    "Retry also failed, trying direct item access..."
                  );
                  const item = fileSystemStore.getItemAtPath(event.path);
                  if (item && item.content) {
                    try {
                      const appData = JSON.parse(item.content);
                      console.log(
                        "Direct access successful, creating app:",
                        appData
                      );
                      addApp(
                        {
                          ...appData,
                          desktopFile: fileName,
                        },
                        true
                      );
                    } catch (error) {
                      console.error(
                        "Error parsing app from direct access:",
                        error
                      );
                    }
                  } else {
                    console.log("All methods failed to get file content");
                  }
                }
              }, 100);
            }
          }
        } else if (event.operation === "delete") {
          // Remover app correspondente
          const app = apps.value.find((a) => a.desktopFile === fileName);
          if (app) {
            removeApp(app, true); // true indica que veio do sistema de arquivos
          }
        }
      }
    });

    return unsubscribe;
  }

  function syncAppsToFileSystem() {
    if (!fileSystemStore) {
      fileSystemStore = useFileSystemStore();
    }

    // Garantir que o diretório Desktop existe
    fileSystemStore.createDirectory("Desktop", "/home/amorim");

    // Sincronizar cada app existente para o sistema de arquivos
    apps.value.forEach((app) => {
      if (app.id !== null && !app.desktopFile) {
        const fileName = `${app.title.replace(/[^a-zA-Z0-9]/g, "_")}.app`;
        const appData = {
          type: "application",
          title: app.title,
          name: app.name,
          icon: app.icon,
          component: app.name,
          locked: app.locked || false,
          colSpan: app.colSpan || 1,
          rowSpan: app.rowSpan || 1,
        };

        const result = fileSystemStore.createFile(
          fileName,
          JSON.stringify(appData, null, 2),
          "/home/amorim/Desktop"
        );

        if (result.success) {
          app.desktopFile = fileName;
        }
      }
    });
  }

  return {
    apps,
    addApp,
    removeApp,
    restoreApp,
    updateSlots,
    loadIcons,
    isEmptySlot,
    syncWithFileSystem,
    syncAppsToFileSystem,
  };
});
