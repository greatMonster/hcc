import request from '@/utils/request'

export function initTable2(data) {
  return request({
    url: '/adm/basic/data/contractType/find?businessDomainId=' + data.businessDomainId + '&airportId=' + data.airportId,
    method: 'get',
    params: {}
  })
}
export function add(data) {
  return request({
    url: '/adm/basic/data/contractType/add?businessDomainId=' + data.id + '',
    method: 'post',
    data
  })
}
export function remove(data) {
  return request({
    url: '/adm/basic/data/contractType/remove',
    method: 'post',
    data
  })
}
export function set(data) {
  return request({
    url: '/adm/basic/data/contractType/set',
    method: 'post',
    data
  })
}
