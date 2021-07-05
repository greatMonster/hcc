import request from '@/utils/request'
import httpRequest from '@/utils/http-request'

export function init() { //
  return request({
    url: '/rtm/ferryBusDispatch/getFeriyBusRules',
    method: 'get'
  })
}
export function updateFeriyBusRules(data) { // 编辑
  return request({
    url: '/rtm/ferryBusDispatch/updateFeriyBusRules',
    method: 'post',
    data
  })
}
export function getFeriyBusTask(data) { // 派工
  return request({
    url: '/rtm/ferryBusDispatch/getFeriyBusTask?skillId=' + data.skillId + '&taskDate=' + data.taskDate,
    method: 'get'
  })
}
export function list(data) { // 员工列表
  return request({
    url: '/rtm/ferryBusDispatch/employee/list?skillId=' + data.skillId + '&taskDate=' + data.taskDate,
    method: 'get'
  })
}
export function getBusParam(data) { // 员工列表
  return request({
    url: '/rtm/ferryBusDispatch/getBusParam',
    method: 'get'
  })
}
export function updateBusParam(data) { // 员工列表
  return request({
    url: '/rtm/ferryBusDispatch/updateBusParam',
    method: 'post',
    data
  })
}
export function allotTasks(data) { // 手动分配
  return request({
    url: '/rtm/ferryBusDispatch/allotTasks?employeeId=' + data.employeeId + '&skillId=' + data.skillId + '&taskId=' + data.taskId + '&taskDate=' + data.taskDate,
    method: 'post'
  })
}
export function addTemporaryTask(data) { // 生成任务
  return request({
    url: '/rtm/ferryBusDispatch/addTemporaryTask',
    method: 'post',
    data
  })
}
export function getJiweiByKeyWord(data) { // 机位
  return request({
    url: '/rtm/ferryBusDispatch/getJiweiByKeyWord?keyWord=' + data,
    method: 'get'
  })
}
export function getDengjikouByKeyWord(data) { // 出登机口
  return request({
    url: '/rtm/ferryBusDispatch/getDengjikouByKeyWord?keyWord=' + data,
    method: 'get'
  })
}
export function getJiPingByKeyWord(data) { // 机坪
  return request({
    url: '/rtm/ferryBusDispatch/getJiPingByKeyWord?keyWord=' + data,
    method: 'get'
  })
}
export function canceltask(data) { // 取消任务
  return request({
    url: '/rtm/ferryBusDispatch/canceltask?id=' + data.id + '&airportId=' + data.airportId,
    method: 'post'
  })
}
export function getTaskInfo(data) { // 任务详情
  return request({
    url: '/rtm/ferryBusDispatch/getTaskInfo?flightLegId=' + data,
    method: 'get'
  })
}
export function allotTasksForce(data) { // 强制加任务
  return request({
    url: '/rtm/ferryBusDispatch/allotTasksForce?employeeId=' + data.employeeId + '&skillId=' + data.skillId + '&taskId=' + data.taskId + '&taskDate=' + data.taskDate,
    method: 'post',
    data
  })
}
export function getFlightPlanInfo(data) { // 航班任务
  return request({
    url: '/rtm/ferryBusDispatch/getFlightPlanInfo?date=' + data.data + '&flightNo=' + data.flightNo + '&pageNum=' + data.pageNum + '&pageSize=' + data.pageSize,
    method: 'get'
  })
}
export function automaticTask(data) { // 自动分配
  return request({
    url: '/rtm/ferryBusDispatch/automaticTask?automaticTime=' + data.taskDate.toString(),
    method: 'get'
  })
}
export function getStatistics(data) { // 查询静态数据
  return request({
    url: '/rtm/ferryBusDispatch/getStatistics?taskDate=' + data.taskDate + '&skillId=' + data.skillId,
    method: 'get'
  })
}
export function cancelAssignAllTask(data) { // 取消
  return request({
    url: '/rtm/ferryBusDispatch/cancelAssignAllTask?taskDate=' + data.taskDate + '&skillId=' + data.skillId + '&airportId=' + data.airportId || '',
    method: 'post'
  })
}
export function getTaskState() { // 获取状态
  return request({
    url: '/rtm/ferryBusDispatch/getTaskState',
    method: 'get'
  })
}
export function updateTask() { // 重启
  return request({
    url: '/rtm/ferryBusDispatch/updateTask',
    method: 'get'
  })
}
export function feriyBusTask() { // 生成任务
  return request({
    url: '/rtm/ferryBusDispatch/feriyBusTask?documentId=3',
    method: 'get'
  })
}
export function getRuleParam() { // 派工标准查询
  return request({
    url: '/rtm/ferryBusDispatch/getRuleParam',
    method: 'get'
  })
}
export function updateRuleParam(data) { // 派工标准修改
  return request({
    url: '/rtm/ferryBusDispatch/updateRuleParam',
    method: 'post',
    data
  })
}
export function getTaskInfoCopy(data) { // 航班动态详情
  return request({
    url: '/rtm/ferryBusDispatch/getTaskInfoCopy?flightLegId=' + data,
    method: 'get'
  })
}
//
export function removeBusTask(data) { // 取消任务
  return request({
    url: '/rtm/ferryBusDispatch/removeBusTask',
    method: 'get'
  })
}
export function selectData() { //
  return httpRequest({
    url: '/rtm/api/v1/tasks/getSkillId?tenantId=1',
    method: 'get'
  })
}

