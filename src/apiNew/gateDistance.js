import httpRequest from '@/utils/http-request'

/*
  创建区域页面
  */
// 创建区域页面初始化table
export function areaInitable(data) {
  return httpRequest({
    url: '/basic/api/v1/area?airportId=' + data.airportId + '&areaName=' + data.areaName,
    method: 'get',
    data
  })
}
// 创建区域页面新增区域接口
export function addArea(data) {
  return httpRequest({
    url: '/basic/api/v1/area',
    method: 'post',
    data
  })
}
// 创建区域页面修改区域接口
export function updateArea(data) {
  return httpRequest({
    url: '/basic/api/v1/area',
    method: 'put',
    data
  })
}
// 创建区域页面删除区域接口
export function deleteArea(data) {
  return httpRequest({
    url: '/basic/api/v1/area?areaId=' + data.areaId,
    method: 'delete',
    data
  })
}

/*
  区域间距离页面
*/
// 区域间距离页面初始化table
export function regionInitable(data) {
  return httpRequest({
    url: '/basic/api/v1/areaDistance?airportId=' + data.airportId + '&name=' + data.name,
    method: 'get',
    data
  })
}
// 区域间距离页面新增区域接口
export function addRegion(data) {
  return httpRequest({
    url: '/basic/api/v1/areaDistance',
    method: 'post',
    data
  })
}
// 区域间距离页面修改区域接口
export function updateRegion(data) {
  return httpRequest({
    url: '/basic/api/v1/areaDistance',
    method: 'put',
    data
  })
}
// 区域间距离页面删除区域接口
export function deleteRegion(data) {
  return httpRequest({
    url: '/basic/api/v1/areaDistance?areaDistanceId=' + data.areaDistanceId,
    method: 'delete',
    data
  })
}

/*
  点间距离页面
*/
// 点间距离页面初始化table
export function dotInitable(data) {
  return httpRequest({
    url: '/basic/api/v1//gateDistance?airportId=' + data.airportId + '&name=' + data.name,
    method: 'get',
    data
  })
}
// 点间距离页面新增接口
export function addDot(data) {
  return httpRequest({
    url: '/basic/api/v1//gateDistance',
    method: 'post',
    data
  })
}
// 点间距离页面修改接口
export function updateDot(data) {
  return httpRequest({
    url: '/basic/api/v1//gateDistance',
    method: 'put',
    data
  })
}
// 点间距离页面删除接口
export function deleteDot(data) {
  return httpRequest({
    url: '/basic/api/v1//gateDistance?gateDistanceId=' + data.gateDistanceId,
    method: 'delete',
    data
  })
}
// 点间距离页面默认值查询
export function defaultValueSearch(data) {
  return httpRequest({
    url: '/basic/api/v1//gateDistance/default?airportId=' + data.airportId,
    method: 'get',
    data
  })
}
// 点间距离页面默认值设置
export function defaultValueSet(data) {
  return httpRequest({
    url: '/basic/api/v1/gateDistance/default',
    method: 'put',
    data
  })
}
