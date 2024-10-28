import ClusterLinks from '../components/Cards/ClusterLinks.vue';
import Discord from '../components/Cards/Discord.vue';
import GithubHeatMap from '../components/Cards/HeatMap.vue';
import IA from '../components/Cards/IA.vue';
import Spotify from '../components/Cards/Spotify.vue';
import Stack from '../components/Cards/Stack.vue';
import ThreeJSComponent from '../components/Cards/ThreeJS.vue';
import Weather from '../components/Cards/Weather.vue';
import MapboxMap from '../components/Mapbox.vue';
import CVModal from '../components/Modals/CVModal.vue';
import DashboardModal from '../components/Modals/DashboardModal.vue';
import EmailModal from '../components/Modals/EmailModal.vue';
import LastFMModal from '../components/Modals/LastFMModal.vue';
import PointerlockModal from "../components/Modals/PointerlockModal.vue";
import ProjectsModal from '../components/Modals/ProjectsModal.vue';
/* import Actitivies from '../components/Cards/Activities.vue'; */

import AmorimIcon from '../assets/images/Cards/profilePic.png';
import CVIcon from '../assets/images/dock/CV.svg';
import FolderIcon from '../assets/images/dock/Folder.svg';
import LastFMIcon from '../assets/images/dock/lastFm.svg';


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
    DashboardModal,
    PointerlockModal
};

export const apps = [
    { id: 4, name: 'CVModal', colSpan: 1, rowSpan: 1, title: 'CV', icon: CVIcon },
    { id: 5, name: 'LastFMModal', colSpan: 1, rowSpan: 1, title: 'LastFM', icon: LastFMIcon },
    { id: 7, name: 'ProjectsModal', colSpan: 1, rowSpan: 1, title: 'projects', icon: FolderIcon },
    { id: 9, name: 'DashboardModal', colSpan: 1, rowSpan: 1, title: 'Amorim', icon: AmorimIcon },
    {id: 13, name: 'PointerlockModal', colSpan: 1, rowSpan: 1, title: 'JOGO', icon: FolderIcon },
];

export const widgets = [
    { id: 1, name: 'Spotify', colSpan: 1, rowSpan: 1 },
    { id: 12, name: 'GithubHeatMap', colSpan: 1, rowSpan: 1 },
/*     { id: 8, name: 'IA', colSpan: 1, rowSpan: 1 },  */
/*     { id: 10, name: 'Weather', colSpan: 1, rowSpan: 1 },  */
    { id: 11, name: 'Stack', colSpan: 1, rowSpan: 1 }, 
];
