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
            component: AppLayout,
			path: "/consultas",
			children: [
				{
					path: "/consultas/consultaSQL",
					name: "consultas-sql",
					component: () =>
						import("@/views/pages/consultas/ConsultaSQL.vue"),
				},
                {
					path: "/consultas/controleRemoto",
					name: "controle-remoto",
					component: () =>
						import("@/views/pages/consultas/ControleRemoto.vue"),
				},
            ]
        },
		{
			path: "/",
			name: "dashboard",
			component: () => import("@/views/Dashboard.vue"),
		},
        {
			path: "/a",
			name: "new-dashboard",
			component: () => import("@/views/NewDashboard.vue"),
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
	const workerPaths = [
		"/whatsappclone",
		"/cv",
        "/en.html",
        "/index.html",
		"/netflixclone",
		"/rawg",
		"/instagramclone",
		"/snakeclone",
		"/crudbasic",
	];

	// Check if the current path should be handled by Cloudflare Worker
	if (workerPaths.some((path) => to.path.startsWith(path))) {
		// Check if the user is already on the worker-handled path to prevent loops
		if (from.path !== to.path) {
			// Redirect once via the worker and prevent loops
			window.location.href = to.fullPath;
			return;
		}
	}

	// Handle authentication for cadastros paths
	if (to.path.includes("/cadastros") || to.path.includes("/consultas")) {
		const isLoggedIn = await sessionModule.actions.isUserLogged();
		if (!isLoggedIn) {
			sessionModule.actions.logout();
			return next("/login");
		}
	}

	next();
});

export default router;
