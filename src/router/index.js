import { createRouter, createWebHistory } from 'vue-router'
import Cookies from "js-cookie"
import routes from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title}`
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