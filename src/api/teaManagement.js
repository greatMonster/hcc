import request from '@/utils/request'

export function skill(data) {
  return request({
    url: '/adm/basic/data/skill/select?businessDomainId=' + data.businessDomainId + '&organizationId=' + data.organizationId,
    method: 'get',
    data
  })
}
// 角色
export function roleOptions(data) {
  return request({
    url: 'adm/basic/data/role/findRoleBySkillId/' + data.id,
    method: 'get',
    data
  })
}
export function workType(data) {
  return request({
    url: 'adm/basic/data/workType/select?businessDomainId=' + data.businessDomainId + '&organizationId=' + data.organizationId + '&airportId=' + data.airportId,
    method: 'get',
    data
  })
}
export function organization(data) {
  return request({
    url: '/adm/basic/data/organization/select?businessDomainId=' + data.businessDomainId + '&airportId=' + data.airportId,
    method: 'get'
  })
}
export function sendTeamData(data) {
  return request({
    url: '/rtm/resourceGroup/insertEmployeeGroup',
    method: 'post',
    data
  })
}
export function initData(data) {
  return request({
    url: '/rtm/resourceGroup/selectEmployeeAllGroup',
    method: 'post',
    data
  })
}
export function personnelData(data) {
  return request({
    url: 'rtm/resourceGroup/employeeGroupAddibleEmployee?employeeGroupId=' + data.employeeGroupId + '&organizationId=' + data.organizationId + '',
    method: 'post',
    data
  })
}
export function editTeamData(data) {
  return request({
    url: 'rtm/resourceGroup/editEmployeeGroup',
    method: 'post',
    data
  })
}
export function addPersonnel(data) {
  return request({
    url: '/rtm/resourceGroup/updateEmployeeGroupEmployee',
    method: 'post',
    data
  })
}
export function isLeader(data) {
  return request({
    url: 'rtm/resourceGroup/setLeader?groupLeader=' + data.groupLeader + '&employeeGroupId=' + data.employeeGroupId + '',
    method: 'get'
  })
}
export function removedata(data) {
  return request({
    url: 'rtm/resourceGroup/delEmployeeGroup?employeeGroupId=' + data.employeeGroupId + '',
    method: 'get'
  })
}
export function sendoffon(data) {
  return request({
    url: 'rtm/resourceGroup/employeeTemporarilyTransfer?employeeId=' + data.employeeId + '&employeeGroupId=' + data.employeeGroupId + '',
    method: 'get'
  })
}
export function automatic(data) {
  return request({
    url: 'rtm/resourceGroup/employeeGroupAutoAddEmployee',
    method: 'post',
    data
  })
}
