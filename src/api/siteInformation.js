import request from '@/utils/request'

export function select() {
  return request({
    url: '/adm/system/setting/site/find',
    method: 'get',
    params: {}
  })
}
export function add(data) {
  return request({
    url: '/adm/system/setting/site/add',
    method: 'post',
    data
  })
}
export function remove(data) {
  return request({
    url: '/adm/system/setting/site/remove',
    method: 'post',
    data
  })
}
export function set(data) {
  return request({
    url: '/adm/system/setting/site/set',
    method: 'post',
    data
  })
}
