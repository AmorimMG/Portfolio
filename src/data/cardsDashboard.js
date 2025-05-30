// src/data/cardsDashboard.js
import { defineAsyncComponent } from 'vue';

export const componentMap = {
    ClusterLinks: defineAsyncComponent(() => import('@/components/AmorimWebsite/Cards/ClusterLinks.vue')),
    Spotify: defineAsyncComponent(() => import('@/components/AmorimWebsite/Cards/Spotify.vue')),
    ThreeJSComponent: defineAsyncComponent(() => import('@/components/AmorimWebsite/Cards/ThreeJS.vue')),
    EmailModal: defineAsyncComponent(() => import('@/components/Modals/EmailModal.vue')),
    CVModal: defineAsyncComponent(() => import('@/components/Modals/CVModal.vue')),
    IA: defineAsyncComponent(() => import('@/components/AmorimWebsite/Cards/IA.vue')),
    Blog: defineAsyncComponent(() => import('@/components/Modals/BlogModal.vue')),
    ProjectsModal: defineAsyncComponent(() => import('@/components/Modals/ProjectsModal.vue')),
    Terminal: defineAsyncComponent(() => import('@/components/AmorimWebsite/Cards/TerminalComponent.vue')),
    Stack: defineAsyncComponent(() => import('@/components/AmorimWebsite/Cards/Stack.vue')),
    DashboardTimeline: defineAsyncComponent(() => import('@/components/AmorimWebsite/Cards/HeatMap.vue')),
    Photos: defineAsyncComponent(() => import('@/components/AmorimWebsite/Cards/Photos.vue'))
};

export const cards = [
    { id: 1, name: 'CVModal', colSpan: 1, rowSpan: 1 },
    { id: 2, name: 'Spotify', colSpan: 2, rowSpan: 1 },
    { id: 3, name: 'Stack', colSpan: 1, rowSpan: 2 },
    { id: 4, firstComponentName: 'Photos', secondComponentName: 'Blog', colSpan: 1, rowSpan: 1 },
    { id: 5, name: 'IA', colSpan: 1, rowSpan: 1 },
    { id: 6, name: 'ThreeJSComponent', colSpan: 1, rowSpan: 1 },
    { id: 7, name: 'ProjectsModal', colSpan: 1, rowSpan: 1 },
    { id: 8, name: 'Terminal', colSpan: 2, rowSpan: 1 },
    { id: 9, name: 'ClusterLinks', colSpan: 1, rowSpan: 1 },
    { id: 10, name: 'DashboardTimeline', colSpan: 4, rowSpan: 1 }
];
