import Vue from 'vue'
import VueRouter from 'vue-router'
import VueStore from '@/store/index.js'
import RootView from '@/views/RootView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'root',
    component: RootView
  },
  {
    path: '/plane',
    name: 'plane.default',
    component: () => import('@/views/Plane/DefaultView.vue'),
    children: [
      {
        path: '/plane/home',
        name: 'plane.home',
        component: () => import('@/views/Plane/HomeView.vue')
      },
      {
        path: '/plane/search',
        name: 'plane.search',
        component: () => import('@/views/Plane/SearchView.vue')
      },
      {
        path: '/plane/catalog',
        name: 'plane.catalog',
        component: () => import('@/views/Plane/CatalogView.vue')
      }
    ],
    redirect: '/plane/home'
  },
  {
    path: '/satellite',
    name: 'satellite.default',
    component: () => import('@/views/Satellite/DefaultView.vue'),
    children: [
      {
        path: '/satellite/home',
        name: 'satellite.home',
        component: () => import('@/views/Satellite/HomeView.vue')
      },
      {
        path: '/satellite/search',
        name: 'satellite.search',
        //component: () => import('@/views/Satellite/SearchView.vue')
      },
      {
        path: '/satellite/catalog',
        name: 'satellite.catalog',
        //component: () => import('@/views/Satellite/CatalogView.vue')
      }
    ],
  },
  {
    path: '/rocket',
    name: 'rocket.default',
    component: () => import('@/views/Rocket/DefaultView.vue'),
    children: [
      {
        path: '/rocket/home',
        name: 'rocket.home',
        component: () => import('@/views/Rocket/HomeView.vue')
      },
      {
        path: '/rocket/search',
        name: 'rocket.search',
        //component: () => import('@/views/Rocket/SearchView.vue')
      },
      {
        path: '/rocket/catalog',
        name: 'rocket.catalog',
        //component: () => import('@/views/Rocket/CatalogView.vue')
      }
    ],
  }
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
