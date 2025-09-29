/**
 * Composable para notificações do sistema
 */
import { ref } from 'vue';

const notifications = ref([]);
let notificationId = 0;

export function useNotifications() {
    function addNotification(type, title, message, duration = 5000) {
        const id = ++notificationId;
        const notification = {
            id,
            type, // 'success', 'error', 'warning', 'info'
            title,
            message,
            timestamp: new Date()
        };

        notifications.value.push(notification);

        // Auto-remover após o tempo especificado
        if (duration > 0) {
            setTimeout(() => removeNotification(id), duration);
        }

        return id;
    }

    function removeNotification(id) {
        const index = notifications.value.findIndex(n => n.id === id);
        if (index > -1) {
            notifications.value.splice(index, 1);
        }
    }

    function clearNotifications() {
        notifications.value = [];
    }

    // Métodos de conveniência
    function notifySuccess(title, message, duration) {
        return addNotification('success', title, message, duration);
    }

    function notifyError(title, message, duration) {
        return addNotification('error', title, message, duration);
    }

    function notifyWarning(title, message, duration) {
        return addNotification('warning', title, message, duration);
    }

    function notifyInfo(title, message, duration) {
        return addNotification('info', title, message, duration);
    }

    return {
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
        notifySuccess,
        notifyError,
        notifyWarning,
        notifyInfo
    };
}
