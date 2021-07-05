import request from '@/utils/request'
import httpRequest from '@/utils/http-request'

export function initTable(data) {
  return request({
    url: '/prepare/serviceStandard/serviceStandard/selectAll?businessDomainId=' + data.businessDomainId + '&airportId=' + data.airportId,
    method: 'get'
  })
}
export function selectEntireById(data) {
  return request({
    url: '/prepare/serviceStandard/selectEntireById?documentId=' + data.documentId + '&standardType=' + data.standardType,
    method: 'get'
  })
}

export function iniTree(data) {
  return request({
    url: '/prepare/serviceStandard/openServiceStandardByDocumentId/' + data.documentId,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/prepare/serviceStandard/serviceStandard/insert?businessDomainId=' + data.businessDomainId + '',
    method: 'put',
    data
  })
}
// 删除规则组
export function remove(data) {
  return request({
    url: '/prepare/serviceStandard/ruleGroup/deleteByGroupId?groupId=' + data,
    method: 'delete'
  })
}
export function set(data) {
  return request({
    url: '/prepare/serviceStandard/serviceStandard/update',
    method: 'post',
    data
  })
}

// 添加规则组
export function ruleGroup(data) {
  return request({
    url: '/prepare/serviceStandard/ruleGroup/add',
    method: 'put',
    data
  })
}
export function selectByGroupId(data) {
  return request({
    url: '/prepare/serviceStandard/ruleGroup/selectByGroupId?groupId=' + data.groupId,
    method: 'get'
  })
}
export function update(data) {
  return request({
    url: '/prepare/serviceStandard/ruleGroup/update',
    method: 'post',
    data
  })
}
// 添加规则
export function addRule(data) {
  return request({
    url: '/prepare/serviceStandard/rule/add',
    method: 'put',
    data
  })
}
export function addRuleupdate(data) {
  return request({
    url: '/prepare/serviceStandard/rule/update',
    method: 'post',
    data
  })
}
// 点击规则组查询
export function searchRule(data) {
  return request({
    url: '/prepare/serviceStandard/ruleGroup/selectByGroupId?groupId=' + data,
    method: 'get'
  })
}
// 点击查询规则
export function updateRule(data) {
  return request({
    url: '/prepare/serviceStandard/ruleGroup/update',
    method: 'post',
    data
  })
}
// 点击查询规则
export function updateRule2(data) {
  return request({
    url: '/prepare/ruleFilter/selectFilterOperatorByDateType/' + data,
    method: 'get'
  })
}

// 查询右下角任务
export function taskRule(ruleId) {
  return request({
    url: '/prepare/task/template/selectByRuleId/' + ruleId,
    method: 'get',
    ruleId
  })
}
// 查询右上角规则
export function selectByRuleId(ruleId) {
  return request({
    url: '/prepare/ruleFilter/selectByRuleId/' + ruleId,
    method: 'get',
    ruleId
  })
}
// 右上角add条件
export function addCondition(data) {
  return request({
    url: '/prepare/ruleFilter/add',
    method: 'PUT',
    data
  })
}

// 右下角填加任务
export function addRenWu(data) {
  return request({
    url: '/prepare/task/template/add',
    method: 'post',
    data
  })
}

// 右下角更新任务
export function update2(data) {
  return request({
    url: '/prepare/task/template/update',
    method: 'post',
    data
  })
}
// 右下角删除任务
export function deleteById(data) {
  return request({
    url: '/prepare/task/template/deleteById/' + data,
    method: 'post',
    data
  })
}
export function deletestand(data) {
  return request({
    url: '/prepare/serviceStandard/serviceStandard/deleteById/' + data,
    method: 'post',
    data
  })
}
// 左上角删除规则
export function deleteRuleById(data) {
  return request({
    url: '/prepare/serviceStandard/rule/deleteRuleById?ruleId=' + data,
    method: 'delete'
  })
}
// 查询
export function search(data) {
  return httpRequest({
    url: '/api/v1/prepare/serviceStandard/serviceStandard/' + data.name + '?businessDomainId=' + data.businessDomainId + '&airportId=' + data.airportId,
    method: 'get'
  })
}
// 拖拽
export function changeRuleOrder(data) {
  return httpRequest({
    url: '/api/v1/prepare/serviceStandard/rule/changeRuleOrder/',
    method: 'put',
    data
  })
}
export function flightPlanData(data) {
  return httpRequest({
    url: '/prepare/api/v1/flightPlan/all?airportId=' + data.airportId,
    method: 'get'

  })
}

export function ValidityFcn(data) {
  return httpRequest({
    url: 'prepare/api/v1/workloads/standards/validate?standardDocumentId=' + data.standardDocumentId + '&flightDocumentId=' + data.flightDocumentId + '&fromDate=' + data.fromDate + '&toDate=' + data.toDate,
    method: 'get'
  })
}

export function dateData(data) {
  return httpRequest({
    url: 'prepare/api/v1/flightPlan/dates/' + data,
    method: 'get'
  })
}

// 复制
export function copyFunc(data) {
  return httpRequest({
    url: 'prepare/api/v1/standards/' + data.standardId + '/copy?copiedName=' + data.standardName,
    method: 'POST'
  })
}
