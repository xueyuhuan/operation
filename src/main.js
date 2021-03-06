import Vue from 'vue'
import ElementUI from 'element-ui';
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './axios'
import echats from 'echarts'

import './assets/scss/element-variables.scss';
import 'element-ui/lib/theme-chalk/display.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './assets/scss/reset.scss';
import './assets/scss/common.scss';

Vue.config.productionTip = false;

Vue.prototype.$ajax=axios;
Vue.prototype.$echarts = echats;
Vue.use(ElementUI, { size: 'small'});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
