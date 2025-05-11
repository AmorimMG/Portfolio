import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useTrashStore = defineStore('trash', () => {
    const trash = ref([]);

    function addToTrash(app) {
        trash.value.push(app);
    }

    function removeFromTrash(app) {
        trash.value = trash.value.filter((a) => a.id !== app.id);
    }

    return { trash, addToTrash, removeFromTrash };
});
