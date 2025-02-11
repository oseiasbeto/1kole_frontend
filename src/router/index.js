import { createRouter, createWebHistory } from 'vue-router'
import Cookies from "js-cookie"

const routes = [
  {
    name: 'Home',
    path: '/',
    meta: {
      requiresAuth: true,
      title: '1Kole - Conecte-se e compartilhe'
    },
    component: () => import('../views/home/Index.vue')
  },
  {
    name: 'Auth',
    path: '/authentication',
    meta: {
      routeAuth: true,
      title: '1Kole - Conecte-se e compartilhe'
    },
    component: () => import('../views/authentication/Index.vue')
  },
  {
    name: 'Reset password',
    path: '/reset_password',
    meta: {
      routeAuth: true,
      title: 'Redefinir a senha'
    },
    component: () => import('../views/authentication/ResetPassword.vue')
  },
  {
    name: 'View kool',
    path: '/kool/:id',
    meta: {
      requiresAuth: true,
      title: 'Kool'
    },
    component: () => import('../views/home/KoolView.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title}`
  window.scrollTo(0, 0)

  const token = Cookies.get("session_id")

  // Verifica se a rota que o usuário está tentando acessar requer autenticação
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Se o usuário não tiver um token de sessão, redireciona para a página de autenticação
    if (!token) {
      next({ path: "/authentication" });
    } else {
      // Caso tenha um token válido, permite o acesso à rota
      next();
    }
  }
  // Verifica se a rota exige que o usuário NÃO esteja autenticado (ex: página de login)
  else if (to.matched.some(record => record.meta.routeAuth)) {
    // Se o usuário já estiver autenticado, redireciona para a página inicial
    if (token) {
      next('/');
    } else {
      // Caso contrário, permite o acesso à rota
      next();
    }
  }
  // Se a rota não exigir nenhuma verificação de autenticação, simplesmente segue para a página
  else {
    next();
  }
})

export default router