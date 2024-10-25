import ClusterLinks from '../components/cards/ClusterLinks.vue';
import Discord from '../components/cards/Discord.vue';
import GithubHeatMap from '../components/cards/HeatMap.vue';
import IA from '../components/cards/IA.vue';
import Spotify from '../components/cards/Spotify.vue';
import Stack from '../components/cards/Stack.vue';
import ThreeJSComponent from '../components/cards/ThreeJS.vue';
import Weather from '../components/cards/Weather.vue';
import MapboxMap from '../components/Mapbox.vue';
import CVModal from '../components/modals/CVModal.vue';
import DashboardModal from '../components/modals/DashboardModal.vue';
import EmailModal from '../components/modals/EmailModal.vue';
import LastFMModal from '../components/modals/LastFMModal.vue';
import ProjectsModal from '../components/modals/ProjectsModal.vue';
/* import Actitivies from '../components/cards/Activities.vue'; */

import AmorimIcon from '../assets/images/cards/profilePic.png';
import CVIcon from '../assets/images/Dock-Icons/CV.svg';
import FolderIcon from '../assets/images/Dock-Icons/Folder.svg';
import LastFMIcon from '../assets/images/Dock-Icons/lastFm.svg';


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
    GithubHeatMap,
    DashboardModal
};

export const apps = [
    { id: 4, name: 'CVModal', colSpan: 1, rowSpan: 1, title: 'CV', icon: CVIcon },
    { id: 5, name: 'LastFMModal', colSpan: 1, rowSpan: 1, title: 'LastFM', icon: LastFMIcon },
    { id: 7, name: 'ProjectsModal', colSpan: 1, rowSpan: 1, title: 'Projects', icon: FolderIcon },
    { id: 9, name: 'DashboardModal', colSpan: 1, rowSpan: 1, title: 'Amorim', icon: AmorimIcon }
];

export const widgets = [{ id: 1, name: 'Spotify', colSpan: 1, rowSpan: 1 }];
