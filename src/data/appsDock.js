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
import ProjectsModal from '../components/Modals/ProjectsModal.vue';
import PointerlockModal from "../components/ThreeJSGame/PointerlockModal.vue";
/* import Actitivies from '../components/Cards/Activities.vue'; */
import CameraModal from '../components/Modals/CameraModal.vue';

import AmorimIcon from '@/assets/images/cards/profilePic.png';
import Camera from '@/assets/images/dock/camera.png';
import CVIcon from '@/assets/images/dock/CV.svg';
import FolderIcon from '@/assets/images/dock/Folder.svg';
import LastFMIcon from '@/assets/images/dock/lastFm.svg';
import Raspberry from '@/assets/images/dock/raspberry.png';
import Threejs from '@/assets/images/dock/threejs.png';

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
    PointerlockModal,
    CameraModal
};

export const apps = [
    { id: 4, name: 'CVModal', colSpan: 1, rowSpan: 1, title: 'CV', icon: CVIcon },
    { id: 5, name: 'LastFMModal', colSpan: 1, rowSpan: 1, title: 'LastFM', icon: LastFMIcon },
    { id: 7, name: 'ProjectsModal', colSpan: 1, rowSpan: 1, title: 'Projects', icon: FolderIcon },
    { id: 9, name: 'DashboardModal', colSpan: 1, rowSpan: 1, title: 'Amorim', icon: AmorimIcon },
    { id: 13, name: 'PointerlockModal', colSpan: 1, rowSpan: 1, title: 'JOGO', icon: Threejs },
    { id: 13, name: 'PointerlockModal', colSpan: 1, rowSpan: 1, title: 'Servidor', icon: Raspberry },
    { id: 14, name: 'CameraModal', colSpan: 1, rowSpan: 1, title: 'Camera', icon: Camera },
    { id: 15, name: 'CameraModal', colSpan: 1, rowSpan: 1, title: 'Wallpaper', icon: Camera },
];

export const widgets = [
    { id: 1, name: 'Spotify', colSpan: 1, rowSpan: 1 },
/*     { id: 12, name: 'GithubHeatMap', colSpan: 1, rowSpan: 1 }, */
/*     { id: 8, name: 'IA', colSpan: 1, rowSpan: 1 },  */
/*     { id: 10, name: 'Weather', colSpan: 1, rowSpan: 1 },  */
/*     { id: 11, name: 'Stack', colSpan: 1, rowSpan: 1 },  */
];
