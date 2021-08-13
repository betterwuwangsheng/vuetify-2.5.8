import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'

// 导入全局样式
import 'assets/css/global.css'

// 导入字体图标
import 'assets/fonts/iconfont.css'

// 导入 axios
import axios from 'axios'

// 挂载到 vue 原型对象上
Vue.prototype.$http = axios

// 配置请求的根路径
// 本机地址
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
// 远程后台地址
// 请求拦截器
axios.interceptors.request.use(config => {
  // 在最后必须 return config
  // 设置 headers 中的 Authorization 值
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
//axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
