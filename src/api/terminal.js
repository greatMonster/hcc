
import httpRequest from '@/utils/http-request'
export function initData(id) {
  return httpRequest({
    url: '/basic/api/v1/terminal?airportId=' + id,
    method: 'get'

  })
}
export function addDatafcn(data) {
  return httpRequest({
    url: '/basic/api/v1/terminal',
    method: 'post',
    data
  })
}
export function eitDatafcn(data) {
  return httpRequest({
    url: '/basic/api/v1/terminal',
    method: 'put',
    data

  })
}
export function deleteDatafcn(data) {
  return httpRequest({
    url: '/basic/api/v1/terminal?id=' + data.id + '',
    method: 'delete',
    data
  })
}

export function airportsData() {
  return httpRequest({
    url: 'basic/api/v1/airports?includeTerminals=false',
    method: 'get'
  })
}
export function carrierData(data) {
  return httpRequest({
    url: '/basic/api/v1/carrier/all?nameOrCode=' + data,
    method: 'get'
  })
}
