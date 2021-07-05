import request from '@/utils/request'
import httpRequest from '@/utils/http-request'

// 站点下拉
export function siteIdList() {
  return request({
    url: '/adm/system/setting/site/find',
    method: 'get'
  })
}

// 技能下拉
export function skillIdList(data) {
  return request({
    url: '/adm/basic/data/skill/select?organizationId=' + data.orgnization + '&businessDomainId=' + data.businessDomainId + '&airportId=' + data.airportId,
    method: 'get'
  })
}

// 角色下拉
export function roleIdList(data) {
  return request({
    url: '/adm/basic/data/role/select?airportId=' + data.airportId,
    method: 'get'
  })
}

// 组织下拉初始化
export function orgList(data) {
  return request({
    url: '/adm/basic/data/organization/select?businessDomainId=' + data.businessDomainId + '&airportId=' + data.airportId,
    method: 'get'
  })
}

// 页面初始化
// export function initTable() {
//   return request({
//     url: '/prepare/employeeCalendar/select/by/skillId?skillId=324',
//     method: 'get'
//   })
// }

// 查询接口
export function searchTable(data) {
  return httpRequest({
    url: '/prepare/api/v1/employees/calendars?businessDomainId=' + data.businessDomainId + '&airportId=' + data.airportId,
    method: 'post',
    data
  })
}
export function searchShiftCount(data) {
  return httpRequest({
    url: '/prepare/api/v1/employees/calendars/stats',
    method: 'post',
    data
  })
}
// 设置基线
export function setBaselineButton(data) {
  return httpRequest({
    url: '/prepare/api/v1/baseline',
    method: 'post',
    data
  })
}

// 比较基线
export function compareBaselineButton(data) {
  return httpRequest({
    url: '/prepare/api/v1/getBaseline',
    method: 'post',
    data
  })
}
// 换班人员下拉
export function shiftPerson(data) {
  return httpRequest({
    url: '/prepare/api/v1/employees/exchanges/rest?date=' + data.date + '&skillId=' + data.skillId + '' + '&airportId=' + data.airportId,
    method: 'get',
    data
  })
}
// 换班人员的下次轮班时间
// export function shiftTime(data) {
//   return request({
//     url: '/prepare/employeeCalendar/select/next/workBean?employeeId=' + data.employeeId + '&date=' + data.date,
//     method: 'get',
//     data
//   })
// }

// 换班确认接口
export function shiftTimeConfirm(data) {
  return httpRequest({
    url: '/prepare/api/v1/employees/exchanges',
    method: 'post',
    data
  })
}

// 设置为休息前的校验
export function restManagementCheck(data) {
  return httpRequest({
    url: 'prepare/api/v1/employees/calendars/cover/check?employeeCode=' + data.employeeCode + '&day=' + data.day + '&airportId=' + data.airportId,
    method: 'get',
    data
  })
}
// 休息 状态 管理 接口
export function restManagement(data) {
  return httpRequest({
    url: '/prepare/api/v1/employees/calendars/' + data.id + '',
    method: 'put',
    data
  })
}

// 缺勤 类型 下拉接口
export function absenceTypeList(data) {
  return request({
    url: '/adm/basic/data/absence/select/all?airportId=' + data.airportId,
    method: 'get',
    data
  })
}

// 缺勤  新增接口
export function absenceManagement(data) {
  return httpRequest({
    url: '/prepare/api/v1/employees/absences',
    method: 'post',
    data
  })
}

// 缺勤   查询详情接口
export function modifyView(data) {
  return httpRequest({
    url: '/prepare/api/v1/employees/absences/' + data.id + '' + '?airportId=' + data.airportId,
    method: 'get',
    data
  })
}

// 缺勤    修改接口
export function modifyViewConfirm(data) {
  return httpRequest({
    url: '/prepare/api/v1/employees/absences/' + data.id + '',
    method: 'PUT',
    data
  })
}

// 缺勤    删除接口
export function deleteAbsence(data) {
  return httpRequest({
    url: '/prepare/api/v1/employees/absences/' + data.id + '' + '?airportId=' + data.airportId,
    method: 'DELETE'
  })
}

// 轮班时间编辑确认接口
export function workTimeConfirm(data) {
  return httpRequest({
    url: '/prepare/api/v1/employees/calendars/' + data.id + '',
    method: 'put',
    data
  })
}
export function teamData(data) {
  return httpRequest({
    url: '/prepare/api/v1/calendar/group',
    method: 'post',
    data
  })
}

// 批量删除
export function multipleDelete(data) {
  return httpRequest({
    url: '/prepare/api/v1/employees/calendars',
    method: 'delete',
    data
  })
}
