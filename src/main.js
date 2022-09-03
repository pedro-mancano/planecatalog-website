import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Buefy from 'buefy'
import i18n from './plugins/vue-i18n'
import axios from 'axios'
import VueAxios from 'vue-axios'

const production = process.env.NODE_ENV === 'production';

/*
TODO List:
- Pizza Graph
- Add custom units
- Download data (table & plots) as CSV / JSON / XML / PDF / PNG / XLSX
*/

Vue.use(VueAxios, axios)
Vue.use(Buefy, {
  defaultIconPack: 'fa',
});

Vue.config.productionTip = false;

Vue.prototype.$production = production
Vue.prototype.$backend = production ? 'https://planecompare.pedromancano.xyz' : 'http://localhost:3000';

console.log(process.env.NODE_ENV)
/**
 * PLANE COMPARE
 */

new Vue({
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount('#app')
