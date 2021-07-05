import request from '@/utils/request'
import httpRequest from '@/utils/http-request'
export function initTable() {
  return request({
    url: '/prepare/flightSchedule/select/all/flightDocuments',
    method: 'get'
  })
}
export function goto(byDocumentid) {
  return request({
    url: '/prepare/search/legs/' + byDocumentid,
    method: 'get'
  })
}
export function remove(id) {
  return request({
    url: '/prepare/flightSchedule/delete/ByDocumentId?documentId=' + id,
    method: 'post'
  })
}

export function search(data) {
  return request({
    url: '/prepare/flightSchedule/' + data,
    method: 'get'
  })
}

export function upload(data) {
  return request({
    url: '/prepare/cycleFlightPlan/import',
    method: 'post',
    data
  })
}
export function initTable2(data) {
  return httpRequest({
    url: '/rtm/api/v1/getFlights?documentId=' + data.documentId + '&carrier=' + data.carrier + '&flightNo=' + data.flightNo + '&acType=' + data.acType + '',
    method: 'get'
  })
}
export function selectData(data) {
  return httpRequest({
    url: '/rtm/api/v1/getAcTypeAndCarrier?documentId=' + data + '',
    method: 'get'
  })
}
export function initTableNew(data) {
  return httpRequest({
    url: 'prepare/api/v1/flightSchedule/list?name=' + data.name + '&documentType=' + data.documentType + '&check=' + data.check + '&airportId=' + data.airportId,
    // url: 'prepare/api/v1/flightSchedule/list?check=' + data.check + '',
    method: 'get'
  })
}

export function selectData2(data) {
  return httpRequest({
    url: 'basic/api/v1/airports?includeTerminals=false',
    method: 'get'
  })
}
export function editflightScheduleName(data) {
  return httpRequest({
    url: 'prepare/api/v1/flightSchedule//list/update',
    method: 'post',
    data
  })
}
