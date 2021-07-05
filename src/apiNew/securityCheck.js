import httpRequest from '@/utils/http-request'

// 初始化查询值机岛
export function initTable(data) {
  return httpRequest({
    url: '/basic/api/v1/securityDomain/selectAll?terminalId=' + data.terminalId + '&airportId=' + data.airportId,
    method: 'get',
    data
  })
}
// 修改接口
export function updateFcn(data) {
  return httpRequest({
    url: '/basic/api/v1/securityDomain/update',
    method: 'put',
    data
  })
}
export function addDataFcn(data) {
  return httpRequest({
    url: '/basic/api/v1/securityDomain/add',
    method: 'post',
    data
  })
}

export function removeData(data) {
  return httpRequest({
    url: '/basic/api/v1/securityDomain/delete/' + data.securityDomainId,
    method: 'DELETE'
  })
}
