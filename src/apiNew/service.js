import httpRequest from '@/utils/http-request'

export function initTable(data) {
  return httpRequest({
    url: '/basic/api/v1/serviceType/checkIn?airportId=' + data.airportId,
    method: 'get'

  })
}
export function add(data) {
  return httpRequest({
    url: '/basic/api/v1/serviceType/checkIn',
    method: 'post',
    data
  })
}
export function editfcn(data) {
  return httpRequest({
    url: '/basic/api/v1/serviceType/checkIn',
    method: 'put',
    data
  })
}
export function deletefcn(data) {
  return httpRequest({
    url: '/basic/api/v1/serviceType/checkIn',
    method: 'delete',
    data
  })
}

