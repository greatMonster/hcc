import request from '@/utils/request'

export function initable(data) { // 安检通道基础数据
  return request({
    url: '/adm/securityBaseData/queryList?intlType=' + data.intlType + '&airportId=' + data.airportId,
    method: 'get',
    data
  })
}
// export function add(data) {
//   return request({
//     url: '/adm/securityBaseData/insertSelective',
//     method: 'post',
//     data
//   })
// }
export function remove(data) {
  return request({
    url: '/adm/securityBaseData/deleteByPrimaryKey?securityBaseDataId=' + data.securityBaseDataId,
    method: 'post',
    data
  })
}
export function set(data) {
  return request({
    url: '/adm/securityBaseData/updateByPrimaryKeySelective',
    method: 'post',
    data
  })
}
//  承运人
// export function carrier() {
//   return request({
//     url: '/adm/carrier/find',
//     method: 'get'
//   })
// }
// 甘特图 通道
export function securityList(data) {
  return request({
    url: '/adm/basic/data/security/select?siteId=' + data.siteId + '&region=' + data.region,
    method: 'get'
  })
}
// 甘特图 资源预测
export function Prediction(data) {
  return request({
    url: '/prepare/prediction/predictionAlgorithm?intlType=' + data.intlType + '&deskServiceType=' + data.deskServiceTypee + '&flag=' + data.flag + '&opeDate=' + data.opeDate + '&siteId=' + data.siteId + '&serviceType=' + data.serviceType,
    method: 'get'
  })
}
// 甘特图 重新计算
export function restart(data) {
  return request({
    url: '/rtm/dutyTask/securityAllocationAlgorithm',
    method: 'get'
  })
}
// 甘特图 通道 基础数据
export function initablegt() {
  return request({
    url: '/adm/securityAllocationBaseData/queryList?airportId=706',
    method: 'get'
  })
}
export function addgt(data) {
  return request({
    url: '/adm/securityAllocationBaseData/insertSelective',
    method: 'post',
    data
  })
}
// export function removegt(data) {
//   return request({
//     url: '/adm/securityAllocationBaseData/deleteByPrimaryKey?baseDataId=' + data.baseDataId,
//     method: 'post',
//     data
//   })
// }
export function setgt(data) {
  return request({
    url: '/adm/securityAllocationBaseData/updateByPrimaryKeySelective',
    method: 'post',
    data
  })
}
// 班组视图
export function ByEmployeeGroup(data) {
  return request({
    url: '/rtm/resourceGroup/selectByEmployeeGroupJoinSecurity?intlType=' + data + '&organizationId=8',
    method: 'get'
  })
}

// 基础数据
export function findall(data) {
  return request({
    url: '/adm/basic/data/security/find/all',
    method: 'get'
  })
}
export function securityset(data) {
  return request({
    url: '/adm/basic/data/security/set',
    method: 'post',
    data
  })
}
export function securityadd(data) {
  return request({
    url: '/adm/basic/data/security/add',
    method: 'post',
    data
  })
}
export function securityremove(data) {
  return request({
    url: '/adm/basic/data/security/remove',
    method: 'post',
    data
  })
}

