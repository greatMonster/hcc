import request from '@/utils/request'
import httpRequest from '@/utils/http-request'

export function byLoop() { // 校验接口 资源预算配制
  return request({
    url: '/prepare/shiftPlan/check/algorithmStatus/byLoop',
    method: 'get'
  })
}
export function shiftPlanWorkload(data) { //  渲染工作量接口
  return request({
    url: '/prepare/shiftPlan/select/shiftPlanWorkload/byDocumentId?shiftPlanDocumentId=' + data,
    method: 'get'
  })
}
// export function generateShiftPlan(data) { // 计算轮班计划接口
//   return request({
//     url: '/prepare/shiftPlan/insert/generateShiftPlan?shiftPlanName=' + data.shiftPlanName,
//     method: 'post',
//     data
//   })
// }
export function generateShiftPlan(data) { // 新版生成轮班计划接口
  return httpRequest({
    url: '/prepare/api/v1/shiftPlans?shiftPlanName=' + data.shiftPlanName + '&businessDomainId=' + data.id + '',
    method: 'post',
    data
  })
}
export function shiftPlanShift() { //  渲染轮班接口
  return request({
    url: '/prepare/shiftPlan/select/shiftPlanShift/byDocumentId',
    method: 'get'
  })
}
export function bySettingId(data) { // 查询轮班计划参数接口
  return httpRequest({
    url: '/prepare/api/v1/shiftPlanSettings/' + data,
    method: 'get'
  })
}

export function stop(data) { // 查询轮班计划参数接口
  return request({
    url: '/prepare/shiftPlan/interrupt/algorithmCalculating',
    method: 'get'
  })
}
