import httpRequest from '@/utils/http-request'

// 排班表详情
export function query(data) {
  return httpRequest({
    url: '/prepare/api/v1/rosters/' + data,
    method: 'get'
  })
}
// 查询工作量里的员工类型
export function employeeTypes(data) {
  return httpRequest({
    url: '/prepare/api/v1/workloads/' + data + '/employeeTypes',
    method: 'get'
  })
}
// 技能下拉列表

export function skillSearch(data) {
  return httpRequest({
    url: 'prepare/api/v1/rosters/' + data.rosterSettingId + '/cells/skill',
    method: 'get'
  })
}
// 新增员工类型
export function addEmployeeType(data) {
  return httpRequest({
    url: '/prepare/api/v1/rosters/' + data.rosterSettingVersionId + '/employeeType?employeeTypeIds=' + data.id,
    method: 'post'
  })
}
// 员工类型删除
export function delEmployeeType(data) {
  return httpRequest({
    url: '/prepare/api/v1/rosters/' + data.rosterSettingVersionId + '/employeeType?employeeTypeId=' + data.id,
    method: 'delete'
  })
}
// 删除已分配的班组
export function delGroup(data) {
  return httpRequest({
    url: '/prepare/api/v1/roster/' + data.rosterSettingId + '/lines/' + data.lineNumber + '/groups',
    method: 'delete',
    data: data.rosterGroupVO
  })
}
// 班组分配拖拽接口
export function dragGroup(data) {
  return httpRequest({
    url: '/prepare/api/v1/roster/' + data.rosterSettingId + '/lines/' + data.lineNumber + '/groups',
    method: 'post',
    data: data.rosterGroupVO
  })
}
// 表格渲染
export function detail(data) {
  return httpRequest({
    url: '/prepare/api/v1/rosters/' + data.rosterSettingVersionId + '/detail?employeeTypeId=' + data.id + '&name=' + data.name + '&code=' + data.code,
    method: 'get'
  })
}
// 表格上面员工查询
export function searchEmployees(data) {
  return httpRequest({
    url: '/prepare/api/v1/rosters/' + data.rosterSettingVersionId + '/employees/detail?employeeTypeId=' + data.id + '&name=' + data.name + '&code=' + data.code,
    method: 'get'
  })
}
// 员工查询
export function employees(data) {
  return httpRequest({
    url: '/prepare/api/v1/roster/' + data.rosterSettingVersionId + '/employees?typeId=' + data.typeId + '&name=' + data.name + '&code=' + data.code,
    method: 'get'
  })
}
// 自动分配前的校验
export function automaticValidate(data) {
  return httpRequest({
    url: '/prepare/api/v1/roster/' + data.rosterSettingId + '/employeeCalenders/check',
    method: 'get'
  })
}
// 自动分配
export function automatic(data) {
  return httpRequest({
    url: '/prepare/api/v1/roster/' + data.rosterSettingId + '/employees',
    method: 'post'
  })
}
// 取消自动分配
export function cancelAuto(data) {
  return httpRequest({
    url: '/prepare/api/v1/roster/' + data.rosterSettingId + '/employees',
    method: 'DELETE'
  })
}
// 手动分配
export function drag(data) {
  return httpRequest({
    url: '/prepare/api/v1/roster/' + data.rosterSettingId + '/lines/' + data.lineNumber + '/employees',
    method: 'post',
    data
  })
}
// 手动分配取消
export function deletedrag(data) {
  return httpRequest({
    url: '/prepare/api/v1/roster/' + data.rosterSettingId + '/lines/' + data.lineNumber + '/employees',
    method: 'DELETE',
    data
  })
}
// 算法状态
export function algorithmStatuses() {
  return httpRequest({
    url: '/prepare/api/v1/workloadRosters/algorithmStatuses',
    method: 'get'
  })
}
// 重新计算
export function reCalculation(data) {
  return httpRequest({
    url: '/prepare/api/v1/algorithm/reCalculation',
    method: 'put',
    data
  })
}
// 停止计算接口
export function stopCalculate(data) {
  return httpRequest({
    url: '/prepare/api/v1/rosters/stop',
    method: 'post',
    data
  })
}
// 同步
export function employeeCalenders(data) {
  return httpRequest({
    url: '/prepare/api/v1/roster/' + data.rosterId + '/employeeCalenders',
    method: 'put',
    data
  })
}
// 添加模板排班表
export function subRosters(data) {
  return httpRequest({
    url: '/prepare/api/v1/patternRosters/' + data.id + '/subRosters?employeeTypeId=' + data.employeeTypeId + '&name=' + data.name,
    method: 'post',
    data
  })
}
// 删除模板排班表
export function delRosters(data) {
  return httpRequest({
    url: '/prepare/api/v1/patternRosters/' + data + '/subRosters',
    method: 'DELETE'
  })
}
// 生成模板排班表
export function makeRosters(data) {
  return httpRequest({
    url: '/prepare/api/v1/patternRosters/' + data.id + '/subRosters',
    method: 'put',
    data
  })
}
// 模板
export function addmode(data) {
  return httpRequest({
    url: '/prepare/api/v1/roster/cells/color?beginDate=' + data.beginDate + '&endDate=' + data.endDate,
    method: 'get',
    data
  })
}
// 基于模板的员工类型
export function moduleEmployeeType(data) {
  return httpRequest({
    url: '/prepare/api/v1/employeeTypes',
    method: 'get',
    data
  })
}
// 修改单元格
export function cells(data) {
  return httpRequest({
    url: '/prepare/api/v1/rosters/cells',
    method: 'put',
    data
  })
}

// copy基于工作量的排班表
export function previewData(data) {
  return httpRequest({
    url: '/prepare/api/v1/rosters/' + data.id + '/duplicate/preview',
    method: 'post',
    data
  })
}
// copy基于模板的排班表
export function modePreviewData(data) {
  return httpRequest({
    url: '/prepare/api/v1/rosters/' + data.id + '/duplicate/mode',
    method: 'post',
    data
  })
}
// 保存copy排班表
export function saveData(data) {
  return httpRequest({
    url: '/prepare/api/v1/rosters/' + data.id + '/duplicate',
    method: 'post',
    data
  })
}
// 删除一行排班表
export function deleteline(data) {
  return httpRequest({
    url: '/prepare/api/v1/rosters/line?rosterLine=' + data.rosterLine + '&rosterSettingId=' + data.rostersettingId,
    method: 'delete',
    data
  })
}
// 添加一行排班表
export function addline(data) {
  return httpRequest({
    url: '/prepare/api/v1/rosters/line?rosterSettingId=' + data.rostersettingId,
    method: 'post',
    data
  })
}
export function skillDataFcn(data) {
  return httpRequest({
    url: '/prepare/api/v1/rosters/employeeTypeSkill?id=' + data + '',
    method: 'get'
  })
}
// 资源查询
export function detailData(data) {
  return httpRequest({
    url: '/prepare/api/v1/rosters/' + data.rosterSettingVersionId + '/employees/detail/workDay?employeeTypeId=' + data.id,
    method: 'get'
  })
}
// 用餐列表
export function searchEatList(data) {
  return httpRequest({
    url: '/prepare/api/v1/rosters/mealTime/' + data.id,
    method: 'get'
  })
}
