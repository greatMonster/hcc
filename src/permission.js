import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Cookies from 'js-cookie'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
//   NProgress.start()

  // set page title
  setTimeout(() => {
    document.title = store.state.navTitle.title || getPageTitle(to.meta.title)
  }, 2000)

  // determine whether the user has logged in
  const hasToken = Cookies.get('TOKEN')
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
    //   NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.getInfo
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get getInfo
          var airportId = ''
          await store.dispatch('user/getInfo')
          if (!Cookies.get('SET_AIRPORT')) {
            if (JSON.parse(Cookies.get('SET_USERINFO')).role.airports.length) {
              airportId = JSON.parse(Cookies.get('SET_USERINFO')).role.airports[0].airportId
              await store.dispatch('user/getRouter', airportId)
            }
          } else {
            airportId = JSON.parse(Cookies.get('SET_AIRPORT')).airportId
            await store.dispatch('user/getRouter', airportId)
          }
          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
        //   NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      // next()
    //   NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
//   NProgress.done()
})
