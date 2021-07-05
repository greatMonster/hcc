import request from '@/utils/http-request'

// 机场和航站楼信息
export function initAirpot(data) {
  return request({
    url: '/basic/api/v1/airports?includeTerminals=' + data.includeTerminals,
    method: 'get',
    data
  })
}

// 初始化页面
export function initData(data) {
  return request({
    url: '/basic/api/v1/airports/' + data.airportId + '/terminals/' + data.terminalId + '/islands?includeDesks=' + data.includeDesks,
    method: 'get',
    data
  })
}

// 新增值机岛
export function addIsland(data) {
  return request({
    url: '/basic/api/v1/airports/' + data.airportId + '/terminals/' + data.terminalId + '/islands',
    method: 'post',
    data
  })
}
// 删除值机岛
export function removeIsland(data) {
  return request({
    url: '/basic/api/v1/airports/' + data.airportId + '/terminals/' + data.terminalId + '/islands/' + data.islandId,
    method: 'delete',
    data
  })
}
// 添加柜台信息
export function addDesk(data) {
  return request({
    url: '/basic/api/v1/desks',
    method: 'post',
    data
  })
}
// 修改时查询当条信息
export function setSearchDesk(data) {
  return request({
    url: '/basic/api/v1/desks/' + data.deskId,
    method: 'get',
    data
  })
}
// 修改柜台信息
export function setDesk(data) {
  return request({
    url: '/basic/api/v1/desks/' + data.deskId,
    method: 'put',
    data
  })
}

// 删除柜台信息
export function removedesk(data) {
  return request({
    url: '/basic/api/v1/desks/' + data.deskId,
    method: 'delete',
    data
  })
}
export function Dragfcn(data) {
  return request({
    url: 'basic/api/v1/desks/change?id=' + data.id + '&weight=' + data.weight + '',
    method: 'put'
  })
}
export function selectData(data) {
  return request({
    url: '/basic/api/v1/serviceType/checkIn',
    method: 'get'
  })
}

