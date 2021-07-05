import request from '@/utils/request'

// 基础数据查询
export function initSet() {
  return request({
    url: '/adm/basic/data/seat/find',
    method: 'get'
  })
}
// 基础数据 编辑
export function edit(data) {
  return request({
    url: '/adm/basic/data/seat/edit',
    method: 'post',
    data
  })
}

// 基础数据 席位强度
export function type() {
  return request({
    url: '/adm/common/find/seat/type',
    method: 'get'
  })
}

// 基础数据 席位强度 查询
export function associatedType(data) {
  return request({
    url: '/adm/basic/data/seat/associated/find/type/' + data,
    method: 'get'
  })
}

// 基础数据 席位强度 add
export function add(data) {
  return request({
    url: '/adm/basic/data/seat/associated/add/',
    method: 'post',
    data
  })
}
// 基础数据 席位强度 set
export function set(data) {
  return request({
    url: '/adm/basic/data/seat/associated/set/',
    method: 'post',
    data
  })
}
// 基础数据 席位强度 remove
export function remove(data) {
  return request({
    url: '/adm/basic/data/seat/associated/remove/',
    method: 'post',
    data
  })
}
