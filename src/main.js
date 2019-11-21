import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)
Vue.use(Antd);

Vue.config.productionTip = false
// axios.defaults.baseURL = 'http://130.120.3.232:91'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
