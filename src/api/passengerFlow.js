import httpRequest from '@/utils/http-request'

export function initData(data) {
  return httpRequest({
    url: '/prepare/api/v1/passengerTraffics',
    method: 'get',
    params: { airportId: data.airportId }
  })
}
export function initData2(data) {
  return httpRequest({
    url: '/prepare/api/v1/passengerTraffics?ids=' + data.id + '',
    method: 'get',
    params: { airportId: data.airportId }
  })
}
export function addData(data) {
  return httpRequest({
    url: '/prepare/api/v1/passengerTraffics',
    method: 'post',
    data
  })
}
// 根据承运人、日期及国际国内查航班数
export function flightSearch(data) {
  return httpRequest({
    url: '/prepare/api/v1/flightPlan/flightNums',
    method: 'post',
    data
  })
}
// 查总座位数
export function seatsSearch(data) {
  return httpRequest({
    url: '/prepare/api/v1/flightPlan/seatNums',
    method: 'post',
    data
  })
}
export function airportData() {
  return httpRequest({
    url: 'basic/api/v1/airports?includeTerminals=false',
    method: 'get'

  })
}
export function flightScheduleData(data) {
  return httpRequest({
    url: 'prepare/api/v1/flightPlan/all',
    method: 'get',
    params: { airportId: data.airportId }

  })
}
export function carriersData(data) {
  return httpRequest({
    url: '/prepare/api/v1/carriers?businessDomain=1&nameOrCode=' + data.nameOrCode + '',
    method: 'get',
    params: { airportId: data.airportId }
  })
}
export function carriersOptionsUrl(data) {
  return httpRequest({
    url: '/prepare/api/v1/flightPlan/carriers/' + data.detailId + '?nameOrCode=' + data.searchData + '',
    method: 'get',
    params: { airportId: data.airportId }
  })
}
export function removeData(data) {
  return httpRequest({
    url: '/prepare/api/v1/passengerTraffics/' + data + '',
    method: 'delete'

  })
}
export function saveData(data) {
  return httpRequest({
    url: '/prepare/api/v1/passengerTraffics/' + data.id + '',
    method: 'put',
    data

  })
}
// 航班波离港座位新接口
export function previewData(data) {
  return httpRequest({
    url: '/prepare/api/v1/passengerTraffics/allPreview',
    method: 'post',
    data
  })
}
export function previewDataEdit(data) {
  return httpRequest({
    url: '/prepare/api/v1/passengerTraffics/preview',
    method: 'post',
    data
  })
}
export function previewData1(data) {
  return httpRequest({
    url: '/prepare/api/v1/passengerTraffics/flights/preview?size=' + data.size + '',
    method: 'post',
    data
  })
}
export function previewData2(data) {
  return httpRequest({
    url: '/prepare/api/v1/passengerTraffics/flightSeats/preview?size=' + data.size + '',
    method: 'post',
    data
  })
}
export function timeData(data) {
  return httpRequest({
    url: '/prepare/api/v1/flightPlan/dates/' + data.flightScheduleId + '',
    method: 'get',
    params: { airportId: data.airportId }
  })
}

export function binomialData(data) {
  return httpRequest({
    url: 'prepare/api/v1/passengerTraffics/binomialCharts?beginTime=' + data.earlyArrival + '&endTime=' + data.lastArrival + '&peakTime=' + data.peakPoint + '',
    method: 'get'
  })
}
