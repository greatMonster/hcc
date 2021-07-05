import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import './styles/element-variables.scss'
ElementUI.Dialog.props.closeOnClickModal.default = false
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import '@/styles/index.scss' // global css
import VueTimepicker from 'vue2-timepicker'
// CSS
import 'vue2-timepicker/dist/VueTimepicker.css'

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import vGanttChart from 'v-gantt-chart'

import './utils/directives.js'
import 'babel-polyfill'
import Print from '@/plugs/print'

Vue.directive('title', {
  inserted: function (el, binding) {
    document.title = el.dataset.title
  }
})
Vue.use(Print) // 注册
Vue.use(vGanttChart)
Vue.use(VueTimepicker)
// import VueElementExtends from 'vue-element-extends'
// import 'vue-element-extends/lib/index.css'
// Vue.use(VueElementExtends)
/**
 * If you don't want to use mock-server
 * you want to use mockjs for request interception
 * you can execute:
 *
 * import { mockXHR } from '../mock'
 * mockXHR()
 */
// set ElementUI lang to EN
import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)
Vue.use(ElementUI, {
  zhLocale
})
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
