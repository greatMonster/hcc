import request from '@/utils/request'

export function select(token) {
  return request({
    url: '/adm/carrier/billing/find',
    method: 'get',
    params: { token }
  })
}
export function add(data) {
  return request({
    url: '/adm/carrier/billing/add',
    method: 'post',
    data
  })
}
export function remove(data) {
  return request({
    url: '/adm/carrier/billing/remove',
    method: 'post',
    data
  })
}
export function set(data) {
  return request({
    url: '/adm/carrier/billing/set',
    method: 'post',
    data
  })
}
export function until(data) {
  return request({
    url: '/adm/carrier/billing/until',
    method: 'get',
    data
  })
}
