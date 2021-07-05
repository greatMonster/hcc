import request from '@/utils/request'

export function initData() {
  return request({
    url: 'adm/basic/data/shift/select/all',
    method: 'get'

  })
}
export function addDatafcn(data) {
  return request({
    url: 'adm/basic/data/shift/insert',
    method: 'post',
    data

  })
}
export function eitDatafcn(data) {
  return request({
    url: 'adm/basic/data/shift/update',
    method: 'post',
    data

  })
}
export function deleteDatafcn(data) {
  return request({
    url: 'adm/basic/data/shift/delete',
    method: 'post',
    data

  })
}
