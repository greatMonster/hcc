import request from '@/utils/request'
import httpRequest from '@/utils/http-request'

export function initTable(data) {
  return request({
    url: '/prepare/attribute/selectAllAttributeType?airportId=' + data.airportId,
    method: 'get',
    params: {}
  })
}
export function initselect() {
  return request({
    url: '/prepare/attribute/selectDateType',
    method: 'get',
    params: {}
  })
}
export function add(data) {
  return request({
    url: '/prepare/attribute/newInsertAttributeType',
    method: 'put',
    data
  })
}
export function add1(data) {
  return httpRequest({
    url: '/prepare/api/v1/newInsertAttributeType',
    method: 'post',
    data
  })
}
export function remove(typeId) {
//   console.log(typeId)
  return request({
    url: '/prepare/attribute/deleteAttributeType/' + typeId,
    method: 'delete'
  })
}
export function set(data) {
  return request({
    url: '/prepare/attribute/updateAttributeType',
    method: 'post',
    data
  })
}
export function set1(data) {
  return httpRequest({
    url: '/prepare/api/v1/newUpdateAttributeType',
    method: 'put',
    data
  })
}
