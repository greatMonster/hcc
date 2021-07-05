import request from '@/utils/request'

export function initTable(data) {
  return request({
    url: '/adm/basic/data/contract/find?businessDomainId=' + data.businessDomainId + '&airportId=' + data.airportId,
    method: 'get',
    params: {}
  })
}
export function add(data) {
  return request({
    url: '/adm/basic/data/contract/add?businessDomainId=' + data.id + '',
    method: 'post',
    data
  })
}
export function remove(data) {
  return request({
    url: '/adm/basic/data/contract/remove',
    method: 'post',
    data
  })
}
export function set(data) {
  return request({
    url: '/adm/basic/data/contract/set',
    method: 'post',
    data
  })
}
export function initSelect() {
  return request({
    url: '/adm/basic/data/contract/find',
    method: 'get',
    params: {}
  })
}
