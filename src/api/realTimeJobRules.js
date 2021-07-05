import request from '@/utils/request'
import httpRequest from '@/utils/http-request'
export function initData(data) {
  return request({
    url: 'rtm/taskServiceStandard/getServiceStandard/' + data + '',
    method: 'get'
  })
}
export function selectData(data) {
  return request({
    url: 'adm/basic/data/workType/select?airportId=' + data.airportId,
    method: 'get'
  })
}
export function ruleGroup(data) {
  return request({
    url: 'rtm/taskServiceStandard/addRuleGroup',
    method: 'post',
    data
  })
}
export function addRule(data) { // 增加规则
  return request({
    url: 'rtm/taskServiceStandard/addRule',
    method: 'post',
    data
  })
}
// 点击规则组查询子规则
export function searchRule(data) {
  return request({
    url: 'rtm/taskServiceStandard/getRuleGroup/' + data + '',
    method: 'get'
  })
}
// 修改规则名
export function updateRule(data) {
  return request({
    url: 'rtm/taskServiceStandard/editRule',
    method: 'post',
    data
  })
}
// 修改规则名
export function updateRules(data) {
  return request({
    url: 'rtm/taskServiceStandard/editRuleGroup',
    method: 'post',
    data
  })
}
export function updateRule2() {
  return request({
    url: 'rtm/TaskRuleFilter/selectAllFilterOperator',
    method: 'get'
  })
}
export function initTable(data) {
  return request({
    url: 'rtm/TaskRuleFilter/selectAllAttributeByCategory/' + data + '',
    method: 'get'
  })
}
export function addCondition(data) {
  return request({
    url: 'rtm/TaskRuleFilter/addRuleFilter',
    method: 'post',
    data
  })
}
export function selectByRuleId(data) {
  return request({
    url: 'rtm/TaskRuleFilter/getRuleFilterByRuleId/' + data + '',
    method: 'get'
  })
}
export function taskRule(data) {
  return httpRequest({
    url: 'rtm/api/v1/rules/ruleTaskTemplates/' + data.ruleId + '?airportId=' + data.airportId,
    method: 'get'
  })
}
export function selectTskeTpe(data) {
  return request({
    url: 'adm/basic/data/taskType/select/workType/' + data.ruleId + '?airportId=' + data.airportId,
    method: 'get'
  })
}
export function selectwokeType(data) {
  return request({
    url: 'adm/basic/data/RtTaskTemplate/query',
    method: 'post',
    data
  })
}
export function addWoke(data) {
  return request({
    url: 'rtm/taskServiceStandard/addRuleTaskTemplate?ruleId=' + data.ruleId + '&templateId=' + data.templateId + '' + '&airportId=' + data.airportId,
    method: 'get'
  })
}
export function remove(data) {
  return request({
    url: 'rtm/taskServiceStandard/deleteRuleGroup/' + data + '',
    method: 'get'
  })
}
export function deleteRuleById(data) {
  return request({
    url: 'rtm/taskServiceStandard/deleteRule/' + data,
    method: 'get'
  })
}
export function removeWoke(data) {
  return request({
    url: 'rtm/taskServiceStandard/deleteRuleTaskTemplate?ruleId=' + data.ruleId + '&templateId=' + data.taskTemplateId + '',
    method: 'get'
  })
}
export function taskTypeData(data) {
  return httpRequest({
    url: 'rtm/api/v1/taskTemplates?taskTypeId=' + data.taskTypeId + '' + '&airportId=' + data.airportId,
    method: 'get'
  })
}
export function addDatafcn(data) {
  return httpRequest({
    url: 'rtm/api/v1/rules/ruleTaskTemplates/' + data.id + '',
    method: 'post',
    data
  })
}
export function delFcn(id) {
  return httpRequest({
    url: 'rtm/api/v1/rules/ruleTaskTemplates/' + id + '',
    method: 'delete'
  })
}
export function eitDatafcn(data) {
  return httpRequest({
    url: 'rtm/api/v1/rules/ruleTaskTemplates',
    method: 'put',
    data
  })
}
export function offonFcn(data) {
  return httpRequest({
    url: 'rtm/api/v1/workStandards/' + data + '/activation',
    method: 'post'
  })
}
export function changeFcn(data) {
  return httpRequest({
    url: '/prepare/api/v1/attributeTypes/selectAttributeTypeByCode?attributeCode=' + data.attributeCode + '&airportId=' + data.airportId,
    method: 'get'
  })
}
