import request from '@/utils/request'

// 轮班计划
export function shiftPlan() {
  return request({
    url: '/prepare/cover/shiftPlan',
    method: 'get'
  })
}
export function roster() {
  return request({
    url: '/prepare/cover/roster',
    method: 'get'
  })
}
export function show(data) {
  return request({
    url: '/prepare/cover/show',
    method: 'post',
    data
  })
}
export function workload() {
  return request({
    url: '/prepare/cover/workload',
    method: 'get'
  })
}
export function change(data) {
  return request({
    url: '/prepare/cover/change',
    method: 'post',
    data
  })
}
