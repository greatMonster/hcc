import httpRequest from '@/utils/http-request'

// 初始化查询值机岛
export function initTable(data) {
  return httpRequest({
    url: '/basic/api/v1/airports/' + data.airportId + '/islands?terminalId=' + data.terminalId,
    method: 'get',
    data
  })
}
// 修改接口
export function updateLand(data) {
  return httpRequest({
    url: '/basic/api/v1/airports/' + data.airportId + '/terminals/' + data.terminalId + '/islands/updateIsland',
    method: 'put',
    data
  })
}
