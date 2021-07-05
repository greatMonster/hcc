import httpRequest from '@/utils/http-request'

export function initTable() {
  return httpRequest({
    url: '/basic/api/v1/serviceType/security',
    method: 'get'

  })
}
export function add(data) {
  return httpRequest({
    url: '/basic/api/v1/serviceType/security',
    method: 'post',
    data
  })
}
export function editfcn(data) {
  return httpRequest({
    url: '/basic/api/v1/serviceType/security',
    method: 'put',
    data
  })
}
export function deletefcn(data) {
  return httpRequest({
    url: '/basic/api/v1/serviceType/security',
    method: 'delete',
    data
  })
}

