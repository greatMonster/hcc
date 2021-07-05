import httpRequest from '@/utils/http-request'

export function NodeData() {
  return httpRequest({
    url: '/rtm/api/v1/hubManager/guaranteeNode',
    method: 'get'

  })
}

export function initData() {
  return httpRequest({
    url: '/rtm/api/v1/hubManager/findAllGuaranteedTemplates',
    method: 'get'

  })
}
export function editData(data) {
  return httpRequest({
    url: '/rtm/api/v1/hubManager/updateGuaranteedTemplates',
    method: 'put',
    data

  })
}
export function addData(data) {
  return httpRequest({
    url: '/rtm/api/v1/hubManager/addGuaranteedTemplates',
    method: 'POST',
    data

  })
}
export function remove(data) {
  return httpRequest({
    url: '/rtm/api/v1/hubManager/deleteGuaranteedTemplates/' + data,
    method: 'DELETE'

  })
}

