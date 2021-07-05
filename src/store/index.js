import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import userStore from './modules/userManagement'
import passengerFlow from './modules/passengerFlow'
import storeCache from './modules/storeCache'
import someStaticData from './modules/staticData'
import checkinParams from './modules/checkinParams'
import navTitle from './modules/changeTitle'
import serviceStandard from './modules/serviceStandard'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    namespaced: true,
    app,
    settings,
    user,
    userStore,
    passengerFlow,
    storeCache,
    someStaticData,
    checkinParams,
    navTitle,
    serviceStandard
  },
  getters
})

export default store
