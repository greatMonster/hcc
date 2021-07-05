import request from '@/utils/request'

import httpRequest from '@/utils/http-request'
export function initData(data) {
  return request({
    url: 'adm/basic/data/arrival/find?terminalId=' + data.terminalId + '&airportId=' + data.airportId,
    method: 'get',
    data
  })
}
export function addDatafcn(data) {
  return request({
    url: 'adm/basic/data/arrival/add',
    method: 'post',
    data

  })
}
export function eitDatafcn(data) {
  return request({
    url: 'adm/basic/data/arrival/set',
    method: 'post',
    data

  })
}
export function deleteDatafcn(data) {
  return request({
    url: 'adm/basic/data/arrival/remove',
    method: 'post',
    data

  })
}

// 机坪下拉
export function apronData(data) {
  return httpRequest({
    url: 'basic/api/v1/adm/basic/data/apron?airportId=' + data.airportId,
    method: 'get'

  })
}
