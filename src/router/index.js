import Vue from 'vue'
import VueRouter from 'vue-router'
import DefaultView from '../views/DefaultView.vue'
import VueStore from '../store/index.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'default',
    component: DefaultView,
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('../views/HomeView.vue')
      },
      {
        path: '/search',
        name: 'search',
        component: () => import('../views/SearchView.vue')
      },
      {
        path: '/catalog',
        name: 'catalog',
        component: () => import('../views/CatalogView.vue')
      }
    ],
    redirect: '/home'
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  VueStore.commit('clearPlaneList');
  next()
});

export default router
