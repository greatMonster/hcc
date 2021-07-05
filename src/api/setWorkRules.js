import request from '@/utils/request'
import httpRequest from '@/utils/http-request'

// export function initTable(data) { // 规则文件列表查询
//   return request({
//     url: '/prepare/adRule/get/Rule/Documents?documentType=' + data.documentType,
//     method: 'get'
//   })
// }
export function initTable(data) { // 出勤规则文件列表查询
  return httpRequest({
    url: 'prepare/api/v1/ruleSets?documentType=' + data.documentType + '&businessDomain=' + data.id + '',
    method: 'get'
  })
}
// export function initNewTable(data) { // 新版规则文件列表查询
//   return request({
//     url: '/prepare/workload/get/documents',
//     method: 'get'
//   })
// }
export function initNewTable(data) { // 新版工作量文件列表查询
  return httpRequest({
    url: 'prepare/api/v1/workloads?businessDomainId=' + data + '',
    method: 'get'
  })
}
export function addDocument(data) { // 规则文件新建
  return request({
    url: 'prepare/adRule/addDocument',
    method: 'post',
    data
  })
}
export function updateDocument(data) { // 编辑文件名
  return request({
    url: 'prepare/adRule/updateDocument?documentId=' + localStorage.documentId,
    method: 'post',
    data
  })
}
export function deleteDocument(data) { // 删除文件
  return request({
    url: 'prepare/adRule/deleteDocument?documentId=' + data,
    method: 'get'
  })
}
// tree
export function iniTree(data) {
  return request({
    url: '/prepare/adRule/get/employeeTypes/byDocumentId?documentId=' + data.documentId,
    method: 'get'
  })
}
// 全局树
export function contract(data) {
  return request({
    url: '/prepare/adRule/get/adrules?documentId=' + data.documentId + '&contractId=' + data.id + '&employeeTypeId=' + data.employeeTypeId,
    method: 'get'
  })
}
// 添加员工
export function addEmployee(data) {
  return request({
    url: '/prepare/adRule/get/employeeTypes/exceptRule?documentId=' + data.documentId,
    method: 'get'
  })
}
// 添加规则
export function addRule(data) {
  return request({
    url: '/prepare/adRule/search/ruleTemplates?documentId=' + data.documentId + '&contractId=' + data.id + '&employeeTypeId=' + data.employeeTypeId,
    method: 'get'
  })
}
// 添加员工类型
export function addEmployee2(data) {
  var documentId = localStorage.documentId
  return request({
    url: '/prepare/adRule/add/empType?documentId=' + documentId,
    method: 'post',
    data
  })
}
// 规则保存
// export function insertRuleSet(data) {
//   var documentId = localStorage.documentId
//   return request({
//     url: '/prepare/adRule/insertRuleSet?documentId=' + documentId,
//     method: 'post',
//     data
//   })
// }

// 规则删除
export function delete2(data) {
  return request({
    url: '/prepare/adRule/deleteEmpType?documentId=' + data.documentId + '&EmpId=' + data.EmpId,
    method: 'post',
    data
  })
}

// 保存新添规则
export function insertRuleArg(data) {
  return request({
    url: '/prepare/adRule/insertRuleArg?documentId=' + localStorage.documentId + '&contractId=' + localStorage.contractTypeId + '&employeeTypeId=' + localStorage.employeeTypeId,
    method: 'post',
    data
  })
}

// 删除
export function deleteruleId(data) {
  return request({
    url: '/prepare/adRule/delete?ruleId=' + data,
    method: 'post'
  })
}

// 继承
export function coverAndInherit(data) {
  return request({
    url: '/prepare/adRule/coverAndInherit?documentId=' + localStorage.documentId + '&contractId=' + data.contractId + '&templateId=' + data.templateId,
    method: 'post'
  })
}
// 规则模板
export function getAlltemplates() {
  return request({
    url: '/prepare/adRule/getAlltemplates',
    method: 'get'
  })
}
export function addGroup(data) {
  return request({
    url: '/prepare/adRule/addGroup',
    method: 'post',
    data
  })
}
export function getGroupTemplateInfo() { // 查询
  return request({
    url: '/prepare/adRule/getGroupTemplateInfo',
    method: 'get'
  })
}
export function updateGroup(data) { // 修改
  return request({
    url: '/prepare/adRule/updateGroup',
    method: 'post',
    data
  })
}
export function delteGroupTemplateById(data) { // 删除规则
  return request({
    url: '/prepare/adRule/delteGroupTemplateById?groupTempId=' + data.groupTempId,
    method: 'post'
  })
}
export function delteGroup(data) { // 删除组
  return request({
    url: '/prepare/adRule/delteGroup',
    method: 'post',
    data
  })
}

// 添加规则222
// export function addRule(data) {
//   return request({
//     url: '/prepare/adRule/search/ruleTemplates?documentId=' + data.documentId + '&contractId=' + data.id + '&employeeTypeId=' + data.employeeTypeId,
//     method: 'get'
//   })
// }
