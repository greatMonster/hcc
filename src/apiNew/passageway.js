import httpRequest from '@/utils/http-request'

export function initAirpot(data) {
  return httpRequest({
    url: '/basic/api/v1/airports?includeTerminals=' + data.includeTerminals,
    method: 'get',
    data
  })
}
// 查询
export function inintData(data) {
  return httpRequest({

    url: '/basic/api/v1/securityInspectionChannel?airportId=' + data.airportId + '&terminalId=' + data.terminalId + '&securityDomainId=' + data.securityDomainId,
    method: 'get'
  })
}
export function addDesk(data) {
  return httpRequest({

    url: 'basic/api/v1/airports/' + data.airportId + '/terminals/' + data.terminalId + '/securityInspectionChannel',
    method: 'post',
    data
  })
}
export function editDesk(data) {
  return httpRequest({
    url: 'basic/api/v1/securityInspectionChannel/' + data.id + '',
    method: 'put',
    data
  })
}
export function deleteData(id) {
  return httpRequest({
    url: 'basic/api/v1/securityInspectionChannel/' + id + '',
    method: 'delete'
  })
}
export function Dragfcn(data) {
  return httpRequest({
    url: '/basic/api/v1/securityInspectionChannel/change?id=' + data.id + '&weight=' + data.weight + '',
    method: 'put'
  })
}
export function selectData() {
  return httpRequest({
    url: '/basic/api/v1/serviceType/security',
    method: 'get'
  })
}
export function setSearchDesk(data) {
  return httpRequest({
    url: '/basic/api/v1/desks/' + data.deskId,
    method: 'get'
  })
}

