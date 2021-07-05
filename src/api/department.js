import request from '@/utils/request'
import httpRequest from '@/utils/http-request'
export function initData(data) {
  return request({
    url: 'adm/basic/data/organization/select?airportId=' + data.airportId,
    method: 'get'
  })
}
export function addDatafcn(data) {
  return request({
    url: 'adm/basic/data/organization/insert?businessDomainId=' + data.businessDomainId,
    method: 'post',
    data
  })
}
export function eitDatafcn(data) {
  return request({
    url: 'adm/basic/data/organization/update',
    method: 'post',
    data

  })
}
export function deleteDatafcn(data) {
  return request({
    url: 'adm/basic/data/organization/delete',
    method: 'post',
    data

  })
}
export function selectfcn() {
  return httpRequest({
    url: 'basic/api/v1/businessDomain',
    method: 'get'

  })
}
