import httpRequest from '@/utils/http-request'
import request from '@/utils/request'
// 初始化查询工作量
export function initNewTable(data) {
  return httpRequest({
    url: '/prepare/api/v1/workloads/new?businessDomainId=' + data.businessDomainId + '&name=' + data.name + '&airportId=' + data.airportId,
    method: 'get',
    data
  })
}
export function initNewTable2(data) {
  return httpRequest({
    url: '/prepare/api/v1/workloads/mix?businessDomainId=' + data.businessDomainId + '&documentId=' + data.documentId + '&airportId=' + data.airportId,
    method: 'get',
    data
  })
}
// 新增动态工作量
export function addWorkload(data) {
  return httpRequest({
    url: '/prepare/api/v1/workloads',
    method: 'post',
    data
  })
}
// 新增值守工作量
export function addWorkload2(data) {
  return httpRequest({
    url: '/prepare/api/v1/guardWorkloads?businessDomainId=' + data.businessDomainId,
    method: 'post',
    data
  })
}
// 新增历史任务工作量
export function addWorkload3(data) {
  return httpRequest({
    url: '/prepare/api/v1/histTaskWorkloads',
    method: 'post',
    data
  })
}
// 新增航班动态工作量
export function addDynamicWorkload(data) {
  return httpRequest({
    url: '/prepare/api/v1/flightDynamicWorkloads',
    method: 'post',
    data
  })
}
// 修改工作量
export function modifyWorkload(data) {
  return httpRequest({
    url: '/prepare/api/v1/workloads/' + data.id,
    method: 'put',
    data
  })
}
// 修改值守工作量
export function modifyWorkload2(data) {
  return httpRequest({
    url: '/prepare/api/v1/guardWorkloads?businessDomainId=' + data.businessDomainId,
    method: 'put',
    data
  })
}
// 重新生成工作量
export function renewWorkload(data) {
  return httpRequest({
    url: '/prepare/api/v1/workloads/factor',
    method: 'post',
    data
  })
}
// 复制工作量
export function copyWorkload(data) {
  return httpRequest({
    url: '/prepare/api/v1/workloads/copy',
    method: 'post',
    data
  })
}
// 修改历史任务工作量
export function modifyWorkload3(data) {
  return httpRequest({
    url: '/prepare/api/v1/histTaskWorkloads?businessDomainId=' + data.businessDomainId,
    method: 'put',
    data
  })
}
// 修改航班动态任务工作量
export function modifyFlightDynamic(data) {
  return httpRequest({
    url: '/prepare/api/v1//flightDynamicWorkloads?businessDomainId=' + data.businessDomainId,
    method: 'put',
    data
  })
}
// 查询历史工作量
export function initNewTable3(data) {
  return httpRequest({
    url: '/prepare/api/v1/histTaskWorkloads/' + data.workloadSettingId + '/details?businessDomainId=' + data.businessDomainId + '&beginDate=' + data.beginDate + '&endDate=' + data.endDate + '&airportId=' + data.airportId,
    method: 'GET'
  })
}
// 查询航班动态工作量
export function initFlightDynamicWorkload(data) {
  return httpRequest({
    url: '/prepare/api/v1/flightDynamicWorkloads/' + data.workloadSettingId + '/details?businessDomainId=' + data.businessDomainId + '&beginDate=' + data.beginDate + '&endDate=' + data.endDate + '&airportId=' + data.airportId,
    method: 'get'
  })
}
// 历史任务时间
export function historyDate(data) {
  return httpRequest({
    url: '/rtm/api/v1/rtTasks/historyTaskDates?skillIds=' + data.skillIds + '&businessDomainId=' + data.businessDomainId + '&airportId=' + data.airportId,
    method: 'GET'
  })
}

// 预览工作量
export function previewWorkload(data) {
  return httpRequest({
    // url: '/prepare/api/v1/workloads/mergePreview',
    url: '/prepare/api/v1/workloads/mergePreview/new',
    method: 'post',
    data
  })
}

// 保存合并工作量
export function saveMergeResultSkill(data) {
  return httpRequest({
    // url: '/prepare/api/v1/workloads/merge',
    url: '/prepare/api/v1/workloads/merge/new',
    method: 'post',
    data
  })
}

// 删除工作量文件
export function remove(data) { // workload文件删除
  return httpRequest({
    url: 'prepare/api/v1/workloads/' + data.id + '/new?type=' + data.type,
    method: 'delete'
  })
}
// 删除航班动态工作量文件
export function removeFlightDynamic(data) { // 航班动态workload文件删除
  return httpRequest({
    url: 'prepare/api/v1/flightDynamicWorkloads/' + data.id,
    method: 'delete'
  })
}
// 航班计划下拉框
export function flightoptions(data) {
  return httpRequest({
    url: 'prepare/api/v1/flightPlan/all?airportId=' + data.airportId,
    method: 'get'

  })
}

// 技能下拉框
export function skillList(data) {
  return httpRequest({
    url: '/basic/api/v1/employeeSkills?businessDomain=' + data.businessDomainId + '&airportId=' + data.airportId,
    method: 'get'
  })
}
// 作业标准下拉框
export function workStandard(data) {
  return httpRequest({
    url: '/prepare/api/v1/operationStandards?businessDomainId=' + data.businessDomainId + '&airportId=' + data.airportId,
    method: 'get',
    params: {}
  })
}

// 查询航班计划工作量详情
export function workloadDetails(data) {
  return httpRequest({
    url: '/prepare/api/v1/workloads/' + data.id + '?startDate=' + data.startDate + '&endDate=' + data.endDate + '&airportId=' + data.airportId,
    method: 'get'
  })
}
// 查询航班计划工作量详情新接口
export function workloadDetailsNew(data) {
  return httpRequest({
    url: '/prepare/api/v1/workloads/' + data.id + '/flightWorkload?startDate=' + data.startDate + '&endDate=' + data.endDate,
    method: 'get'
  })
}
// 查询值守工作量详情
export function workloadDetails2(data) {
  return httpRequest({
    url: '/prepare/api/v1/guardWorkloads/' + data.documentId + '/details?businessDomainId=' + data.businessDomainId + '&beginDate=' + data.beginDate + '&endDate=' + data.endDate + '&airportId=' + data.airportId,
    method: 'get'
  })
}
// 拆分工作量接口
export function cut(data) {
  return httpRequest({
    url: '/prepare/api/v1/workloads/' + data[0].id + '/split',
    method: 'put',
    data
  })
}
// 航班
export function flights(data) {
  return httpRequest({
    url: '/prepare/api/v1/workloads/' + data.workloadDocumentId + '/flights',
    method: 'get',
    params: {
      pageSize: 20,
      pageNum: data.pageNum,
      currentPage: data.currentPage,
      total: data.total
    }
  })
}
export function init(data) {
  return httpRequest({
    url: '/prepare/api/v1/rosters/' + data.id + '/workloads',
    method: 'get'

  })
}
// 修改工作量名称
export function modifyWorkloadName(data) {
  return httpRequest({
    url: '/prepare/api/v1/workloads/changeName',
    method: 'post',
    data
  })
}
export function skill(data) {
  return request({
    url: '/adm/basic/data/skill/select?businessDomainId=' + data.businessDomainId + '&airportId=' + data.airportId,
    method: 'get'
  })
}

export function skillCopy(data) {
  return httpRequest({
    url: '/prepare/api/v1/workloads/skills?ids=' + data,
    method: 'get'
  })
}
// 查询航班个数
export function dataNum(data) {
  return httpRequest({
    url: 'api/v1/prepare/flightLeg/findFlightNumByTime',
    method: 'get',
    params: {
      startTime: data.startTime,
      endTime: data.endTime,
      documentId: data.documentId

    }
  })
}
export function workStandard2(data) { // 作业标准
  return httpRequest({
    url: '/rtm/api/v1/workStandards?businessDomain=' + data.businessDomainId + '&airportId=' + data.airportId,
    method: 'get'
  })
}

