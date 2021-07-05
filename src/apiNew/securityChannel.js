import httpRequest from '@/utils/http-request'
//
// const uri = '/mock/5df322fb8f9ebe00203d551d/me'
// const uri = '/prepare/api/v1'

import request from '@/utils/http-request'

// 图表结果
export function Prediction(data) {
  return request({
    url: '/prepare/api/v1/securityPredictions/' + data.id + '/result?showType=' + data.showType + '&beginDate=' + data.beginDate + '&endDate=' + data.endDate + '&airportId=' + data.airportId,
    method: 'get',
    data
  })
}
// 重新计算
export function reCalculate(data) {
  return request({
    url: '/prepare/api/v1/securityPredictions/' + data.id + '/calc',
    method: 'post',
    data
  })
}

/* 组合参数增删改查接口 */

// 组合参数列表查询接口
export function queryList(data) {
  return httpRequest({
    url: '/prepare/api/v1/securityPredictions?airportId=' + data.airportId,
    method: 'get',
    data
  })
}
// 组合参数列表删除接口
export function deleteData(data) {
  return httpRequest({
    url: '/prepare/api/v1/securityPredictions/' + data,
    method: 'delete'
  })
}

// 新增组合参数列表接口
export function add(data) {
  return httpRequest({
    url: '/prepare/api/v1/securityPredictions',
    method: 'post',
    data
  })
}
// 修改组和参数
export function edit(data) {
  return httpRequest({
    url: '/prepare/api/v1/securityPredictions/' + data.id,
    method: 'put',
    data
  })
}
// 组合列表详情
export function detailList(data) {
  return httpRequest({
    url: '/prepare/api/v1/securityPredictions/' + data.intlType + '?airportId=' + data.airportId,
    method: 'get'
  })
}

/*
 组合参数用到的其他地方的接口
*/
// 安检通道查询按钮
export function desks(data) {
  return httpRequest({
    url: 'basic/api/v1/securityInspectionChannel?airportId=' + data.airportId + '&code=' + data.deskCode + '&name=' + data.deskName + '&openType=' + data.openType + '&region=' + data.deskRegion + '&serviceType=' + data.serviceType + '&terminalId=' + data.terminalId + '&securityDomainId=' + data.securityDomainId,
    method: 'get'
  })
}
// 航班计划
export function flightPlan(data) {
  return httpRequest({
    url: 'prepare/api/v1/flightPlan/all?airportId=' + data.airportId,
    method: 'get'
  })
}
// 旅客流量查询按钮
export function search(data) {
  return httpRequest({
    url: 'prepare/api/v1/security/passengerTraffics/condition?airportId=' + data.airportId + '&name=' + data.name + '&flightScheduleId=' + data.flightScheduleId + '&distributionType=' + data.distributionType,
    method: 'get'
  })
}
// 预览
export function mergerResult(data) {
  return httpRequest({
    url: '/prepare/api/v1/security/passengerTraffics/mergerResult?ids=' + data.val + '&airportId=' + data.airportId,
    method: 'get'
  })
}
// 机场下拉框
export function airports(data) {
  return httpRequest({
    url: 'basic/api/v1/airports?includeTerminals=' + data,
    method: 'get'
  })
}
// 员工技能下拉框
export function employeeSkills(data) {
  return httpRequest({
    url: 'basic/api/v1/employeeSkills?businessDomain=' + data.businessDomainId + '&airportId=' + data.airportId,
    method: 'get'
  })
}
