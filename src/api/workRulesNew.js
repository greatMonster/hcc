import request from '@/utils/http-request'

//
export function initData(data) {
  return request({
    url: '/prepare/api/v1/ruleSets?name=' + data.name + '&businessDomain=' + data.id + '' + '&airportId=' + data.airportId,
    method: 'get'
  })
}
export function selectData(data) {
  return request({
    url: '/prepare/api/v1/employeeTypes?businessDomain=' + data.id + '' + '&airportId=' + data.airportId,
    method: 'get'
  })
}
export function initTableData(data) {
  return request({
    url: '/prepare/api/v1/ruleTemplates?airportId=' + data.airportId,
    method: 'get'
  })
}
export function initrulse(data) {
  return request({
    url: '/prepare/api/v1/ruleSets',
    method: 'post',
    data
  })
}

export function initrulseData(data) {
  return request({
    url: '/prepare/api/v1/ruleSets/' + data.id + '' + '?airportId=' + data.airportId,
    method: 'get'
  })
}
export function editData(data) {
  return request({
    url: '/prepare/api/v1/ruleSets/' + data.id + '',
    method: 'put',
    data
  })
}
export function removeData(id) {
  return request({
    url: '/prepare/api/v1/ruleSets/' + id + '',
    method: 'DELETE'
  })
}
export function init(data) {
  return request({
    url: 'prepare/api/v1/rosters/' + data.id + '/ruleSets?airportId=' + data.airportId,
    method: 'get'
  })
}
export function validate(data) {
  return request({
    url: 'prepare/api/v1//ruleSets/checkName?businessDomain=' + data.businessDomain + '&name=' + data.name + '&airportId=' + data.airportId,
    method: 'get'
  })
}

