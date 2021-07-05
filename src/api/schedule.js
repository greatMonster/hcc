import request from '@/utils/request'
import httpRequest from '@/utils/http-request'
// 向导
export function initSelect() { // 工作量
  return request({
    url: '/prepare/workload/findAll',
    method: 'get'
  })
}
export function initNewSelect() { // 工作量新版
  return request({
    url: '/prepare/workload/get/documents',
    method: 'get'
  })
}
export function adRule(data) { // 规则
  return request({
    url: '/prepare/adRule/get/Rule/Documents?documentType=' + data.data,
    method: 'get'
  })
}
export function documentWorkloadId(data) { // 员工类型
  return request({
    url: '/prepare/roster/employee/type?documentId=' + data,
    method: 'get'
  })
}
export function add(data) { // 向导提交
  return request({
    url: '/prepare/roster/version/add',
    method: 'post',
    data
  })
}

export function version(data) { // 向导查询
  return request({
    url: '/prepare/roster/version/find/all',
    method: 'get'
  })
}
// version/setting/find/{rosterSettingVersionId}
// version/find/{rosterSettingVersionId}
export function employeetype(data) { // 根据排班表查询员工类型
  return request({
    url: '/prepare/roster/version/setting/find/' + data,
    method: 'get'
  })
}
// export function initable(data) { // 渲染排班表
//   return request({
//     url: '/prepare/roster/empty/find?rosterSettingVersionId=' + data.rosterSettingVersionId + '&employeeTypeId=' + data.employeeTypeId,
//     method: 'get'
//   })
// }

export function initable(data) { // 渲染排班表
  return request({
    url: '/prepare/roster/version/find?rosterSettingVersionId=' + data.rosterSettingVersionId + '&employeeTypeId=' + data.employeeTypeId,
    method: 'get'
  })
}
export function select() { // 修改排班表
  return request({
    url: '/adm/basic/data/shift/select/all',
    method: 'get'
  })
}
export function note(data) { // 编辑排班表
  return request({
    url: '/prepare/roster/note',
    method: 'post',
    data
  })
}
export function make(data) { // 排班表配制
  return request({
    url: '/prepare/roster/algorithm/make',
    method: 'post',
    data
  })
}
export function Status() { // 算法计算
  return request({
    url: '/prepare/roster/check/algorithm/Status',
    method: 'get'
  })
}
export function all() { // 向导的查询
  return request({
    url: '/prepare/roster/version/find/all',
    method: 'get'
  })
}
export function remove(data) { // 向导的查询
  return request({
    url: '/prepare/roster/version/remove?rosterSettingVersionId=' + data.rosterSettingVersionId,
    method: 'post',
    data
  })
}
export function set(data) { // 向导的查询
  return request({
    url: '/prepare/roster/version/set',
    method: 'post',
    data
  })
}
export function cover(data) { // 排班表覆盖
  return request({
    url: '/prepare/rosterPlan/select/all/rosterPlanWorkload?rosterSettingVersionId=' + data,
    method: 'get'
  })
}
export function automatic(data) { // 自动分配
  return request({
    url: '/prepare/roster/employee/automatic?automaticId=' + data.employeeTypeId + '&rosterSettingId=' + data.rosterSettingId + '&strType=' + data.strType,
    method: 'post',
    data
  })
}
export function edit(data) { // 编辑
  return request({
    url: '/prepare/roster/employee/team/edit?line=' + localStorage.line + '&rosterSettingId=' + data.rosterSettingId + '&editId=' + data.editId + '&strType=' + data.strType,
    method: 'post',
    data
  })
}
export function removEmployee(data) { // 删除
  return request({
    url: '/prepare/roster/employee/team/remove?removeId=' + data.employeeGroupId + '&rosterSettingId=' + data.rosterSettingId + '&strType=' + data.strType,
    method: 'post',
    data
  })
}
export function UseRoster(data) { // 激活排班表
  return httpRequest({
    url: '/api/v1/prepare/roster/check/employee?rosterSettingId=' + data.rosterSettingId,
    method: 'post',
    data
  })
}
export function UnUseRoster(data) { // 激活
  return request({
    url: '/prepare/roster/UnUseRoster?rosterSettingId=' + data.rosterSettingId + '&employeeTypeId=' + data.employeeTypeId,
    method: 'post',
    data
  })
}

// 空排班表模式
export function selectEmployeeType2(data) {
  return request({
    url: '/rtm/resourceType/selectEmployeeType',
    method: 'get'
  })
}

// 空排班表模式
// 员工类型加载
export function selectEmployeeType(data) {
  return request({
    url: '/prepare/roster/employeeType/find?rosterSettingVersionId=' + data.rosterSettingVersionId,
    method: 'get'
  })
}
// addempty
export function addempty(data) {
  return request({
    url: '/prepare/roster/version/empty/add',
    method: 'post',
    data
  })
}
// 模板 add
export function addmode(data) {
  return request({
    url: '/prepare/roster/mode/add?rosterSettingId=' + data.rosterSettingId + '&startTime=' + data.startTime + '&endTime=' + data.endTime,
    method: 'post',
    data
  })
}
// 模板 set
export function setmode(data) {
  return request({
    url: '/prepare/roster/mode/set?rosterModeId=' + data.rosterModeId + '&startTime=' + data.startTime + '&endTime=' + data.endTime,
    method: 'post',
    data
  })
}
// 模板 remove
export function removemode(data) {
  return request({
    url: '/prepare/roster/mode/remove/' + data,
    method: 'post'
  })
}
// 模板排班表生成
export function emptyset(data) {
  return request({
    url: '/prepare/roster/empty/set',
    method: 'post',
    data
  })
}
// 后期模板排班添加员工类型
export function settingadd(data) {
  return request({
    url: '/prepare/roster/setting/add',
    method: 'post',
    data
  })
}
// 模板添加排班表
export function addsetting(data) {
  return request({
    url: '/prepare/roster/version/setting/add',
    method: 'post',
    data
  })
}
// 模板remove
export function removep(data) {
  return request({
    url: '/prepare/roster/version/setting/remove?rosterSettingId=' + data,
    method: 'post'
  })
}
export function seeWarning(data) {
  return request({
    url: 'prepare/roster/check/find?rosterCheckId=' + data,
    method: 'get'
  })
}
export function shiftType(data) {
  return request({
    url: 'prepare/roster/shiftType',
    method: 'get'
  })
}
export function name(data) {
  return request({
    url: 'prepare/roster/search/name?rosterSettingVersionId=' + data.rosterSettingVersionId + '&employeeTypeId=' + data.employeeTypeId + '&name=' + data.name + '&employeeCode=' + data.employeeCode,
    method: 'get'
  })
}
// 查询
export function search(data) {
  return request({
    url: '/prepare/roster/version/find/all?name=' + data,
    method: 'get'
  })
}
