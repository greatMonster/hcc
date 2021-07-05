import httpRequest from '@/utils/http-request'
// 初始化查询基线类型
export function initTable(data) {
  return httpRequest({
    url: '/basic/api/v1/baselineType',
    method: 'get',
    data
  })
}
export function addBaseline(data) {
  return httpRequest({
    url: '/basic/api/v1/baselineType',
    method: 'post',
    data
  })
}
export function editBaseline(data) {
  return httpRequest({
    url: '/basic/api/v1/baselineType',
    method: 'put',
    data
  })
}
export function deleteBaseline(data) {
  return httpRequest({
    url: '/basic/api/v1/baselineType?id=' + data.id,
    method: 'delete',
    data
  })
}

