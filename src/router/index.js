import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            component: AppLayout,
            path: '/cadastros',
            children: [
                {
                    path: '/cadastros/usuario',
                    name: 'usuario',
                    component: () => import('@/views/pages/cadastros/Usuario.vue')
                },
                {
                    path: '/cadastros/linguagem',
                    name: 'linguagem',
                    component: () => import('@/views/pages/cadastros/Linguagens.vue')
                }
            ]
        },
        {
            path: '/',
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
            path: '/intro',
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

export default router;
