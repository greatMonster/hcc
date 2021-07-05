// eslint-disable-next-line no-unused-vars
import httpRequest from '@/utils/http-request'

// 查询接口
export function initData(data) {
  return httpRequest({
    url: 'auth/api/v1/roles?name=' + data + '',
    method: 'get'
  })
}
export function initTree() {
  return httpRequest({
    url: 'auth/api/v1/pages',
    method: 'get'
  })
}
export function saveData(data) {
  return httpRequest({
    url: '/auth/api/v1/roles',
    method: 'post',
    data
  })
}
export function editData(id) {
  return httpRequest({

    url: 'auth/api/v1/roles/' + id + '',
    method: 'get'
  })
}
export function editDataAirports(data) {
  return httpRequest({
    url: 'auth/api/v1/roles/' + data.id + '/airports?airportId=' + data.airportId,
    method: 'get'
  })
}
export function editSaveData(data) {
  return httpRequest({
    url: 'auth/api/v1/roles',
    method: 'put',
    data
  })
}
export function removeData(id) {
  return httpRequest({
    url: 'auth/api/v1/roles/' + id + '',
    method: 'DELETE'
  })
}
export function getRoleType() {
  return httpRequest({
    url: '/auth/api/v1/roleTypes',
    method: 'get'
  })
}
export function getPageByRoleType(data) {
  return httpRequest({
    url: '/auth/api/v1/pages?airportId=' + data.airportId + '&roleType=' + data.roleType,
    method: 'get'
  })
}
