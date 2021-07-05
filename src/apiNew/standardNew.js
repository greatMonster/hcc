import httpRequest from '@/utils/http-request'
import request from '@/utils/request'
//
// const uri = '/mock/5df322fb8f9ebe00203d551d/me'
// const uri = '/prepare/api/v1'
export function selectData(data) {
  return request({
    url: 'adm/basic/data/workType/select?businessDomainId=' + data.businessDomainId + '' + '&airportId=' + data.airportId,
    method: 'get'
  })
}
export function initTable(data) {
  return httpRequest({
    url: 'rtm/api/v1/workStandards?businessDomain=' + data.businessDomain + '&name=' + data.name + '&workTypeId=' + data.workTypid + '' + '&airportId=' + data.airportId,
    method: 'get'
  })
}
export function addTable(data) {
  return httpRequest({
    url: 'rtm/api/v1/workStandards?businessDomain=' + data.businessDomain + '',
    method: 'post',
    data
  })
}
export function editTable(data) {
  return httpRequest({
    url: 'rtm/api/v1/workStandards',
    method: 'put',
    data
  })
}
export function datileTable(data) {
  return httpRequest({
    url: 'rtm/api/v1/workStandards/' + data.id + '' + '?airportId=' + data.airportId,
    method: 'get'
  })
}
export function selectTask(data) {
  return httpRequest({
    url: 'basic/api/v1/taskTypes/' + data.workTypeId + '/workType?airportId=' + data.airportId,
    method: 'get'
  })
}
export function addTabs(data) {
  return httpRequest({
    url: 'rtm/api/v1/workStandards/' + data.id + '/taskTypes?ids=' + data.typeId + '&airportId=' + data.airportId,
    method: 'post',
    data
  })
}
export function removeTabs(data) {
  return httpRequest({
    url: 'rtm/api/v1/workStandards/taskTypes/' + data.id + '' + '?airportId=' + data.airportId,
    method: 'DELETE',
    data
  })
}
export function searchRules(data) {
  return httpRequest({
    url: 'rtm/api/v1/taskTypes/' + data.id + '/rules?airportId=' + data.airportId,
    method: 'get'
  })
}
export function addRule(data) {
  return httpRequest({
    url: 'rtm/api/v1/taskTypes/rules',
    method: 'post',
    data
  })
}
export function deleteRuleById(data) {
  return httpRequest({
    url: 'rtm/api/v1/taskTypes/rules/' + data + '',
    method: 'DELETE'
  })
}
export function removeData(data) {
  return httpRequest({
    url: 'rtm/api/v1/workStandards/' + data + '',
    method: 'DELETE'
  })
}

export function selectByRuleId(data) {
  return httpRequest({
    url: 'rtm/api/v1/rules/' + data.ruleId + '/ruleFilters?airportId=' + data.airportId,
    method: 'get'
  })
}

export function addCondition(data) {
  return httpRequest({
    url: 'rtm/api/v1/rules/' + data.ruleId + '/ruleFilters',
    method: 'post',
    data
  })
}
export function ValidityFcn2(data) {
  return httpRequest({
    url: 'rtm/api/v1/workStandards/validate?id=' + data.id + '' + '&airportId=' + data.airportId,
    method: 'get'
  })
}
