<template>
    <div class="file-item-component">
        <!-- Este componente é invisível no desktop, apenas usado como placeholder -->
        <!-- O ícone e título são mostrados pela estrutura do Desktop.vue -->
    </div>
</template>

<script setup>
// Componente simples para representar arquivos genéricos no desktop
// A visualização real é feita pelo Desktop.vue através do app-icon-wrapper
</script>

<style scoped>
.file-item-component {
    display: none; /* Invisível, pois o Desktop.vue cuida da apresentação */
}
</style>
