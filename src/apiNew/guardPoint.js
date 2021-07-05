import httpRequest from '@/utils/http-request'

// 初始化查询柜台视角
export function initTable(data) {
  return httpRequest({
    url: '/rtm/api/v1/guard/pointView?airportId=' + data.airportId + '&businessDomainId=' + data.businessDomainId + '&date=' + data.date,
    method: 'get',
    data
  })
}
// 生成任务按钮
export function generateTask(data) {
  return httpRequest({
    url: '/rtm/api/v1/guardTasks/settings/generation?airportId=' + data.airportId + '&businessDomainId=' + data.businessDomainId,
    method: 'get',
    data
  })
}

// 员工视角员工列表查询
export function initEmployeeList(data) {
  return httpRequest({
    url: '/rtm/api/v1/guard/employeeView?airportId=' + data.airportId + '&employeeName=' + data.employeeName + '&businessDomainId=' + data.businessDomainId + '&date=' + data.date,
    method: 'get',
    data
  })
}
// 未分配任务查询
export function weifenpei(data) {
  return httpRequest({
    url: 'rtm/api/v1/guard/task?airportId=' + data.airportId + '&businessDomainId=' + data.businessDomainId + '&date=' + data.date,
    method: 'get',
    data
  })
}
/*
  监护首页设置任务页面所用接口
*/
// 初始化派工状态
export function initStatus(data) {
  return httpRequest({
    url: '/rtm/api/v1/guardTasks/settings/generation/status?airportId=' + data.airportId + '&businessDomainId=' + data.businessDomainId,
    method: 'get',
    data
  })
}
// 列表初始化查询
export function searchTaskList(data) {
  return httpRequest({
    url: '/rtm/api/v1/guardTasks/settings?airportId=' + data.airportId + '&businessDomainId=' + data.businessDomainId,
    method: 'get',
    data
  })
}
// 技能下拉框
export function searchSkillList(data) {
  return httpRequest({
    url: '/basic/api/v1/employeeSkills?businessDomain=' + data.businessDomain + '&airportId=' + data.airportId,
    method: 'get',
    data
  })
}
// 任务位置下拉
export function positionList(data) {
  return httpRequest({
    url: '/basic/api/v1/unattended/' + data.airportId + '/findMonitorPoints',
    method: 'get',
    data
  })
}
// 拖拽分配
export function deskManualDispatching(data) {
  return httpRequest({
    url: 'rtm/api/v1/guard/task/assignments?employeeCode=' + data.employeeCode + '&guardTaskId=' + data.guardTaskId + '&businessDomainId=' + data.businessDomainId,
    method: 'put',
    data
  })
}
export function canceltask(data) {
  return httpRequest({
    url: 'rtm/api/v1/guard/task/cancel?guardTaskId=' + data.guardTaskId + '&businessDomainId=' + data.businessDomainId,
    method: 'put',
    data
  })
}
// 添加任务接口
export function addsetTask(data) {
  return httpRequest({
    url: '/rtm/api/v1/guardTasks/settings',
    method: 'post',
    data
  })
}
// 修改任务接口
export function updateSetTask(data) {
  return httpRequest({
    url: '/rtm/api/v1/guardTasks/settings/' + data.id,
    method: 'put',
    data
  })
}
// 删除任务接口
export function removeSetTask(data) {
  return httpRequest({
    url: '/rtm/api/v1/guardTasks/settings/' + data.id,
    method: 'delete',
    data
  })
}
// 派工时添加任务周期
export function cycleSetTask(data) {
  return httpRequest({
    url: '/rtm/api/v1/guardTasks/settings',
    method: 'put',
    data
  })
}
// 开启定时生成任务
export function startDistribution(data) {
  return httpRequest({
    url: '/rtm/api/v1/guardTasks/settings/generation/start?airportId=' + data.airportId + '&businessDomainId=' + data.businessDomainId,
    method: 'get',
    data
  })
}
// 停止生成定时任务
export function stopDistribution(data) {
  return httpRequest({
    url: '/rtm/api/v1/guardTasks/settings/generation/stop?airportId=' + data.airportId + '&businessDomainId=' + data.businessDomainId,
    method: 'get',
    data
  })
}

// 开启派工
export function assignStart(data) {
  return httpRequest({
    url: '/rtm/api/v1/guardTasks/settings/assignment/start?airportId=' + data.airportId + '&businessDomainId=' + data.businessDomainId,
    method: 'get',
    data
  })
}
// 派工状态
export function assignStatus(data) {
  return httpRequest({
    url: '/rtm/api/v1/guardTasks/settings/assignment/status?airportId=' + data.airportId + '&businessDomainId=' + data.businessDomainId,
    method: 'get',
    data
  })
}
// 停止派工
export function assignStop(data) {
  return httpRequest({
    url: '/rtm/api/v1/guardTasks/settings/assignment/stop?airportId=' + data.airportId + '&businessDomainId=' + data.businessDomainId,
    method: 'get',
    data
  })
}

/* 员工视角add设置特殊任务 */
export function addSpecialTask(data) {
  return httpRequest({
    url: 'rtm/api/v1/guard/task/special',
    method: 'post',
    data
  })
}
