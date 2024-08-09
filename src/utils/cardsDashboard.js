import DashboardTimeline from '../components/cards/HeatMap.vue';
import ThreeJSComponent from '../components/cards/ThreeJS.vue';
import Terminal from '../components/cards/Terminal.vue';
import Stack from '../components/cards/Stack.vue';
import Spotify from '../components/cards/Spotify.vue';
import Discord from '../components/cards/Discord.vue';
import CVModal from '../components/cards/modals/CVModal.vue';
import LastFMModal from '../components/cards/modals/LastFMModal.vue';
import EmailModal from '../components/cards/modals/EmailModal.vue';
import ProjectsModal from '../components/cards/modals/ProjectsModal.vue';
import ClusterLinks from '../components/cards/ClusterLinks.vue';
import MapboxMap from '../components/Mapbox.vue';
import IA from '../components/cards/IA.vue';
import Weather from '../components/cards/Weather.vue';
import Blog from '../components/cards/Blog.vue';

export const componentMap = {
    ClusterLinks,
    Spotify,
    Discord,
    ThreeJSComponent,
    MapboxMap,
    EmailModal,
    CVModal,
    LastFMModal,
    IA,
    Weather,
    Blog,
    ProjectsModal,
    Terminal,
    Stack,
    DashboardTimeline
};

export const cards = [
    /*     { id: 1, name: 'ClusterLinks', colSpan: 1, rowSpan: 1 }, */
    { id: 1, name: 'Spotify', colSpan: 2, rowSpan: 2 },
    { id: 2, name: 'Discord', colSpan: 1, rowSpan: 1 },
    { id: 3, name: 'ThreeJSComponent', colSpan: 1, rowSpan: 1 },
    { id: 4, name: 'MapboxMap', colSpan: 1, rowSpan: 1 },
    { id: 5, name: 'EmailModal', colSpan: 1, rowSpan: 1 },
    { id: 6, name: 'CVModal', colSpan: 1, rowSpan: 1 },
    { id: 7, name: 'LastFMModal', colSpan: 1, rowSpan: 1 },
    { id: 8, name: 'Weather', colSpan: 1, rowSpan: 1 },
    { id: 9, name: 'Blog', colSpan: 1, rowSpan: 1 },
    { id: 10, name: 'ProjectsModal', colSpan: 1, rowSpan: 1 },
    { id: 11, name: 'Terminal', colSpan: 2, rowSpan: 2 },
    { id: 12, name: 'IA', colSpan: 2, rowSpan: 3 },
    { id: 13, name: 'Stack', colSpan: 2, rowSpan: 2 },
    { id: 14, name: 'DashboardTimeline', colSpan: 4, rowSpan: 1 }
];
