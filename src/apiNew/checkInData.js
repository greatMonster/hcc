import httpRequest from '@/utils/http-request'
//
// const uri = '/mock/5df322fb8f9ebe00203d551d/me'
// const uri = '/prepare/api/v1'
export function queryList(data) {
  return httpRequest({
    url: '/prepare/api/v1/deskPredictions?airportId=' + data.airportId,
    method: 'get'
  })
}
export function add(data) {
  return httpRequest({
    url: '/prepare/api/v1/deskPredictions',
    method: 'post',
    data
  })
}
export function edit(data) {
  return httpRequest({
    url: '/prepare/api/v1/deskPredictions/' + data.id,
    method: 'put',
    data
  })
}
export function deleteData(data) {
  return httpRequest({
    url: '/prepare/api/v1/deskPredictions/' + data,
    method: 'delete'
  })
}
export function detailList(data) {
  return httpRequest({
    url: '/prepare/api/v1/deskPredictions/' + data,
    method: 'get'
  })
}
// 预览
export function mergerResult(data) {
  return httpRequest({
    url: '/prepare/api/v1/passengerTraffics/mergerResult?ids=' + data.flowIds + '&interval=' + data.interval + '&airportId=' + data.airportId,
    method: 'get'
  })
}
// 柜台查询按钮
export function desks(data) {
  return httpRequest({
    url: 'basic/api/v1/desks?airportId=' + data.airportId + '&deskCode=' + data.deskCode + '&deskName=' + data.deskName + '&openType=' + data.openType + '&deskRegion=' + data.deskRegion + '&serviceType=' + data.serviceType + '&terminalId=' + data.terminalId + '&isLandId=' + data.isLandId + '&serviceTypeId=' + data.serviceTypeId,
    method: 'get'
  })
}
// 旅客流量查询按钮
export function search(data) {
  return httpRequest({
    url: 'prepare/api/v1/passengerTraffics/condition?airportId=' + data.airportId + '&name=' + data.name + '&flightScheduleId=' + data.flightScheduleId + '&distributionType=' + data.distributionType + '&airportId=' + data.airportId,
    method: 'get'
  })
}
// 下拉框
export function employeeSkills(data) {
  return httpRequest({
    url: 'basic/api/v1/employeeSkills?businessDomain=' + data.id + '&airportId=' + data.airportId,
    method: 'get'
  })
}
export function airports(data) {
  return httpRequest({
    url: 'basic/api/v1/airports?includeTerminals=' + data,
    method: 'get'
  })
}
export function flightPlan(data) {
  return httpRequest({
    url: 'prepare/api/v1/flightPlan/all?airportId=' + data.airportId,
    method: 'get'
  })
}
export function isLandsData(data) {
  return httpRequest({
    url: '/basic/api/v1/airports/' + data.airportId + '/islands?terminalId=' + data.terminalId,
    method: 'get'
  })
}
