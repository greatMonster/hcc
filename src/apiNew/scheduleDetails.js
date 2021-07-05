import httpRequest from '@/utils/http-request'

// 初始化查询排班表
export function initNewTable(data) {
  return httpRequest({
    url: '/prepare/api/v1/rosters?name=' + data.name + '&businessDomainId=' + data.id + '&airportId=' + data.airportId,
    method: 'get',
    data
  })
}
// 删除一条排班表
export function deleteSchedule(data) {
  return httpRequest({
    url: '/prepare/api/v1/rosters/' + data.id,
    method: 'delete',
    data
  })
}
// 一键发布
export function releaseTable(data) {
  return httpRequest({
    url: '/prepare/api/v1/roster/' + data.rosterId + '/allEmployeeCalenders',
    method: 'put',
    data
  })
}
// 新增排班表
// 根据工作量查员工类型
export function employeeType(data) {
  return httpRequest({
    url: '/prepare/api/v1/workloads/' + data + '/employeeTypes',
    method: 'get',
    data
  })
}
// 新的根据工作量查员工类型
export function employeeTypeNew(data) {
  return httpRequest({
    url: '/prepare/api/v1/workloads/' + data + '/employeeType/change',
    method: 'get',
    data
  })
}
// 根据工作量和出勤规则查员工类型 新的
export function employeeTypeNewNew(data) {
  return httpRequest({
    url: '/prepare/api/v1/workloads/employeeTypeWithSet?workloadIds=' + data.workloadIds + '&ruleSetIds=' + data.ruleSetIds,
    method: 'get',
    data
  })
}
// 基于模板的员工类型
export function moduleEmployeeType(data) {
  return httpRequest({
    url: '/prepare/api/v1/employeeTypes?businessDomain=' + data + '',
    method: 'get'

  })
}
// 新增接口(基于工作量)
export function addSchedule(data) {
  return httpRequest({
    url: '/prepare/api/v1/workloadRosters',
    method: 'post',
    data
  })
}
// 新增接口(基于模板)
export function addModelSchedule(data) {
  return httpRequest({
    url: '/prepare/api/v1/patternRosters',
    method: 'post',
    data
  })
}

// 出勤规则下拉
export function adRule(data) {
  return httpRequest({
    url: '/prepare/api/v1/ruleSets?businessDomain=' + data,
    method: 'get',
    data
  })
}

// 排班表覆盖信息字段详情
export function detailsData(data) {
  return httpRequest({
    url: '/prepare/api/v1/rosters/' + data.id,
    method: 'get',
    data
  })
}

// 排班表覆盖信息图表查询
export function chartDeatils(data) {
  return httpRequest({
    url: '/prepare/api/v1/rosters/coverCharts?rosterIds=' + data.rosterIds + '&shiftPlanIds=' + data.shiftPlanIds + '&workloadId=' + data.workloadId + '&beginDate=' + data.beginDate + '&endDate=' + data.endDate,
    method: 'get',
    data
  })
}
// 排班统计表查询
export function statisticsData(data) {
  return httpRequest({
    url: 'prepare/api/v1/roster/detail?rosterSettingVersionId=' + data.rosterIds + '&startTime=' + data.beginDate + '&endTime=' + data.endDate + '',
    method: 'get'
  })
}
export function ContrastData(data) {
  return httpRequest({
    url: 'prepare/api/v1/roster/detail/cover?ids=' + data + '',
    method: 'get'
  })
}

// 根据工作量查询工作量技能
export function skills(data) {
  return httpRequest({
    url: 'prepare/api/v1/workloads/skills?ids=' + data,
    method: 'get'
  })
}

// 根据工作量查询员工类型
export function employeeTypeskills(data) {
  return httpRequest({
    url: '/prepare/api/v1/rosters/employeeType/skill/new?businessDomainId=' + data.businessDomainId + '&ids=' + data.ids,
    method: 'get'
  })
}
// 混合排版
export function mix(data) {
  return httpRequest({
    url: 'prepare/api/v1/workloadRosters/mix',
    method: 'post',
    data
  })
}
// 混合出勤排班
export function mixWork(data) {
  return httpRequest({
    url: 'prepare/api/v1/workloadRosters/mixPattern',
    method: 'post',
    data
  })
}
// 出勤规则
export function ruleEmployeeType(data) {
  return httpRequest({
    url: 'prepare/api/v1/rosters/ruleEmployeeType?businessDomain=' + data.businessDomainId + '&ids=' + data.ids,
    method: 'get'
  })
}
// 时间区间
export function timeBetween(data) {
  return httpRequest({
    url: 'prepare/api/v1/workloads/timeBetween?ids=' + data.ids,
    method: 'get'
  })
}
