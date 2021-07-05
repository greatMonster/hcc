import httpRequest from '@/utils/http-request'
// import request from '@/utils/request'

// 任务生成测试接口
export function testTaskUrl(data) {
  return httpRequest({
    // url: '/rtm/ferryBusDispatch/getFeriyBusRules',
    url: '/rtm/api/v1/generateTask/date?businessDomains=' + data.businessDomainId + '&beginDate=' + data.beginDate + '&endDate=' + data.endDate + '&flightNos=' + data.flightNos + '&airportId=' + data.airportId,
    method: 'get'
  })
}
// 派工展示下拉数据接口
export function searchMixData(data) {
  return httpRequest({
    // url: '/rtm/ferryBusDispatch/getFeriyBusRules',
    url: '/rtm/api/v1/rtTasks/mixStauts?businessDomainId=' + data.businessDomainId,
    method: 'get'
  })
}
// testUrl测试接口摆渡车
export function testUrl(data) {
  return httpRequest({
    // url: '/rtm/ferryBusDispatch/getFeriyBusRules',
    url: '/rtm/api/v1/taskInfo/' + data.taskId + '?taskState=' + data.taskState,
    method: 'put'
  })
}
// testUrl测试接口特车
export function testUrlSpecial(data) {
  return httpRequest({
    // url: '/rtm/ferryBusDispatch/getFeriyBusRules',
    url: '/rtm/api/v1/generateTask/modifyStatus/' + data.taskId + '?desc=' + data.desc + '&status=' + data.status,
    method: 'get'
  })
}
// 查询
export function query(data) {
  return httpRequest({
    // url: '/rtm/ferryBusDispatch/getFeriyBusRules',
    url: '/rtm/api/v1/oldRuleParam/',
    method: 'get'
  })
}
export function updateFeriyBusRules(data) { // 编辑
  return httpRequest({
    url: '/rtm/api/v1/oldRuleParam/' + data.id,
    method: 'put',
    data
  })
}
// 查询规则设置
// export function getBusParam(data) {
//   return httpRequest({
//     url: '/rtm/api/v1/ruleSetting',
//     method: 'get'
//   })
// }

// 修改规则设置
// export function updateBusParam(data) {
//   return httpRequest({
//     url: '/rtm/api/v1/ruleSetting/' + data.id,
//     method: 'put',
//     data
//   })
// }

// 查询规则设置 new
export function getBusParam(data) {
  return httpRequest({
    url: '/rtm/api/v1/' + data.businessDomainId + '/ruleSetting?airportId=' + data.airportId,
    method: 'get'
  })
}
// 新增规则设置 new
export function addBusParam(data) {
  return httpRequest({
    url: '/rtm/api/v1/' + data.businessDomainId + '/ruleSetting',
    method: 'post',
    data
  })
}
// 修改规则设置 new
export function updateBusParam(data) {
  return httpRequest({
    url: '/rtm/api/v1/' + data.businessDomainId + '/ruleSetting/' + data.id,
    method: 'put',
    data
  })
}
// 任务类型下拉列表
// export function taskType(data) {
//   return httpRequest({
//     url: '/rtm/api/v1/rtTasks/taskType?ids=' + data.ids,
//     method: 'get',
//     data
//   })
// }
export function taskType(data) {
  return httpRequest({
    url: '/basic/api/v1/taskTypes/all?businessDomainId=' + data.businessDomainId + '&airportId=' + data.airportId,
    method: 'get',
    data
  })
}
// 员工及已分配任务列表
export function list(data) {
  return httpRequest({
    url: '/rtm/api/v1/rtTasks/employee?taskTypeId=' + data.skillId + '&date=' + data.taskDate + '&states=' + data.state + '&businessDomainId=' + data.businessDomainId + '&nameOrCode=' + data.nameOrCode + '&mixStatus=' + data.mixStatus + '&airportId=' + data.airportId,
    method: 'get'
  })
}

// 未分配任务列表
export function getFeriyBusTask(data) {
  return httpRequest({
    url: '/rtm/api/v1/rtTasks/flight?taskTypeId=' + data.skillId + '&date=' + data.taskDate + '&businessDomainId=' + data.businessDomainId + '&states=' + data.state + '&mixStatus=' + data.mixStatus + '&airportId=' + data.airportId,
    method: 'get'
  })
}
// 添加服务
export function addService(data) {
  return httpRequest({
    url: '/rtm/api/v1/addServiceWork',
    method: 'post',
    data
  })
}
// 查询服务列表
export function searchService(data) {
  return httpRequest({
    // url: '/rtm/api/v1/getServiceWork',
    url: '/api/v1/adm/basic/data/taskType/select/ByWorkIds?ids=' + data.ids + '&businessDomainId=' + data.businessDomainId + '&airportId=' + data.airportId,
    method: 'get',
    data
  })
}
// 统计数据
export function getStatistics(data) {
  return httpRequest({
    url: '/rtm/api/v1/rtTasks/stats?taskTypeId=' + data.skillId + '&date=' + data.taskDate + '&businessDomainId=' + data.businessDomainId + '&mixStatus=' + data.mixStatus + '&airportId=' + data.airportId,
    // url: '/rtm/api/v1/rtTasks/stats?skillId=' + data.skillId + '&date=' + '2020-02-26',
    method: 'get'
  })
}
// 任务详情
export function getTaskInfo(data) {
  return httpRequest({
    url: '/rtm/api/v1/rtTasks/' + data,
    method: 'get'
  })
}
// 查询任务分派状态，按钮显示开始派工或停止派工
export function getJobState(data) {
  return httpRequest({
    url: '/rtm/api/v1/teCheJobState?airportId=' + data.airportId,
    method: 'get'
  })
}

// 取消任务
export function cancelTask(data) {
  return httpRequest({
    url: '/rtm/api/v1/rtTasks/' + data.id + '?canceledReason=' + data.canceledReason,
    method: 'put'
  })
}
// 新增临时任务时几个下拉的数据
export function addTemporaryTaskData(data) {
  return httpRequest({
    url: 'rtm/api/v1/tasks/flightDynamic?flightNo=' + data.flightNo + '&date=' + data.date + '&airportId=' + data.airportId,
    method: 'get',
    data
  })
}
// 新增任务
export function addTemporaryTask(data) {
  return httpRequest({
    url: '/rtm/api/v1/rtTasks',
    method: 'post',
    data
  })
}
// 获取workTypeId
export function getWorkTypeId(data) {
  return httpRequest({
    url: '/basic/api/v1/workTypes?businessDomain=' + data.businessDomainId + '&airportId=' + data.airportId,
    method: 'get',
    data
  })
}
// 开启生成服务/停止生成服务
export function updateTask(data) {
  return httpRequest({
    url: '/api/v1/adm/basic/data/taskType/select/ByTaskId/' + data.taskTypeId + '?status=' + data.state + '&airportId=' + data.airportId,
    method: 'get',
    data
  })
}
// 查状态
export function teCheJobState(data) {
  return httpRequest({
    url: '/rtm/api/v1/teCheJobState',
    method: 'get',
    data
  })
}
// 开始自动派工
export function autoAllotTasks(data) {
  return httpRequest({
    url: '/rtm/api/v1/teCheStartTask?airportId=' + data.airportId,
    method: 'get',
    data
  })
}
// 停止自动派工
export function stopAllotTasks(data) {
  return httpRequest({
    // url: '/rtm/api/v1/stopTeCheGenerateReal',
    url: '/rtm/api/v1/teCheStopTask?airportId=' + data.airportId,
    method: 'get',
    data
  })
}
// 任务拖拽
export function allotTasks(data) {
  return httpRequest({
    url: '/rtm/api/v1/rtTasks/manualAssign?employeeCode=' + data.employeeId + '&taskId=' + data.taskId + '&airportId=' + data.airportId,
    method: 'get',
    data
  })
}
// 任务冲突强制拖拽
export function allotTasksForce(data) {
  return httpRequest({
    url: '/rtm/api/v1/rtTasks/manualAssign?employeeCode=' + data.employeeId + '&taskId=' + data.taskId + '&state=1' + '&airportId=' + data.airportId,
    method: 'get',
    data
  })
}
// 未确认任务往下拖
export function bottomAllotTasks(data) {
  return httpRequest({
    url: '/rtm/api/v1/rtTasks/manualAssign?taskId=' + data.taskId + '&airportId=' + data.airportId,
    method: 'get',
    data
  })
}
// 未确认任务往下拖，确认拖拽
export function bottomAllotTasksForce(data) {
  return httpRequest({
    url: '/rtm/api/v1/rtTasks/manualAssign?taskId=' + data.taskId + '&state=1' + '&airportId=' + data.airportId,
    method: 'get',
    data
  })
}
// 航班任务列表
export function getFlightPlanInfo(data) {
  return httpRequest({
    url: '/rtm/api/v1/tasks/flight/all?flightNo=' + data.flightNo + '&pageNum=' + data.pageNum + '&pageSize=' + data.pageSize,
    method: 'get'
  })
}
// 航班任务列表统计
export function getFlightstats(data) {
  return httpRequest({
    url: '/rtm/api/v1/tasks/stats?flightNo=' + data.flightNo + '&pageNum=' + data.pageNum + '&pageSize=' + data.pageSize,
    method: 'get'
  })
}
// 修改时间
export function updateWorkTime(data) {
  return httpRequest({
    url: '/prepare/api/v1/employees/calendars/' + data.id,
    method: 'put',
    data
  })
}