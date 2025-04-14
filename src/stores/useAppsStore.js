import { apps as initialApps } from "@/data/appsDock";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useTrashStore } from "./useTrashStore";

export const useAppsStore = defineStore("apps", () => {
  const { t } = useI18n();
  const trashStore = useTrashStore();
  const apps = ref(
    initialApps.map((app) => ({
      ...app,
      id: Date.now() + Math.random(),
      title: t(`${app.title}`),
    }))
  );

  function addApp(newApp) {
    apps.value.push({
      ...newApp,
      id: Date.now(),
      title: t(`${newApp.title}`),
    });
  }

  function removeApp(app) {
    apps.value = apps.value.filter((a) => a.id !== app.id);
    trashStore.addToTrash(app);
  }

  function restoreApp(app) {
    addApp(app);
    trashStore.removeFromTrash(app);
  }

  return {
    apps,
    addApp,
    removeApp,
    restoreApp,
  };
});
