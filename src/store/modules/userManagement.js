import {
  setData
} from '@/api/userManagement'
import Cookies from 'js-cookie'
const store = {
  state: {
    tableData: [],
    offon: false,
    IDs: ''
  },
  getters: {
    getUserData: state => {
      return state.tableData
    }
  },
  actions: {
    getData: ({
      commit,
      state
    }, paylod) => {
      setData(paylod).then(response => {
        commit('changdata', {
          data: response.data.data
        })
      })
    },
    getpageId: ({ commit, state }, paylod) => {
      commit('changeID', { data: paylod })
      Cookies.set('ids', paylod)
    }
  },
  mutations: {
    changdata: (state, data) => {
      state.tableData = data
      state.offon = true
    },
    changeOffon(state, data) {
      state.offon = data
    },
    changeID(state, data) {
      state.IDs = data
    }
  }
}

export default store
