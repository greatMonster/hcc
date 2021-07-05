import httpRequest from '@/utils/http-request'

// 初始化查询基线类型
export function workTypeData() {
  return httpRequest({
    url: '/rtm/api/v1/hubManager/findAllWorkType',
    method: 'get'

  })
}
export function taskTypeData(data) {
  return httpRequest({
    url: '/rtm/api/v1/hubManager/findTask',
    method: 'POST',
    data
  })
}
export function initData() {
  return httpRequest({
    url: '/rtm/api/v1/hubManager/findAllGuaranteedNode',
    method: 'get'

  })
}
export function editData() {
  return httpRequest({
    url: '/rtm/api/v1/hubManager/updateGuaranteedNode',
    method: 'put'

  })
}
export function addData(data) {
  return httpRequest({
    url: '/rtm/api/v1/hubManager/addGuaranteedNode',
    method: 'POST',
    data

  })
}
export function remove(data) {
  return httpRequest({
    url: '/rtm/api/v1/hubManager/deleteGuaranteedNode/' + data,
    method: 'DELETE'

  })
}

