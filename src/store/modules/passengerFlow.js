import {
  airportData
} from '@/api/passengerFlow'
const store = {
  state: {
    airportOptionData: []

  },
  getters: {
    getAirportOptions: state => {
      return state.airportOptionData
    }
  },
  actions: {

    getairportOptionData: ({
      commit,
      state
    }) => {
      airportData().then(response => {
        commit('changAirportOption', {
          data: response.data.data
        })
      })
    }
  },
  mutations: {
    changAirportOption: (state, data) => {
      state.airportOptionData = data
    }

  }
}

export default store
