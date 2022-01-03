import { App } from 'vue'
import { createRouter, createWebHistory, createMemoryHistory, RouteRecordRaw } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/upload',
    name: 'upload',
    component: () => import('../views/Upload.vue'),
  },
]

export function setupRouter(app, { history = createWebHistory() } = {}) {
  const router = createRouter({
    // 4. Provide the history implementation to use.
    // We are using the hash history for simplicity here.
    // baseUrl: '/dashboard',
    // 最为子应用，使用内存history
    // https://next.router.vuejs.org/api/#creatememoryhistory
    history,
    routes, // short for `routes: routes`
  })
  app.use(router)
}

// export default router
