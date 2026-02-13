export default [
    {
        name: 'Home',
        path: '/',
        meta: {
            requiresAuth: true,
            rootPage: "home",
            title: '1Kole - Conecte-se e compartilhe'
        },
        component: () => import('../home/views/Index.vue')
    },
    {
        name: 'Auth',
        path: '/authentication',
        meta: {
            routeAuth: true,
            title: '1Kole - Conecte-se e compartilhe'
        },
        component: () => import('../../views/authentication/views/Index.vue')
    },
    {
        name: 'Reset password',
        path: '/reset_password',
        meta: {
            routeAuth: true,
            title: 'Redefinir a senha'
        },
        component: () => import('../../views/authentication/views/ResetPassword.vue')
    },
    {
        name: 'View kool',
        path: '/kool/:id',
        meta: {
            requiresAuth: true,
            title: 'Kool'
        },
        component: () => import('../home/views/KoolView.vue')
    },
    {
        name: 'Profile',
        path: '/:username',
        meta: {
            requiresAuth: true,
            title: 'Perfil'
        },
        component: () => import('../home/views/Profile.vue')
    },
    {
        name: 'Messages',
        path: '/messages',
        meta: {
            rootPage: "home",
            requiresAuth: true,
            title: 'Mensagens'
        },
        component: () => import('../home/views/Messages.vue')
    },
    {
        name: 'Notifications',
        path: '/notifications',
        meta: {
            requiresAuth: true,
            rootPage: "home",
            title: 'Notificacoes'
        },
        component: () => import('../home/views/Notifications.vue')
    },
    {
        name: 'Feeds',
        path: '/feeds',
        meta: {
            requiresAuth: true,
            rootPage: "home",
            title: 'Feeds'
        },
        component: () => import('../home/views/Feeds.vue')
    },
    {
        name: 'Settings',
        path: '/settings',
        meta: {
            requiresAuth: true,
            title: 'Settings'
        },
        component: () => import('../home/views/Settings.vue')
    },
    {
        name: 'Lists',
        path: '/lists',
        meta: {
            requiresAuth: true,
            title: 'Listas'
        },
        component: () => import('../home/views/Lists.vue')
    },
    {
        name: 'Search',
        path: '/search',
        meta: {
            requiresAuth: true,
            title: 'Pesquisar'
        },
        component: () => import('../home/views/Search.vue')
    }
];
