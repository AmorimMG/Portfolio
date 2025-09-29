<template>
  <teleport to="body">
    <div class="notifications-container fixed top-4 right-4 z-50 space-y-2">
      <transition-group name="notification" tag="div">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="getNotificationClass(notification.type)"
          class="notification p-4 rounded-lg shadow-lg max-w-sm border-l-4 cursor-pointer"
          @click="removeNotification(notification.id)"
        >
          <div class="flex items-start">
            <i :class="getNotificationIcon(notification.type)" class="mr-3 mt-0.5"></i>
            <div class="flex-1">
              <h4 class="font-semibold text-sm">{{ notification.title }}</h4>
              <p class="text-sm mt-1 opacity-90">{{ notification.message }}</p>
            </div>
            <button
              @click.stop="removeNotification(notification.id)"
              class="ml-2 opacity-60 hover:opacity-100 transition-opacity"
            >
              <i class="pi pi-times text-xs"></i>
            </button>
          </div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { useNotifications } from '@/composables/useNotifications';

const { notifications, removeNotification } = useNotifications();

function getNotificationClass(type) {
  const classes = {
    success: 'bg-green-50 border-green-400 text-green-800',
    error: 'bg-red-50 border-red-400 text-red-800',
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
    info: 'bg-blue-50 border-blue-400 text-blue-800'
  };
  return classes[type] || classes.info;
}

function getNotificationIcon(type) {
  const icons = {
    success: 'pi pi-check-circle text-green-500',
    error: 'pi pi-times-circle text-red-500',
    warning: 'pi pi-exclamation-triangle text-yellow-500',
    info: 'pi pi-info-circle text-blue-500'
  };
  return icons[type] || icons.info;
}
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>
