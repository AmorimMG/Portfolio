import { createRouter, createWebHistory } from 'vue-router';
import sessionModule from '../service/session';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            component: AppLayout,
            path: '/cadastros',
            children: [
                {
                    path: '/cadastros/usuarios',
                    name: 'usuarios',
                    component: () => import('@/views/pages/cadastros/Usuarios.vue')
                },
                {
                    path: '/cadastros/projetos',
                    name: 'projetos',
                    component: () => import('@/views/pages/cadastros/Projetos.vue')
                },
                {
                    path: '/cadastros/linguagem',
                    name: 'linguagem',
                    component: () => import('@/views/pages/cadastros/Linguagens.vue')
                }
            ]
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: () => import('@/views/Dashboard.vue')
        },
        {
            path: '/dock',
            name: 'dock',
            component: () => import('@/views/pages/Dock/Dock.vue')
        },
        {
            path: '/game',
            name: 'game',
            component: () => import('@/views/pages/GameScene/GameScene.vue')
        },
        {
            path: '/threejs',
            name: 'threejs',
            component: () => import('@/views/pages/ThreeJSGame/ThreeJSGame.vue')
        },
        {
            path: '/pointerlock',
            name: 'pointerlock',
            component: () => import('@/views/pages/ThreeJSGame/Pointerlock.vue')
        },
        {
            path: '/',
            name: 'intro',
            component: () => import('@/views/Intro.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/:pathMatch(.*)',
            name: 'Página não encontrada',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

router.beforeEach(async (to, from, next) => {
    if (to.path.includes('/cadastros')) {
        const isLoggedIn = await sessionModule.actions.isUserLogged();
        if (!isLoggedIn) {
            sessionModule.actions.logout();
            return next('/login');
        }
    }
    next();
});

export default router;
