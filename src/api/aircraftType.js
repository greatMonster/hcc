import request from '@/utils/request'

export function initTable() {
  return request({
    url: '/adm/basic/data/aircraft/type/find',
    method: 'get',
    params: {}
  })
}
export function add(data) {
  return request({
    url: '/adm/basic/data/aircraft/type/add',
    method: 'post',
    data
  })
}
export function remove(data) {
  return request({
    url: '/adm/basic/data/aircraft/type/remove',
    method: 'post',
    data
  })
}
export function set(data) {
  return request({
    url: '/adm/basic/data/aircraft/type/set',
    method: 'post',
    data
  })
}
