import DashboardTimeline from "../components/cards/HeatMap.vue";
// Profissional
import Stack from "../components/cards/Stack.vue";
import Terminal from "../components/cards/Terminal.vue";
import Blog from "../components/cards/modals/BlogModal.vue";
import CVModal from "../components/cards/modals/CVModal.vue";
import EmailModal from "../components/cards/modals/EmailModal.vue";
import ProjectsModal from "../components/cards/modals/ProjectsModal.vue";

import ClusterLinks from "../components/cards/ClusterLinks.vue";
import IA from "../components/cards/IA/IA.vue";
import Photos from "../components/cards/Photos.vue";
import Spotify from "../components/cards/Spotify.vue";
//Casual
import ThreeJSComponent from "../components/cards/ThreeJS.vue";

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
	DashboardTimeline,
	Photos,
};

export const cards = [
	{ id: 1, name: "CVModal", colSpan: 1, rowSpan: 1 },
	{ id: 2, name: "Spotify", colSpan: 2, rowSpan: 1 },
	{ id: 3, name: "Stack", colSpan: 1, rowSpan: 2 },
	{
		id: 4,
		firstComponentName: "Photos",
		secondComponentName: "Blog",
		colSpan: 1,
		rowSpan: 1,
	},
	{ id: 5, name: "IA", colSpan: 1, rowSpan: 1 },
	{ id: 6, name: "ThreeJSComponent", colSpan: 1, rowSpan: 1 },
	{ id: 7, name: "ProjectsModal", colSpan: 1, rowSpan: 1 },
	/* 	{ id: 6, name: "Blog", colSpan: 1, rowSpan: 1 }, */
	{ id: 8, name: "Terminal", colSpan: 2, rowSpan: 1 },
	{ id: 9, name: "ClusterLinks", colSpan: 1, rowSpan: 1 },
	{ id: 10, name: "DashboardTimeline", colSpan: 4, rowSpan: 1 },
];

/* { id: 2, name: 'Discord', colSpan: 1, rowSpan: 1 }, */
/* { id: 7, name: 'LastFMModal', colSpan: 1, rowSpan: 1 }, */
/* { id: 10, name: 'Weather', colSpan: 1, rowSpan: 1 }, */
/* { id: 12, name: 'Valorant', colSpan: 1, rowSpan: 1 }, */
/* { id: 6, name: 'MapboxMap', colSpan: 1, rowSpan: 1 }, */
/* { id: 5, name: 'EmailModal', colSpan: 1, rowSpan: 1 }, */
