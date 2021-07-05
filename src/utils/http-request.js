import axios from 'axios'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
  Message
} from 'element-ui'
import Cookies from 'js-cookie'
// import resetRouter from '@/router'

var isRefreshing = false // 标记是否正在刷新 token
var requests = [] // 存储待重发请求的数组
/**
 * 创建 HTTP Request 默认实例的配置
 * @type {AxiosInstance} Axios 实例
 */
NProgress.configure({ showSpinner: false })
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  withCredentials: true,
  timeout: 300000
})
service.interceptors.request.use(config => {
  if (Cookies.get('TOKEN')) {
    config.headers.Authorization = 'Bearer ' + JSON.parse(Cookies.get('TOKEN')).accessToken
  }
  NProgress.start()
  return config
}, error => {
  // Do something with request error
  return Promise.reject(error)
})
/**
 * 仅针对 HTTP Response 401 进行拦截，其余应交由调用方处理
 */
service.interceptors.response.use(
  response => {
    NProgress.done()
    return response
  },
  error => {
    if (error && error.response) {
      if (error.response.status === 502 && error.response.status === 500 && error.response.status === 501) {
        Message({
          message: '内部服务器错误,请联系管理员',
          type: 'error',
          duration: 5 * 1000
        })
      } else if (error.response.status === 401 && !error.config.url.includes('/auth/refresh') && !error.config.url.includes('/login')) {
        const { config } = error

        if (!isRefreshing) {
          isRefreshing = true
          return axios({
            url: '/auth/api/v1/refresh',
            method: 'get',
            headers: {
              Authorization: 'Bearer ' + JSON.parse(Cookies.get('TOKEN')).refreshToken
            }
          }).then(res => {
            Cookies.set('TOKEN', '')
            Cookies.set('TOKEN', JSON.stringify(res.data.data))
            config.headers.Authorization = `Bearer ${res.accessToken}`
            requests.forEach((cb) => cb(res.accessToken))
            requests = [] // 重新请求完清空
            return service(config)
          }).catch(error1 => {
            console.log('抱歉，您的登录状态已失效，请重新登录！')
            return Promise.reject(error1)
          }).finally(() => {
            isRefreshing = false
          })
        } else {
          // 返回未执行 resolve 的 Promise
          return new Promise(resolve => {
            // 用函数形式将 resolve 存入，等待刷新后再执行
            requests.push(token => {
              config.headers.Authorization = `Bearer ${token}`
              resolve(service(config))
            })
          })
        }
      } else if (error.response.status === 400) {
        Message({
          message: error.response.data.message,
          type: 'error',
          duration: 5 * 1000
        })
      }
    }
    // TODO: 如果 Response 是 401 应弹出登录对话框，要求用户再次输入身份凭据
    NProgress.done()
    return Promise.reject(error)
  })

export default service
