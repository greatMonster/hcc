import httpRequest from '@/utils/http-request'

export function initData(id) {
  return httpRequest({
    url: 'auth/api/v1/users/me/pages/' + id + '/parents',
    method: 'get'

  })
}
export function initData1(id) {
  return httpRequest({
    url: 'auth/api/v1/users/me/pages/' + id + '/parents',
    method: 'get'

  })
}

