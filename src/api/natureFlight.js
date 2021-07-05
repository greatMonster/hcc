
import httpRequest from '@/utils/http-request'
export function initData() {
  return httpRequest({
    url: 'basic/api/v1/flightNature',
    method: 'get'

  })
}
export function addDatafcn(data) {
  return httpRequest({
    url: 'basic/api/v1/flightNature',
    method: 'post',
    data
  })
}
export function eitDatafcn(data) {
  return httpRequest({
    url: 'basic/api/v1/flightNature',
    method: 'put',
    data

  })
}
export function deleteDatafcn(data) {
  return httpRequest({
    url: 'basic/api/v1/flightNature?flightNatureId=' + data.flightNatureId + '',
    method: 'delete'
  })
}

