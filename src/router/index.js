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
            path: '/',
            name: 'dashboard',
            component: () => import('@/views/Dashboard.vue')
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
