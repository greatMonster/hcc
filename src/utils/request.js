import axios from 'axios'
import {
  // MessageBox,
  Message
} from 'element-ui'
import Cookies from 'js-cookie'
// import store from '@/store'
// import {
//   getToken
// } from '@/utils/auth'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// create an axios instance
// 为保持与现有代码兼容，这里将 /api/v1/ 前缀添加到 baseURL 中
var isRefreshing = false // 标记是否正在刷新 token
var requests = [] // 存储待重发请求的数组
NProgress.configure({ showSpinner: false })
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API + 'api/v1/', // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 2500000000 // request timeout
})

// request interceptor
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

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    NProgress.done()
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== '200') {
      Message({
        message: res.message || 'error',
        type: 'error',
        duration: 5 * 1000
      })
      return res
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   // to re-login
      //   MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
      //     confirmButtonText: 'Re-Login',
      //     cancelButtonText: 'Cancel',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   })
      // }
      // return Promise.reject(res.message || 'error')
    } else {
      return res
    }
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
  }
)

export default service
