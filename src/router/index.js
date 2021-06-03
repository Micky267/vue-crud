import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import ReCode from '../views/ReCode.vue'
import DataCommon from '../views/DataCommon.vue'
import CatalogMaintain from '../views/catalog/CatalogMaintain.vue'
import CatalogMaintainCon from '../views/catalog/CatalogMaintainCon.vue'
import CatalogMaintainOperation from '../views/catalog/CatalogMaintainOperation.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    // name: 'home',
    component: Home,
    children:[
     {
      path: '/',
      redirect: 'catalog-maintain',
      component: CatalogMaintainCon,
     },
     {
      path: 'recode',
      component: ReCode,
     },
     {
      path: 'data-common',
      component: DataCommon,
     },
     {
       path: 'catalog-maintain',
       component: CatalogMaintainCon,
       children:[
         {
           path:'',
           component: CatalogMaintain,

         },
         {
           path: 'operation',
           component: CatalogMaintainOperation,
         }
       ]
     },
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
