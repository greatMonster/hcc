import request from '@/utils/request'

// 查询接口
export function initTablePosition(data) {
  return request({
    url: '/adm/geography/location/find?geographyType=' + data.geographyType + '&airportId=' + data.airportId,
    method: 'get'
  })
}

// 分类
export function catagory() {
  return request({
    url: '/adm/common/find/location/Type',
    method: 'get'
  })
}

// 新增接口
export function addPositon(data) {
  return request({
    url: '/adm/geography/location/add',
    method: 'post',
    data
  })
}

// 修改接口
export function modifyPositon(data) {
  return request({
    url: '/adm/geography/location/set',
    method: 'post',
    data
  })
}

// 删除
export function deletePositon(data) {
  return request({
    url: '/adm/geography/location/remove?locationId=' + data.locationId,
    method: 'delete'
  })
}

// 距离页面查询接口
export function initTableDistance(data) {
  return request({
    url: '/adm/geography/distance/find?geographyType=' + data.geographyType + '&airportId=' + data.airportId,
    method: 'get',
    data
  })
}

// 距离添加接口
export function addDistance(data) {
  return request({
    url: '/adm/geography/distance/add',
    method: 'post',
    data
  })
}

// 距离修改接口
export function modifyDistance(data) {
  return request({
    url: '/adm/geography/distance/set',
    method: 'post',
    data
  })
}

// 距离删除接口
export function deleteDistance(data) {
  return request({
    url: '/adm/geography/distance/remove?distanceId=' + data.distanceId,
    method: 'delete'
  })
}

// 距离规则查询接口
export function initDistanceRules(data) {
  return request({
    url: '/adm/geography/distance/default/find?airportId=' + data.airportId,
    method: 'get',
    data
  })
}

// 距离规则添加接口
export function addDistanceRules(data) {
  return request({
    url: '/adm/geography/distance/default/add',
    method: 'post',
    data
  })
}

// 距离规则修改接口
export function modifyDistanceRules(data) {
  return request({
    url: '/adm/geography/distance/default/set',
    method: 'post',
    data
  })
}

// 所有距离查询接口
export function initAllDistance(data) {
  return request({
    url: '/adm/geography/distance/findAll?geographyType=' + data.geographyType,
    method: 'get',
    data
  })
}

// 所有距离计算接口
export function calculateAllDistance(data) {
  return request({
    url: '/adm/geography/distance/all?geographyType=' + data.geographyType,
    method: 'post',
    data
  })
}
export function defaultFcn(data) {
  return request({
    url: '/adm/geography/distance/default?geographyType=' + data.geographyType + '&airportId=' + data.airportId,
    method: 'get'
  })
}
export function addDefaultFcn(data) {
  return request({
    url: '/adm/geography/distance/default',
    method: 'put',
    data
  })
}
