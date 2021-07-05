import request from '@/utils/request'

// 查询接口
export function initTable(data) {
  return request({
    url: '/adm/basic/data/workType/select',
    method: 'get',
    params: { businessDomainId: data.id + '', airportId: data.airportId }
  })
}

// 新增接口
export function addData(data) {
  return request({
    url: '/adm/basic/data/workType/insert?businessDomainId=' + data.id + '',
    method: 'post',
    data
  })
}

// 修改接口
export function modifyData(data) {
  return request({
    url: '/adm/basic/data/workType/update',
    method: 'post',
    data
  })
}

// 删除
export function deleteData(data) {
  return request({
    url: '/adm/basic/data/workType/delete',
    method: 'post',
    data
  })
}
