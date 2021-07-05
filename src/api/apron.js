import request from '@/utils/request'
// 基础数据

import httpRequest from '@/utils/http-request'
// 机坪
export function find(data) {
  return httpRequest({
    url: 'basic/api/v1/adm/basic/data/apron?airportId=' + data.airportId,
    method: 'get'
  })
}
// 统计数据、
export function getStates(data) {
  return request({
    url: '/adm/basic/data/posititon/find/Statistical?airportId=' + data.airportId,
    method: 'get'
  })
}
export function add(data) {
  return httpRequest({
    url: '/basic/api/v1/adm/basic/data/apron',
    method: 'post',
    data
  })
}
export function set(data) {
  return httpRequest({
    url: '/basic/api/v1/adm/basic/data/apron',
    method: 'put',
    data
  })
}
export function remove(data) {
  return httpRequest({
    url: '/basic/api/v1/adm/basic/data/apron?apronId=' + data.apronId,
    method: 'delete'
  })
}
// 机位
export function findposititon(data) {
  return request({
    url: '/adm/basic/data/posititon/find?airportId=' + data.airportId,
    method: 'get'
  })
}
export function addposititon(data) {
  return request({
    url: '/adm/basic/data/posititon/add',
    method: 'post',
    data
  })
}
export function setposititon(data) {
  return request({
    url: '/adm/basic/data/posititon/set',
    method: 'post',
    data
  })
}
export function removeposititon(data) {
  return request({
    url: '/adm/basic/data/posititon/remove',
    method: 'post',
    data
  })
}
// 登机口
export function findboardingGate(data) {
  return request({
    url: '/adm/basic/data/boardingGate/find?airportId=' + data.airportId,
    method: 'get'
  })
}
// 登机口新接口
export function findboardingGateNew(data) {
  return request({
    url: '/adm/basic/data/boardingGate/select/conditional?airportId=' + data.airportId + '&terminalId=' + data.terminalId,
    method: 'get',
    data
  })
}
export function addboardingGate(data) {
  return request({
    url: '/adm/basic/data/boardingGate/add',
    method: 'post',
    data
  })
}
export function setboardingGate(data) {
  return request({
    url: '/adm/basic/data/boardingGate/set',
    method: 'post',
    data
  })
}
export function removeboardingGate(data) {
  return request({
    url: '/adm/basic/data/boardingGate/remove',
    method: 'post',
    data
  })
}
// 关联机位下拉
export function link(data) {
  return request({
    url: '/adm/basic/data/boardingGate/find/NearPosition?airportId=' + data.airportId,
    method: 'get'
  })
}
// 关联登机口
export function linkGate(data) {
  return request({
    url: '/adm/basic/data/boardingGate/find/Gate?airportId=' + data.airportId,
    method: 'get'
  })
}
