import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([
    { id: 1, app: 'Whatsapp', text: 'Nova mensagem de Galinho', time: 'agora', icon: 'pi pi-whatsapp', color: '#25D366' },
    { id: 2, app: 'Instagram', text: 'Ralf curtiu sua foto', time: '5m', icon: 'pi pi-instagram', color: '#E1306C' },
    { id: 3, app: 'Tiktok', text: 'Ceci compartilhou um video', time: '25m', icon: 'pi pi-tiktok', color: '#000000' }
  ]);

  const addNotification = (notification) => {
    notifications.value.unshift(notification);
  };

  const removeNotification = (id) => {
    notifications.value = notifications.value.filter(n => n.id !== id);
  };

  return { notifications, addNotification, removeNotification };
});
