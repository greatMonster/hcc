import httpRequest from '@/utils/http-request'

export function initData(data) {
  return httpRequest({
    url: '/prepare/api/v1/security/passengerTraffics?airportId=' + data.airportId,
    method: 'get'
  })
}
export function initData2(data) {
  return httpRequest({
    url: '/prepare/api/v1/security/passengerTraffics?ids=' + data.id + '' + '&airportId=' + data.airportId,
    method: 'get'
  })
}
export function addData(data) {
  return httpRequest({
    url: '/prepare/api/v1/security/passengerTraffics',
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
    url: 'prepare/api/v1/flightPlan/all?airportId=' + data.airportId,
    method: 'get'

  })
}
export function carriersData() {
  return httpRequest({
    url: '/prepare/api/v1/carriers?businessDomain=1' + '&nameOrCode=' + '',
    method: 'get'

  })
}
export function removeData(data) {
  return httpRequest({
    url: '/prepare/api/v1/security/passengerTraffics/' + data + '',
    method: 'delete'

  })
}
export function saveData(data) {
  return httpRequest({
    url: '/prepare/api/v1/security/passengerTraffics/' + data.id + '',
    method: 'put',
    data

  })
}
export function previewData(data) {
  return httpRequest({
    url: '/prepare/api/v1/security/passengerTraffics/preview',
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
    url: '/prepare/api/v1/flightPlan/dates/' + data.flightScheduleId + '' + '?airportId=' + data.airportId,
    method: 'get'
  })
}
