import request from '@/utils/request'

export function initData() {
  return request({
    url: 'adm/basic/data/RtSubTaskTemplate/findAll',
    method: 'get'

  })
}
export function findData(data) {
  return request({
    url: 'adm/carrier/billing/taskType/' + data + '',
    method: 'get'

  })
}
export function wokeTpye() {
  return request({
    url: 'adm/basic/data/taskType/select',
    method: 'get'

  })
}
export function addDatafcn(data) {
  return request({
    url: 'adm/basic/data/RtSubTaskTemplate/add',
    method: 'post',
    data

  })
}
export function eitDatafcn(data) {
  return request({
    url: 'adm/basic/data/RtSubTaskTemplate/edit',
    method: 'post',
    data

  })
}
export function delDatafcn(data) {
  return request({
    url: 'adm/basic/data/RtSubTaskTemplate/delete/' + data.subTaskTemplateId + '',
    method: 'get'

  })
}
