import request from '@/utils/request'
import httpRequest from '@/utils/http-request'

export function skill(data) {
  return request({
    url: '/adm/basic/data/skill/select?businessDomainId=' + data.bussinessDomainId + '&organizationId=' + data.organizationId + '&airportId=' + data.airportId,
    method: 'get'
  })
}
export function role(data) {
  return request({
    url: '/adm/basic/data/role/select?businessDomainId=' + data.bussinessDomainId + '&organizationId=' + data.organizationId + '&airportId=' + data.airportId,
    method: 'get'
  })
}
export function contract(data) {
  return request({
    url: '/adm/basic/data/contract/find?businessDomainId=' + data.businessDomainId + '&airportId=' + data.airportId,
    method: 'get'
  })
}
export function absence(data) {
  return request({
    url: '/adm/basic/data/absence/select/all?airportId=' + data.airportId,
    method: 'get'
  })
}
export function organization(data) {
  return request({
    url: '/adm/basic/data/organization/select?businessDomainId=' + data.businessDomainId + '&airportId=' + data.airportId,
    method: 'get'
  })
}
export function addEmployeeResource(data) { // add
  return httpRequest({
    url: '/rtm/api/v1/employees/info',
    method: 'post',
    data
  })
}
// export function selectAllByPage(data) { // init
//   return request({
//     url: '/rtm/employeeResource/selectAllByPage?pageNum=' + data.pageNum + '&pageSize=' + data.pageSize,
//     method: 'get'
//   })
// }
export function deleteEmployeeResource(data) { // del
  return httpRequest({
    url: '/rtm/api/v1/employees/info/' + data.code + '?airportId=' + data.airportId,
    method: 'DELETE'
  })
}
export function editEmployeeResource(data) { // edit
  return httpRequest({
    url: '/rtm/api/v1/employees/info/' + data.code + '',
    method: 'put',
    data
  })
}
export function search(data, data1) { // search
  return httpRequest({
    url: '/rtm/api/v1/employees/info?organizationId=' + data1.department + '&name=' + data1.name + '&pageNum=' + data.pageNum + '&pageSize=' + data.pageSize + '&gender=' + data1.gender + '&phone=' + data1.phone + '&skillId=' + data1.skillId + '&roleId=' + data1.roleId + '&businessDomainId=' + data1.businessDomainId + '&airportId=' + data1.airportId,
    method: 'get'
  })
}
export function saveData(data) { // edit
  return httpRequest({
    url: '/rtm/api/v1/tasks/createSkillId',
    method: 'post',
    data
  })
}
export function searchData(data) {
  return httpRequest({
    url: '/rtm/api/v1/employees/info/' + data.code + '?airportId=' + data.airportId,
    method: 'GET'
  })
}
export function statusbtn(data) {
  return httpRequest({
    url: '/rtm/api/v1/employees/info/' + data.code + '?airportId=' + data.airportId,
    method: 'post',
    data
  })
}
export function prohibit(data) {
  return httpRequest({
    url: 'rtm/api/v1/employees/disable/' + data.code + '?airportId=' + data.airportId,
    method: 'get'
  })
}
export function remove(data) {
  return httpRequest({
    url: 'rtm/api/v1/employees/disable?id=' + data + '',
    method: 'DELETE'
  })
}
// 不可用校验接口
export function addDateCheck(data) {
  return httpRequest({
    url: 'rtm/api/v1/employees/disable/' + data.code + '/check?airportId=' + data.airportId,
    method: 'post',
    data
  })
}

// 不可用保存接口
export function addDate(data, id) {
  return httpRequest({
    url: 'rtm/api/v1/employees/disable/' + id + '?airportId=' + data.airportId,
    method: 'post',
    data
  })
}
