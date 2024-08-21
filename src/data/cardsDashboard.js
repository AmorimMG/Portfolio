// Profissional
import Stack from '../components/cards/Stack.vue';
import CVModal from '../components/cards/modals/CVModal.vue';
import EmailModal from '../components/cards/modals/EmailModal.vue';
import ProjectsModal from '../components/cards/modals/ProjectsModal.vue';
import Terminal from '../components/cards/Terminal.vue';
import DashboardTimeline from '../components/cards/HeatMap.vue';
import Blog from '../components/cards/modals/BlogModal.vue';

//Casual
import ThreeJSComponent from '../components/cards/ThreeJS.vue';
import Spotify from '../components/cards/Spotify.vue';
import IA from '../components/cards/IA.vue';
import ClusterLinks from '../components/cards/ClusterLinks.vue';

export const componentMap = {
    ClusterLinks,
    Spotify,
    ThreeJSComponent,
    EmailModal,
    CVModal,
    IA,
    Blog,
    ProjectsModal,
    Terminal,
    Stack,
    DashboardTimeline
};

export const cards = [
    { id: 1, name: 'Stack', colSpan: 1, rowSpan: 2 },
    { id: 2, name: 'Spotify', colSpan: 2, rowSpan: 1 },
    { id: 3, name: 'ThreeJSComponent', colSpan: 1, rowSpan: 1 },
    { id: 4, name: 'CVModal', colSpan: 1, rowSpan: 1 },
    { id: 5, name: 'ProjectsModal', colSpan: 1, rowSpan: 1 },
    { id: 6, name: 'Blog', colSpan: 1, rowSpan: 1 },
    { id: 7, name: 'Terminal', colSpan: 2, rowSpan: 1 },
    { id: 8, name: 'IA', colSpan: 1, rowSpan: 1 },
    { id: 9, name: 'ClusterLinks', colSpan: 1, rowSpan: 1 },
    { id: 10, name: 'DashboardTimeline', colSpan: 4, rowSpan: 1 }
];

/* { id: 2, name: 'Discord', colSpan: 1, rowSpan: 1 }, */
/* { id: 7, name: 'LastFMModal', colSpan: 1, rowSpan: 1 }, */
/* { id: 10, name: 'Weather', colSpan: 1, rowSpan: 1 }, */
/* { id: 12, name: 'Valorant', colSpan: 1, rowSpan: 1 }, */
/* { id: 6, name: 'MapboxMap', colSpan: 1, rowSpan: 1 }, */
/* { id: 5, name: 'EmailModal', colSpan: 1, rowSpan: 1 }, */
