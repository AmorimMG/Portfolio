import AppLayout from "@/layout/AppLayout.vue";
import { createRouter, createWebHistory } from "vue-router";
import checkTokenMiddleware from "../middleware/checkTokenMiddleware";
import sessionModule, { getUserCookie } from "../service/session";

const Error = () => import("@/views/pages/auth/Error.vue");
const Login = () => import("@/views/pages/auth/Login.vue");
const AccessDenied = () => import("@/views/pages/auth/Access.vue");
const Dashboard = () => import("@/views/Dashboard.vue");
const CadastrosDashboard = () =>
  import("@/views/pages/cadastros/CadastrosDashboard.vue");
const Usuarios = () => import("@/views/pages/cadastros/Usuarios.vue");
const Projetos = () => import("@/views/pages/cadastros/Projetos.vue");
const Linguagens = () => import("@/views/pages/cadastros/Linguagens.vue");
const Imagens = () => import("@/views/pages/cadastros/Imagens.vue");
const ConsultaSQL = () => import("@/views/pages/consultas/ConsultaSQL.vue");

const routes = [
  {
    component: AppLayout,
    path: "/cadastros",
    children: [
      {
        path: "/cadastros/dashboard",
        name: "cadastros-dashboard",
        component: CadastrosDashboard,
      },
      {
        path: "/cadastros/usuarios",
        name: "usuarios",
        component: Usuarios,
      },
      {
        path: "/cadastros/projetos",
        name: "projetos",
        component: Projetos,
      },
      {
        path: "/cadastros/linguagem",
        name: "linguagem",
        component: Linguagens,
      },
      {
        path: "/cadastros/imagens",
        name: "imagens",
        component: Imagens,
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
        component: ConsultaSQL,
      },
    ],
  },
  {
    path: "/",
    name: "dashboard",
    component: Dashboard,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/auth/access",
    name: "accessDenied",
    component: AccessDenied,
  },
  {
    path: "/:pathMatch(.*)",
    name: "Página não encontrada",
    component: Error,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
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
    const user = getUserCookie();
    if (!user) {
      sessionModule.actions.logout();
      return next("/login");
    }

    return await checkTokenMiddleware(to, from, next);
  }

  next();
});

export default router;
