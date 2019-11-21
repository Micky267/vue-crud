import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import ReCode from '../views/ReCode.vue'
import DataCommon from '../views/DataCommon.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    // name: 'home',
    component: Home,
    children:[
     {
      path: '/',
      redirect: '/recode',
      component: ReCode,
     },
     {
      path: '/recode',
      component: ReCode,
     },
     {
      path: '/data-common',
      component: DataCommon,
     },
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
