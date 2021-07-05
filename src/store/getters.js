const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  userInfo: state => state.user.userInfo,
  router: state => state.user.router,
  checkInDetail: state => state.storeCache.checkInDetail
}
export default getters
