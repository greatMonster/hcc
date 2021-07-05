//  处理缓存数据
import { detailList } from '@/apiNew/checkInData'
const storeCache = {
  state: {
    checkInDetail: {}
  },
  actions: {
    GetDeskDetailList({ commit, state, dispatch }, id) {
      return new Promise((resolve, reject) => {
        detailList(id).then(response => {
          const data = response.data.data
          commit('checkInDetail', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  },
  mutations: {
    checkInDetail: (state, checkInDetail) => {
      state.checkInDetail = checkInDetail
    }
  }
}
export default storeCache

