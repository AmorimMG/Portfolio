<script setup>
import AppMenuItem from './AppMenuItem.vue';
import { SidebarItems } from '../service/sidebarItems.js';
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in SidebarItems" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
