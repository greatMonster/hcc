import { login, logout, getInfo, getRouter } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { getMessage } from '@/utils/errors'
import Cookies from 'js-cookie'
const state = {
  userInfo: {},
  airport: null,
  router: []
}
const mutation = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROUTER: (state, router) => {
    state.router = router
  },
  SET_AIRPORT: (state, airport) => {
    state.airport = airport
  }
}
const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then((res) => {
        // TODO: 身份凭据由浏览器直接写入 Cookie 中，无需前端处理，应删除相关 Token 处理代码
        Cookies.set('TOKEN', JSON.stringify(res.data.data))
        commit('SET_TOKEN', res.data.data)
        resolve()
      }).catch(error => {
        reject(getMessage(error))
      })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const userInfo = data.data
        commit('SET_USERINFO', userInfo)
        Cookies.set('SET_USERINFO', JSON.stringify(userInfo))
        resolve(userInfo)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get Router
  getRouter({ commit }, airportId) {
    return new Promise((resolve, reject) => {
      getRouter(airportId).then(response => {
        const data = response.data.data
        commit('SET_ROUTER', data)
        Cookies.set('SET_ROUTER', JSON.stringify(data))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_TOKEN', '')
        Cookies.remove('TOKEN')
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 切换机场
  changeAirport({ commit }, airport) {
    commit('SET_AIRPORT', airport)
    Cookies.set('SET_AIRPORT', JSON.stringify(airport))
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      Cookies.remove('TOKEN')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations: mutation,
  actions
}

