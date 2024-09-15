import AppLayout from "@/layout/AppLayout.vue";
import { createRouter, createWebHistory } from "vue-router";
import sessionModule from "../service/session";

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{
			component: AppLayout,
			path: "/cadastros",
			children: [
				{
					path: "/cadastros/dashboard",
					name: "cadastros-dashboard",
					component: () =>
						import("@/views/pages/cadastros/CadastrosDashboard.vue"),
				},
				{
					path: "/cadastros/usuarios",
					name: "usuarios",
					component: () => import("@/views/pages/cadastros/Usuarios.vue"),
				},
				{
					path: "/cadastros/projetos",
					name: "projetos",
					component: () => import("@/views/pages/cadastros/Projetos.vue"),
				},
				{
					path: "/cadastros/linguagem",
					name: "linguagem",
					component: () => import("@/views/pages/cadastros/Linguagens.vue"),
				},
			],
		},
		{
			path: "/",
			name: "dashboard",
			component: () => import("@/views/Dashboard.vue"),
		},
		{
			path: "/tv",
			name: "tv",
			component: () => import("@/views/Intro.vue"),
		},
		{
			path: "/pages/notfound",
			name: "notfound",
			component: () => import("@/views/pages/NotFound.vue"),
		},
		{
			path: "/login",
			name: "login",
			component: () => import("@/views/pages/auth/Login.vue"),
		},
		{
			path: "/auth/access",
			name: "accessDenied",
			component: () => import("@/views/pages/auth/Access.vue"),
		},
		{
			path: "/:pathMatch(.*)",
			name: "Página não encontrada",
			component: () => import("@/views/pages/auth/Error.vue"),
		},
	],
});

router.beforeEach(async (to, from, next) => {
	// Add a list of paths that should bypass Vue Router and be handled by the worker
	const workerPaths = [
		"/whatsappclone",
		"/cv",
		"/netflixclone",
		"/rawg",
		"/instagramclone",
		"/snakeclone",
		"/crudbasic",
	];

	// If the path starts with any of the worker paths, bypass the router and let the worker handle it
	if (workerPaths.some((path) => to.path.startsWith(path))) {
		window.location.href = to.fullPath; // Redirect the request to be handled by the worker
		return;
	}

	// Handle authentication for cadastros paths
	if (to.path.includes("/cadastros")) {
		const isLoggedIn = await sessionModule.actions.isUserLogged();
		if (!isLoggedIn) {
			sessionModule.actions.logout();
			return next("/login");
		}
	}

	next();
});

export default router;
