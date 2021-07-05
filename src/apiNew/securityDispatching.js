import request from '@/utils/request'
import httpRequest from '@/utils/http-request'
// 基础数据
export function initable(data) {
  return request({
    url: '/adm/checkInBase/find/base/id?checkInBaseId=' + data.checkInBaseId,
    method: 'get'
  })
}
// 修改任务状态
export function updateTaskStatus(data) {
  return httpRequest({
    url: '/rtm/api/v1/tasks/status',
    method: 'put',
    data
  })
}
export function intlTypeList(data) {
  return request({
    url: '/adm/checkInBaseData/selectDeskType?siteId=' + data.siteId,
    method: 'get',
    data
  })
}
// 任务列表
export function taskListInit(data) {
  return httpRequest({
    url: '/rtm/api/v1/desks/tasks/list?beginDate=' + data.beginDate + '&endDate=' + data.endDate,
    method: 'get',
    data
  })
}
export function add(data) {
  return request({
    url: '/adm/securityBaseData/insertSelective',
    method: 'post',
    data
  })
}
export function remove(data) {
  return request({
    url: '/adm/securityBaseData/deleteByPrimaryKey?securityBaseDataId=' + data.securityBaseDataId,
    method: 'post',
    data
  })
}
export function set(data) {
  return request({
    url: '/adm/checkInBaseData/updateByPrimaryKeySelective',
    method: 'post',
    data
  })
}
// 安检覆盖信息图表
export function deskChart(data) {
  return request({
    url: '/rtm/dutyTask/waiting/time/after/assignment?siteId=' + data.siteId + '&deskType=' + data.deskType,
    method: 'get',
    data
  })
}
// 安检覆盖信息图表新接口
export function deskChart1(data) {
  return httpRequest({
    url: '/rtm/api/v1/desks/flowCover?airportId=' + data.airportId + '&ids=' + data.ids + '&date=' + data.date + '&businessDomainId=' + data.businessDomainId,
    method: 'get',
    data
  })
}
//  承运人
export function carrier() {
  return request({
    url: '/adm/carrier/find',
    method: 'get'
  })
}
// 基础数据派工
export function queryList(data) {
  return request({
    url: '/adm/CheckInAllocationBaseData/queryList?airportId=' + data.airportId,
    method: 'get'
  })
}
export function updateByPrimaryKeySelective(data) {
  return request({
    url: '/adm/CheckInAllocationBaseData/updateByPrimaryKeySelective',
    method: 'post',
    data
  })
}
// 站点接口
export function siteList() {
  return request({
    url: '/adm/system/setting/site/find',
    method: 'get'
  })
}
// 基础数据 值机柜台
export function find(data) {
  return request({
    url: '/adm/basic/data/checkin/desk/find?siteId=' + data.siteId,
    method: 'get'
  })
}
// 基础数据 值机岛
export function IsLand(data) {
  return request({
    url: '/adm/basic/data/checkin/IsLand/find?siteId=' + data.siteId,
    method: 'get'
  })
}
// 基础数据 值机岛add
export function addIsLand(data) {
  return request({
    url: '/adm/basic/data/checkin/IsLand/add',
    method: 'post',
    data
  })
}
// 基础数据 值机岛set
export function setIsLand(data) {
  return request({
    url: '/adm/basic/data/checkin/IsLand/set',
    method: 'post',
    data
  })
}
// 基础数据 值机岛remove
export function removeIsLand(data) {
  return request({
    url: '/adm/basic/data/checkin/IsLand/remove',
    method: 'post',
    data
  })
}
// 基础数据 值机柜台add
export function adddesk(data) {
  return request({
    url: '/adm/basic/data/checkin/desk/add',
    method: 'post',
    data
  })
}
// 基础数据 值机柜台set
export function setdesk(data) {
  return request({
    url: '/adm/basic/data/checkin/desk/set',
    method: 'post',
    data
  })
}
// 基础数据 值机柜台remove
export function removedesk(data) {
  return request({
    url: '/adm/basic/data/checkin/desk/remove',
    method: 'post',
    data
  })
}
// 基础数据结束

// 任务生成
export function taskGenerate(data) { // 柜台视角查询
  return httpRequest({
    url: '/rtm/api/v1/desks/generation?airportId=' + data.airportId + '&ids=' + data.deskPredictions + '&date=' + data.date,
    method: 'get'
  })
}
// 任务派工
export function taskAssignmention(data) { // 柜台视角查询
  return httpRequest({
    url: '/rtm/api/v1/desks/assignment?airportId=' + data.airportId + '&ids=' + data.deskPredictions + '&date=' + data.date,
    method: 'get'
  })
}

export function distribution(data) { // 柜台视角查询
  return request({
    url: 'rtm/dutyTask/deskView?deskType=' + data.deskType + '&siteId=' + data.siteId,
    method: 'get'
  })
}
export function distribution1(data) { // 新的柜台视角查询
  return httpRequest({
    url: '/rtm/api/v1/security/deskView?airportId=' + data.airportId + '&deskPredictions=' + data.deskPredictions + '&employeeName=' + data.employeeName + '&date=' + data.date + '&businessDomainId=' + data.businessDomainId,
    method: 'get',
    data
  })
}

// 员工视图
export function ByEmployeeGroup(data) {
  return request({
    // url: '/rtm/resourceGroup/selectByEmployeeGroupJoinCheckIn?intlType=' + data.intlType + '&serviceType=' + data.serviceType + '&organizationId=9',
    url: 'rtm/dutyTask/employeeView?intlType=' + data.intlType + '&serviceType=' + data.serviceType + '&siteId=' + data.siteId + '&employeeName=' + data.employeeName + '&startTime=' + data.startTime + '&endTime=' + data.endTime,
    method: 'get'
  })
}
// 员工视图新接口
export function ByEmployeeGroup1(data) {
  return httpRequest({
    url: '/rtm/api/v1/security/employeeView?airportId=' + data.airportId + '&deskPredictions=' + data.deskPredictions + '&employeeName=' + data.employeeName + '&date=' + data.date + '&businessDomainId=' + data.businessDomainId,
    method: 'get'
  })
}
// 员工视图为匹配到人的任务请求
export function noPersonTask(data) {
  return request({
    url: 'rtm/dutyTask/select/unmatched/task/by/date?intlType=' + data.intlType + '&serviceType=' + data.serviceType + '&siteId=' + data.siteId,
    method: 'get'
  })
}
// 员工视图为匹配到人的任务请求新的接口
export function noPersonTask1(data) {
  return httpRequest({
    url: 'rtm/api/v1/security/task?airportId=' + data.airportId + '&deskPredictions=' + data.deskPredictions + '&intlType=' + data.intlType + '&employeeName=' + data.employeeName + '&date=' + data.date + '&businessDomainId=' + data.businessDomainId,
    method: 'get'
  })
}
// 员工视图拖拽
export function deskManualDispatching(data) {
  return request({
    url: 'rtm/dutyTask/deskManualDispatching?checkInTaskId=' + data.checkInTaskId + '&employeeId=' + data.employeeId + '&status=' + data.status,
    method: 'post',
    data
  })
}
// 拖拽分配任务时搜索员工

export function dragSearch(data) {
  return httpRequest({
    url: '/rtm/api/v1/desks/employee/usable?airportId=' + data.airportId + '&deskPredictions=' + data.deskPredictions + '&taskId=' + data.taskId,
    method: 'get'
  })
}
// 员工视图拖拽新接口（分配）
export function deskManualDispatching1(data) {
  return httpRequest({
    url: '/rtm/api/v1/security/employeeView/change?taskId=' + data.checkInTaskId + '&employeeCode=' + data.employeeId + '&date=' + data.date,
    method: 'put',
    data
  })
}
// 员工视图拖拽新接口（校验）
export function deskManualDispatching2(data) {
  return httpRequest({
    url: '/rtm/api/v1/desks/employeeView/check?taskId=' + data.checkInTaskId + '&employeeCode=' + data.employeeId + '&date=' + data.date,
    method: 'put',
    data
  })
}
// 取消任务接口

export function canceltask(data) {
  return httpRequest({
    url: '/rtm/api/v1/security/employeeView/cancel/' + data.taskId,
    method: 'put',
    data
  })
}
// 员工视图从新计算
export function recalculation(data) {
  return request({
    url: '/rtm/dutyTask/checkInAllocationAlgorithm',
    method: 'post',
    data
  })
}
// 预派工算法测试用
// export function preCalc(data) {
//   return httpRequest({
//     url: '/rtm/api/v1/desks/assignment/v2?airportId=' + data.airportId + '&ids=' + data.deskPredictions,
//     method: 'get',
//     data
//   })
// }
// // 追加派工算法测试用
// export function addCalc(data) {
//   return httpRequest({
//     url: '/rtm/api/v1/desks/assignment/v3?airportId=' + data.airportId + '&ids=' + data.deskPredictions,
//     method: 'get',
//     data
//   })
// }
// 员工视图从新计算新接口
export function recalculation1(data) {
  return httpRequest({
    url: '/rtm/api/v1/desks/assignment/v3?airportId=' + data.airportId + '&ids=' + data.deskPredictions + '&date=' + data.date + '&businessDomainId=' + data.businessDomainId,
    method: 'get',
    data
  })
}
// 查重新计算状态
export function recalculationStatus(data) {
  return httpRequest({
    url: '/rtm/api/v1/desks/assignment/result?airportId=' + data.airportId + '&ids=' + data.deskPredictions + '&businessDomainId=' + data.businessDomainId,
    method: 'get',
    data
  })
}
// 员工视图停止计算
export function stopRecalculation1(data) {
  return httpRequest({
    url: '/rtm/api/v1/desks/assignment/stop?airportId=' + data.airportId + '&ids=' + data.deskPredictions + '&businessDomainId=' + data.businessDomainId,
    method: 'get',
    data
  })
}
// 九元航空
export function jiuyuanData(data) {
  return request({
    url: 'prepare/prediction/predictionAlgorithm/aq?intlType=' + data.intlType + '&deskServiceType=' + data.deskServiceTypee + '&flag=' + data.flag + '&opeDate=' + data.opeDate + '&siteId=' + data.siteId + '&serviceType=' + data.serviceType,
    method: 'get',
    data
  })
}

export function Prediction(data) {
  return request({
    url: '/prepare/prediction/predictionAlgorithm?checkInBaseId=' + data.checkInBaseId + '&deskServiceType=' + data.deskServiceTypee + '&flag=' + data.flag + '&opeDate=' + data.opeDate + '&siteId=' + data.siteId + '&serviceType=' + data.serviceType + '&carriers=' + data.carriers,
    method: 'get'
  })
}

// 承运人下拉数据
export function carriers(data) {
  return request({
    url: '/prepare/prediction/select/carriers?siteId=' + data.siteId,
    method: 'get'
  })
}

// 机型下拉数据
export function planeType(data) {
  return request({
    url: '/prepare/prediction/select/aircraftCodes?siteId=' + data.siteId,
    method: 'get'
  })
}

// 基础数据新版
// 查询
export function initData(data) {
  return request({
    url: '/adm/checkInBase/find/base?siteId=' + data.siteId,
    method: 'get'
  })
}

// 添加柜台参数
export function insertDeskData(data) {
  return request({
    url: '/adm/checkInBase/add/base',
    method: 'post',
    data
  })
}

// 修改柜台参数
export function updateDeskData(data) {
  return request({
    url: '/adm/checkInBase/set/base',
    method: 'post',
    data
  })
}

// 删除柜台参数
export function deleteDeskData(data) {
  return request({
    url: '/adm/checkInBase/remove/base?checkInBaseId=' + data.checkInBaseId,
    method: 'post',
    data
  })
}

// 新增旅客流量参数
export function insertTravelerData(data) {
  return request({
    url: '/adm/checkInBase/add/base/detail',
    method: 'post',
    data
  })
}

// 修改旅客流量参数
export function updateTravelerData(data) {
  return request({
    url: '/adm/checkInBase/set/base/detail',
    method: 'post',
    data
  })
}

// 删除旅客流量参数
export function deleteTravelerData(data) {
  return request({
    url: '/adm/checkInBase/remove/base/detail?checkInBaseDetailId=' + data.checkInBaseDetailId,
    method: 'post',
    data
  })
}

// 资源预测站点后的下拉框
export function jiuyuanSelectData(data) {
  return request({
    url: '/adm/checkInBase/find/base/name?siteId=' + data.siteId,
    method: 'get',
    data
  })
}
export function dispachData(data) {
  return httpRequest({
    url: '/rtm/api/v1/desks/assignment/scheduled/' + data,
    method: 'get'
  })
}
export function dispachFcn(data) {
  return httpRequest({
    url: '/rtm/api/v1/desks/assignment/scheduled/' + data.airportId,
    method: 'put',
    data
  })
}

export function boardGate(data) {
  return httpRequest({
    url: 'rtm/api/v1/boardGate/boardGateView?taskTypes=' + data + '',
    method: 'get'
  })
}
// 任务拆分
export function split(data) {
  return httpRequest({
    url: '/rtm/api/v1/tasks/split',
    method: 'put',
    data
  })
}