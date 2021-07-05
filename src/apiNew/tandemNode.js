import httpRequest from '@/utils/http-request'

export function NodeData() {
  return httpRequest({
    url: '/rtm/api/v1/hubManager/guaranteeNode',
    method: 'get'

  })
}

export function initData() {
  return httpRequest({
    url: '/rtm/api/v1/hubManager/relatedNode',
    method: 'get'

  })
}
export function editData(data) {
  return httpRequest({
    url: '/rtm/api/v1/hubManager/relatedNode',
    method: 'put',
    data

  })
}
export function addData(data) {
  return httpRequest({
    url: '/rtm/api/v1/hubManager/relatedNode',
    method: 'POST',
    data

  })
}
export function remove(data) {
  return httpRequest({
    url: '/rtm/api/v1/hubManager/relatedNode/' + data,
    method: 'DELETE'

  })
}

