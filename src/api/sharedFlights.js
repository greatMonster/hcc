
import httpRequest from '@/utils/http-request'
export function initData(id) {
  return httpRequest({
    url: 'prepare/api/v1/flightShare?documentId=' + id + '',
    method: 'get'
  })
}
export function addDatafcn(data) {
  return httpRequest({
    url: 'prepare/api/v1/flightShare',
    method: 'post',
    data
  })
}
export function eitDatafcn(data) {
  return httpRequest({
    url: 'prepare/api/v1/flightShare',
    method: 'put',
    data

  })
}
export function deleteDatafcn(data) {
  return httpRequest({
    url: 'prepare/api/v1/flightShare?flightShareId=' + data.flightShareId + '',
    method: 'delete',
    data
  })
}

