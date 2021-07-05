import request from '@/utils/request'
// 站点 下拉框
export function site() {
  return request({
    url: '/adm/system/setting/site/find',
    method: 'get'
  })
}
// 排班 下拉框
export function getShiftType() {
  return request({
    url: '/prepare/adRule/getShiftType',
    method: 'get'
  })
}

// 航班计划 下拉框
export function flightoptions() {
  return request({
    url: '/document/query/document/byTypes?documentTypes=CYCLE_FLIGHT_SCHEDULE,DAY_FLIGHT_SCHEDULE',
    method: 'get'
  })
}

export function initTable(data) {
  return request({
    url: '/prepare/adRule/get/Rule/Documents?documentType=' + data.documentType,
    method: 'get'
  })
}
