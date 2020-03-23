import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入表格树
import TreeTable from 'vue-table-with-tree-grid'

import './assets/css/globel.css'

// 按需引入element ui css样式还是需要全部引入
import 'element-ui/lib/theme-chalk/index.css'
import './plugin/element'

//axios 配置
import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})
Vue.prototype.$http = axios

// 组件全局注册 表格树
Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
