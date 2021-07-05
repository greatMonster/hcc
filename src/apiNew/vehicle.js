import httpRequest from '@/utils/http-request'
// import request from '@/utils/request'

/* 摆渡车排班作业标准 */
// 查询
export function query(data) {
  return httpRequest({
    // url: '/rtm/ferryBusDispatch/getFeriyBusRules',
    url: '/rtm/api/v1/oldRuleParam/',
    method: 'get'
  })
}
// 所有任务状态查询（已接收、已完成等状态）
export function searchTaskStatus(data) {
  return httpRequest({
    url: '/rtm/api/v1/tasks/status?airportId=' + data.airportId,
    method: 'get'
  })
}
// 修改任务状态
export function updateTaskStatus(data) {
  return httpRequest({
    url: '/rtm/api/v1/tasks/status/' + data.id + '/' + data.status,
    method: 'put'
  })
}
// 车辆类型下拉数据
export function carType(data) {
  return httpRequest({
    // url: '/rtm/ferryBusDispatch/getFeriyBusRules',
    url: '/basic/api/v1/ferryBus/info/skills?airportId=' + data.airportId,
    method: 'get'
  })
}
export function queryNew(data) {
  return httpRequest({
    // url: '/rtm/ferryBusDispatch/getFeriyBusRules',
    url: '/rtm/api/v1/oldRuleParam?airportId=' + data.airportId,
    method: 'get'
  })
}
export function add(data) { // 添加
  return httpRequest({
    url: '/rtm/api/v1/oldRuleParam',
    method: 'post',
    data
  })
}
export function updateFeriyBusRules(data) { // 编辑
  return httpRequest({
    url: '/rtm/api/v1/oldRuleParam/' + data.id,
    method: 'put',
    data
  })
}
export function updateFeriyBusRulesNew(data) { // 编辑
  return httpRequest({
    url: '/rtm/api/v1/oldRuleParam/' + data.id,
    method: 'put',
    data
  })
}
export function remove(data) { // 删除
  return httpRequest({
    url: '/rtm/api/v1/oldRuleParam/' + data.id,
    method: 'delete',
    data
  })
}

/* 派工页面 */
// 开启生成任务/停止生成任务
export function updateTask(data) {
  return httpRequest({
    // url: '/rtm/api/v1/startTask',
    url: '/rtm/api/v1/updateServiceOperate/' + data.workTypeId + '?state=' + data.state + '&airportId=' + data.airportId,
    method: 'put',
    data
  })
}
// 查询任务生成状态
export function searchService(data) {
  return httpRequest({
    url: '/rtm/api/v1/getServiceWork?airportId=' + data.airportId,
    method: 'get'
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

// 员工及已分配任务列表
export function list(data) {
  return httpRequest({
    url: '/rtm/api/v1/tasks/employee?busTypeId=' + data.skillId + '&date=' + data.taskDate + '&states=' + data.state + '&airportId=' + data.airportId,
    method: 'get'
  })
}

// 未分配任务列表
export function getFeriyBusTask(data) {
  return httpRequest({
    url: '/rtm/api/v1/tasks/flight?busTypeId=' + data.skillId + '&date=' + data.taskDate + '&states=' + data.state + '&airportId=' + data.airportId,
    method: 'get'
  })
}
// 统计数据
export function getStatistics(data) {
  return httpRequest({
    url: '/rtm/api/v1/tasks/stats?busTypeId=' + data.skillId + '&date=' + data.taskDate + '&airportId=' + data.airportId,
    method: 'get'
  })
}
// 任务详情
export function getTaskInfo(data) {
  return httpRequest({
    url: '/rtm/api/v1/tasks/' + data,
    method: 'get'
  })
}
// 查询任务分派状态，按钮显示开始派工或停止派工
export function getJobState(data) {
  return httpRequest({
    url: '/rtm/api/v1/getJobState?airportId=' + data.airportId,
    method: 'get'
  })
}

// 取消任务
export function cancelTask(data) {
  return httpRequest({
    url: '/rtm/api/v1/tasks/' + data.id + '?canceledReason=' + data.canceledReason,
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
    url: '/rtm/api/v1/tasks',
    method: 'post',
    data
  })
}
// 开始手动派工
export function startTask(data) {
  return httpRequest({
    url: '/rtm/api/v1/tasks/autoDispatch?date=' + data.date + '&airportId=' + data.airportId,
    method: 'get',
    data
  })
}
// 开始自动派工
export function automaticTask1(data) {
  return httpRequest({
    url: '/rtm/api/v1/startTask',
    method: 'get',
    data
  })
}
// 停止自动派工
export function stopAutoTask(data) {
  return httpRequest({
    url: '/rtm/api/v1/stopTask?airportId=' + data.airportId,
    method: 'get',
    data
  })
}
// 任务拖拽
export function allotTasks(data) {
  return httpRequest({
    url: '/rtm/api/v1/tasks/manualAssign?employeeCode=' + data.employeeId + '&taskId=' + data.taskId + '&date=' + data.date + '&airportId=' + data.airportId,
    method: 'get',
    data
  })
}
// 任务冲突强制拖拽
export function allotTasksForce(data) {
  return httpRequest({
    url: '/rtm/api/v1/tasks/manualAssign?employeeCode=' + data.employeeId + '&taskId=' + data.taskId + '&state=1' + '&date=' + data.date + '&airportId=' + data.airportId,
    method: 'get',
    data
  })
}
// 未确认任务往下拖
export function bottomAllotTasks(data) {
  return httpRequest({
    url: '/rtm/api/v1/tasks/manualAssign?taskId=' + data.taskId + '&date=' + data.date + '&airportId=' + data.airportId,
    method: 'get',
    data
  })
}
// 未确认任务往下拖，确认拖拽
export function bottomAllotTasksForce(data) {
  return httpRequest({
    url: '/rtm/api/v1/tasks/manualAssign?taskId=' + data.taskId + '&state=1' + '&date=' + data.date + '&airportId=' + data.airportId,
    method: 'get',
    data
  })
}
// 航班任务列表
export function getFlightPlanInfo(data) {
  return httpRequest({
    url: '/rtm/api/v1/tasks/flight/all?flightNo=' + data.flightNo + '&pageNum=' + data.pageNum + '&pageSize=' + data.pageSize + '&date=' + data.data + '&airportId=' + data.airportId,
    method: 'get'
  })
}
// 航班任务列表统计
export function getFlightstats(data) {
  return httpRequest({
    url: '/rtm/api/v1/tasks/stats?flightNo=' + data.flightNo + '&pageNum=' + data.pageNum + '&pageSize=' + data.pageSize + '&date=' + data.data,
    method: 'get'
  })
}
// 航班任务列表统计 其他派工
export function getFlightrtTasks(data) {
  return httpRequest({
    url: '/rtm/api/v1/rtTasks/stats?date=' + data.date + '&businessDomainId=' + data.businessDomainId,
    method: 'get',
    data
  })
}
// 航班任务列表 其他派工
export function getFlightPlanInfort(data) {
  return httpRequest({
    url: '/rtm/api/v1/rtTasks/flight/all?date=' + data.date + '&businessDomainId=' + data.businessDomainId + '&flightNo=' + data.flightNo + '&airportId=' + data.airportId + '&flag=' + data.flag,
    method: 'get',
    data
  })
}
// 生成摆渡车动态任务与工作量
export function GeneratingTasksWorkload(data) {
  return httpRequest({
    url: '/rtm/api/v1/poc/ferryBus/tasks',
    method: 'post',
    data
  })
}

// 根据任务类型下拉技能
export function skillByTask(data) {
  return httpRequest({
    url: '/basic/api/v1/taskTypes/skill?taskTypeId=' + data.taskTypeId,
    method: 'get'

  })
}
