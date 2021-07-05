import request from '@/utils/request'
import httpRequest from '@/utils/http-request'
// 查询接口
export function initTableTask(data) {
  return request({
    url: '/adm/basic/data/taskType/select',
    method: 'get',
    params: { businessDomainId: data.id + '', airportId: data.airportId }
  })
}
// 新增接口
export function addData(data) {
  return request({
    url: '/adm/basic/data/taskType/insert?businessDomainId=' + data.businessDomainId + '',
    method: 'post',
    data
  })
}
// 修改接口
export function modifyData(data) {
  return request({
    url: '/adm/basic/data/taskType/update',
    method: 'post',
    data
  })
}
// 删除
export function deleteData(data) {
  return request({
    url: '/adm/basic/data/taskType/delete',
    method: 'post',
    data
  })
}

export function skill(data) {
  return httpRequest({
    url: 'basic/api/v1/workTypes/skill?workTypeId=' + data.id + '' + '&airportId=' + data.airportId,
    method: 'get'
  })
}
