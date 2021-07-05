import request from '@/utils/request'

export function initData() {
  return request({
    url: 'adm/basic/data/absence/select/all',
    method: 'get'

  })
}
export function addDatafcn(data) {
  return request({
    url: 'adm/basic/data/absence/insert',
    method: 'post',
    data
  })
}
export function eitDatafcn(data) {
  return request({
    url: 'adm/basic/data/absence/update',
    method: 'post',
    data

  })
}
export function deleteDatafcn(data) {
  return request({
    url: 'adm/basic/data/absence/delete',
    method: 'post',
    data

  })
}

