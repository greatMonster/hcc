const checkinParams = {
  state: {
    siteId: null,
    deskPredictions: null

  },
  mutations: {
    changSiteId: (state, data) => {
      state.siteId = data
    },
    changDeskPreditons: (state, data) => {
      state.deskPredictions = data
    },
    deleteDeskPredictions: (state, data) => {
      state.deskPredictions = data
    }

  }
}

export default checkinParams
