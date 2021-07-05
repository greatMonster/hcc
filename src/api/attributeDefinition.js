import request from '@/utils/request'
import httpRequest from '@/utils/http-request'
export function initTable(data) {
  return request({
    url: '/prepare/attribute/selectAllAttributeByCategory/' + data.categoryCode + '?airportId=' + data.airportId,
    method: 'get',
    params: {}
  })
}
export function initselect(data) {
  return request({
    url: '/prepare/attribute/selectAllAttributeCategory?airportId=' + data.airportId,
    method: 'get',
    params: {}
  })
}
export function add(data) {
  return request({
    url: '/prepare/attribute/insertAttribute',
    method: 'post',
    data
  })
}
export function remove(typeId) {
  return request({
    url: '/prepare/attribute/deleteAttribute/' + typeId,
    method: 'delete'
  })
}
export function set(data) {
  return request({
    url: '/prepare/attribute/updateAttribute',
    method: 'post',
    data
  })
}

export function select(data) {
  return request({
    url: '/prepare/attribute/selectAllAttributeType?airportId=' + data.airportId,
    method: 'get',
    params: {}
  })
}
export function changeFcn(data) {
  return httpRequest({
    url: '/prepare/api/v1/attributeTypes/selectAttributeTypeByCodeFlight?attributeCode=' + data.attributeCode + '&airportId=' + data.airportId,
    method: 'get'
  })
}
