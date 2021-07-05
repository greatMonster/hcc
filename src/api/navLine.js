import request from '@/utils/request'

export function initData() {
  return request({
    url: 'adm/basic/data/flightLine/find',
    method: 'get'

  })
}
export function addDatafcn(data) {
  return request({
    url: 'adm/basic/data/flightLine/add',
    method: 'post',
    data

  })
}
export function eitDatafcn(data) {
  return request({
    url: 'adm/basic/data/flightLine/set ',
    method: 'post',
    data

  })
}
export function deleteDatafcn(data) {
  return request({
    url: 'adm/basic/data/flightLine/remove',
    method: 'post',
    data

  })
}
