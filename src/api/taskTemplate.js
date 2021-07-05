import request from '@/utils/request'
import httpRequest from '@/utils/http-request'
export function initData(data) {
  return request({
    url: 'adm/basic/data/RtTaskTemplate/query',
    method: 'post',
    data
  })
}
export function addDatafcn(data) {
  return request({
    url: 'adm/basic/data/RtTaskTemplate/add',
    method: 'post',
    data

  })
}
export function wokeTpye(data) {
  return request({
    url: 'adm/basic/data/taskType/select',
    method: 'get',
    params: { airportId: data.airportId }
  })
}
export function findData(data) {
  return request({
    url: 'adm/carrier/billing/taskType?taskTypeId=' + data.tasktypeid + '' + '&airportId=' + data.airportId,
    method: 'get'

  })
}
export function skillData(data) {
  return httpRequest({
    url: '/basic/api/v1/taskTypes/skill?taskTypeId=' + data.tasktypeid + '' + '&airportId=' + data.airportId,
    method: 'get'

  })
}
export function subTaskData(data) {
  return request({
    url: 'adm/basic/data/RtSubTaskTemplate/findAll?taskTypeId=' + data.tasktypeid + '' + '&airportId=' + data.airportId,
    method: 'get'

  })
}
export function eitDatafcn(data) {
  return request({
    url: 'adm/basic/data/RtTaskTemplate/edit',
    method: 'post',
    data
  })
}
export function deleteDatafcn(data) {
  return request({
    url: 'adm/basic/data/RtTaskTemplate/del/' + data + '',
    method: 'get'
  })
}
