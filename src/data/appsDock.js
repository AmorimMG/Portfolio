import DashboardTimeline from '../components/cards/HeatMap.vue';
import ThreeJSComponent from '../components/cards/ThreeJS.vue';
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
/* import Actitivies from '../components/cards/Activities.vue'; */

import DiscordIcon from '../assets/images/Dock-Icons/discord.svg';
import LastFMIcon from '../assets/images/Dock-Icons/lastFm.svg';
import CVIcon from '../assets/images/Dock-Icons/CV.svg';
import FolderIcon from '../assets/images/Dock-Icons/Folder.svg';
import EmailIcon from '../assets/images/Dock-Icons/Email.svg';

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
    ProjectsModal,
    Stack,
    DashboardTimeline
};

export const apps = [
    { id: 1, name: 'Discord', colSpan: 1, rowSpan: 1, title: 'Discord', icon: DiscordIcon },
    { id: 2, name: 'MapboxMap', colSpan: 1, rowSpan: 1, title: 'Mapa', icon: FolderIcon },
    { id: 3, name: 'EmailModal', colSpan: 1, rowSpan: 1, title: 'Email', icon: EmailIcon },
    { id: 4, name: 'CVModal', colSpan: 1, rowSpan: 1, title: 'CV', icon: CVIcon },
    { id: 5, name: 'LastFMModal', colSpan: 1, rowSpan: 1, title: 'LastFM', icon: LastFMIcon },
    { id: 7, name: 'ProjectsModal', colSpan: 1, rowSpan: 1, title: 'Projects', icon: FolderIcon }
];

export const widgets = [
    { id: 1, name: 'Spotify', colSpan: 1, rowSpan: 1 },
    { id: 2, name: 'ThreeJSComponent', colSpan: 1, rowSpan: 1 },
    { id: 3, name: 'Weather', colSpan: 1, rowSpan: 1 }
];
