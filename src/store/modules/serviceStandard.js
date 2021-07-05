
const store = {
  state: {
    id: '',
    workTypeId: ''
  },
  getters: {
  },
  actions: {
    getWorkTypeId: ({ commit, state }, paylod) => {
      commit('changeWorkTypeId', paylod)
      sessionStorage.setItem('workTypeId', paylod)
    },
    getId: ({ commit, state }, paylod) => {
      commit('changeId', paylod)
      sessionStorage.setItem('id', paylod)
    }
  },
  mutations: {
    changeId: (state, data) => {
      state.taskTypeId = data
    },
    changeWorkTypeId: (state, data) => {
      state.taskTypeId = data
    }

  }
}

export default store
