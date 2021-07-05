import request from '@/utils/request'

export function select(data) {
  return request({
    url: '/adm/basic/data/role/select?businessDomainId=' + data.id + '&airportId=' + data.airportId,
    method: 'get'
  })
}
export function add(data) {
  return request({
    url: '/adm/basic/data/role/add',
    method: 'post',
    data
  })
}
export function remove(data) {
  return request({
    url: '/adm/basic/data/role/remove?roleId=' + data.roleId,
    method: 'post',
    data
  })
}
export function set(data) {
  return request({
    url: '/adm/basic/data/role/set',
    method: 'post',
    data
  })
}
