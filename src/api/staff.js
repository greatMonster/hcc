import request from '@/utils/request'

export function select(data) {
  return request({
    url: '/rtm/resourceType/selectEmployeeType?businessDomainId=' + data.businessDomainId + '&airportId=' + data.airportId,
    method: 'get'
  })
}
export function add(data) {
  return request({
    url: '/rtm/resourceType/insertEmployeeType?businessDomainId=' + data.id + '',
    method: 'post',
    data
  })
}
export function remove(data) {
  return request({
    url: '/rtm/resourceType/editEmployeeType',
    method: 'post',
    data
  })
}
export function set(data) {
  return request({
    url: '/rtm/resourceType/editEmployeeType',
    method: 'post',
    data
  })
}

export function role(data) {
  return request({
    url: '/adm/basic/data/role/select?businessDomainId=' + data.businessDomainId + '&airportId=' + data.airportId,
    method: 'get'

  })
}
