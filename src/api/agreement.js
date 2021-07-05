import request from '@/utils/request'

export function initTable() {
  return request({
    url: '/adm/carrier/contract/find',
    method: 'get',
    params: {}
  })
}
export function add(data) {
  return request({
    url: '/adm/carrier/contract/add',
    method: 'post',
    data
  })
}
export function remove(data) {
  return request({
    url: '/adm/carrier/contract/remove',
    method: 'post',
    data
  })
}
export function set(data) {
  return request({
    url: '/adm/carrier/contract/set',
    method: 'post',
    data
  })
}
export function initSelect() {
  return request({
    url: '/adm/carrier/find',
    method: 'get',
    params: {}
  })
}
