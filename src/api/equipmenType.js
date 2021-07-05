import request from '@/utils/request'

export function select() {
  return request({
    url: '/adm/basic/data/aircraft/select',
    method: 'get',
    params: { }
  })
}
export function add(data) {
  return request({
    url: '/adm/basic/data/aircraft/add',
    method: 'post',
    data
  })
}
export function remove(data) {
  return request({
    url: '/adm/basic/data/aircraft/remove',
    method: 'post',
    data
  })
}
export function set(data) {
  return request({
    url: '/adm/basic/data/aircraft/set',
    method: 'post',
    data
  })
}
