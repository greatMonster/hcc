import request from '@/utils/request'

export function initTable() {
  return request({
    url: '/adm/carrier/find',
    method: 'get',
    params: {}
  })
}
export function add(data) {
  return request({
    url: '/adm/carrier/add',
    method: 'post',
    data
  })
}
export function remove(data) {
  return request({
    url: '/adm/carrier/remove',
    method: 'post',
    data
  })
}
export function set(data) {
  return request({
    url: '/adm/carrier/set',
    method: 'post',
    data
  })
}
export function initSelect() {
  return request({
    url: '/adm/carrier/until',
    method: 'get',
    params: {}
  })
}

// 关联业务查询接口
export function initCorrelationTable() {
  return request({
    url: '/adm/carrier/businessDomains',
    method: 'get',
    params: {}
  })
}

// 关联业务启用接口
export function isUsed(data) {
  return request({
    url: '/adm/carrier/businessDomains',
    method: 'post',
    data
  })
}
