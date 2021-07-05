import httpRequest from '@/utils/http-request'
import request from '@/utils/http-request'

// 机场和航站楼信息
export function initAirpot(data) {
  return request({
    url: '/basic/api/v1/airports?includeTerminals=' + data.includeTerminals,
    method: 'get',
    data
  })
}
// 查询接口
export function initTable(data) {
  return httpRequest({
    url: '/basic/api/v1/unattended/' + data.airportId + '/findAllSkipPads',
    method: 'get'
  })
}

// 查询单个值守点详情
export function skipPadData(data) {
  return httpRequest({
    url: '/basic/api/v1/unattended/findSkipPadById/' + data.id + '/findAllMonitorPoint',
    method: 'get'
  })
}

// 查询业务领域id
export function searchDomainID(data) {
  return httpRequest({
    url: 'basic/api/v1/unattended/findBusinessDomains',
    method: 'get'
  })
}

// 添加单个值守点

export function addSkipPad(data) {
  return httpRequest({
    url: '/basic/api/v1/unattended/' + data.airportId + '/addSkipPad',
    method: 'post',
    data
  })
}
// 删除单个值守点

export function removeSkipPad(data) {
  return httpRequest({
    url: '/basic/api/v1/unattended/' + data.airportId + '/deleteSkipPadById/' + data.skipPadId,
    method: 'put',
    data
  })
}
// 添加单个监护点
export function addMonitorPoint(data) {
  return httpRequest({
    url: '/basic/api/v1/unattended/findSkipPadById/' + data.skipPadId + '/addMonitorPoint',
    method: 'post',
    data
  })
}
// 删除单个监护点
export function removePoint(data) {
  return httpRequest({
    url: '/basic/api/v1/unattended/findSkipPadById/' + data.skipPadId + '/deleteMonitorPointById/' + data.monitorPointId + '',
    method: 'put',
    data
  })
}
