import request from '@/utils/request'
import httpRequest from '@/utils/http-request'

export function initTable() {
  return request({
    url: '/prepare/workload/get/documents',
    method: 'get',
    params: {}
  })
}

// 新版工作量查询接口
export function initNewTable() {
  return request({
    url: '/prepare/workload/find/flightWorkloads',
    method: 'get',
    params: {}
  })
}

export function initTable2(data, id) { // 轮班计划
  return request({
    url: '/prepare/shiftPlan/?filed=' + data + '&businessDomainId=' + id + '',
    method: 'get'
  })
}
export function goto(documentId) {
  return request({
    url: '/prepare/workload/select/by/workloadsetting',
    method: 'get',
    params: { documentId }
  })
}
// export function shiftPlan(data) { // 图表渲染
//   return request({
//     url: '/prepare/shiftPlan/test/select/shiftPlanWorkload/byDocumentId?documentId=' + data,
//     method: 'get'
//     // data
//   })
// }
export function shiftPlan(data) { // 图表渲染 轮班计划新版接口
  return httpRequest({
    url: '/prepare/api/v1/rosters/coverCharts?shiftPlanIds=' + data,
    method: 'get'
    // data
  })
}
export function workloadsetting(data) { // 生成工作量图表渲染
  return request({
    url: '/prepare/workload/select/by/workloadsetting?documentId=' + data,
    method: 'get'
    // data
  })
}
export function shiftPlanShift(data) { // 轮班列表
  return httpRequest({
    url: '/prepare/api/v1/shiftPlanShifts/' + data,
    method: 'get'
    // data
  })
}
export function search(string) {
  return request({
    url: '/prepare/shiftPlan/?filed=' + string,
    method: 'get'
  })
}
export function tabhb(data) {
  return request({
    url: '/prepare/workload/select/record/task/by/date?documentId=' + data.documentId,
    method: 'get'
    // params: { data }
  })
}
export function kpis(data) {
  return request({
    url: '/prepare/workload/select/kpi/by/date?documentId=' + data.documentId + '&flag=' + data.flag,
    method: 'get'
    // params: { data }
  })
}
export function generateWorkload(data) { // 生成工作量
  return request({
    url: '/prepare/workload/insert/generateWorkload?workloadName=' + data.shiftPlanName,
    method: 'post',
    data
  })
}
export function remove(data) { // workload文件删除
  return request({
    url: '/prepare/workload/delete/workload/byDocumentId?documentId=' + data,
    method: 'post',
    data
  })
}
export function remove2(data) { // shiftPlan文件删除
  return request({
    url: '/prepare/shiftPlan/delete/shiftPlan/byDocumentId?documentId=' + data,
    method: 'post',
    data
  })
}
// 1024 修改
export function search2(data) { // 整改后删除
  return request({
    url: '/prepare/workload/select/by/date?documentId=' + data.documentId + '&begin=' + data.begin.toString() + '&end=' + data.end.toString(),
    method: 'get'
    // params: { data }
  })
}
export function searchDate(data) {
  return request({
    url: '/prepare/workload/get/mergeWaveform/workloads/skill?documentId=' + data.documentId + '&begin=' + data.begin.toString() + '&end=' + data.end.toString(),
    method: 'get'
  })
}
export function mergeworkloads(data) { // 合并工作量
  return request({
    url: '/prepare/workload/get/waveform/workloads/skill?documentId=' + data.documentId + '&begin=' + data.begin.toString() + '&end=' + data.end.toString(),
    method: 'get'
  })
}
// for skill
export function searchDateforSkill(data) {
  return request({
    url: '/prepare/workload/get/waveform/workloads/skill?documentId=' + data.documentId + '&begin=' + data.begin.toString() + '&end=' + data.end.toString(),
    method: 'get'
  })
}
export function mergeWorkloads(data) { // 合并工作量按钮
  return request({
    url: '/prepare/workload/mergeWorkloads/skills',
    method: 'post',
    data
  })
}
// 由航班计划确定选择日期
export function flightDate(data) { // 合并工作量
  return request({
    url: '/prepare/flightSchedule/select/dateInterval/ByDocumentId?documentId=' + data.documentId,
    method: 'get'
  })
}
export function saveMergeResult(data) { // 保存合并
  var id = data.form.skillId
  return request({
    url: '/prepare/workload/saveMergeResult/workloads?documentName=' + data.form.documentName + '&roleId=' + id + '&interval=' + data.form.interval + '&sampling=' + data.form.sampling,
    method: 'post',
    data
  })
}

export function flightDateSkill(data) { // Skill合并工作量
  return request({
    url: '/prepare/workload/mergeWorkloads/skills',
    method: 'post',
    data
  })
}
export function saveMergeResultSkill(data) { // forSkill保存合并
  var id = data.form.skillId
  return request({
    url: '/prepare/workload/saveMergeResult/workloads/skill?documentName=' + data.form.documentName + '&skillId=' + id + '&interval=' + data.form.interval + '&sampling=' + data.form.sampling,
    method: 'post',
    data
  })
}

// 固定工作量初始化接口
export function initStaticTable() {
  return request({
    url: '/prepare/workload/find/fixedWorkloads',
    method: 'get',
    params: {}
  })
}
// 拆分工作量 查技能
export function skill(data) {
  return request({
    url: '/prepare/workload/find/skill?documentId=' + data,
    method: 'get'
  })
}
export function cut(data) {
  return request({
    url: '/prepare/workload/cut',
    method: 'post',
    data
  })
}
export function recalculation(data) {
  return httpRequest({
    url: '/prepare/api/v1/shiftPlans/reCalculation',
    method: 'post',
    data
  })
}
export function byLoop() { // 校验接口 资源预算配制
  return request({
    url: '/prepare/shiftPlan/check/algorithmStatus/byLoop',
    method: 'get'
  })
}
export function stopClick() { // 校验接口 资源预算配制
  return httpRequest({
    url: '/prepare/api/v1/shiftPlans/stop',
    method: 'post'
  })
}
