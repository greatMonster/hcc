import httpRequest from '@/utils/http-request'

export function initTable(data) {
  return httpRequest({
    url: '/rtm/api/v1/hubManager?carrier=' + data.carrier + '&flightNo=' + data.flightNo + '&flightType=' + data.flightType + '&taskType=' + data.taskType + '&pageSize=' + data.pageSize + '&pageNum=' + data.pageNum + '&airportId=' + data.airportId,
    method: 'get'
  })
}
export function businessData() {
  return httpRequest({
    url: '/rtm/api/v1/hubManager/business',
    method: 'get'
  })
}
export function editBusinessData(data) {
  return httpRequest({
    url: '/rtm/api/v1/hubManager/business',
    method: 'put',
    data
  })
}
export function editRemark(data) {
  return httpRequest({
    url: '/rtm/api/v1/hubManager/remark',
    method: 'put',
    data
  })
}
export function initTask(data) {
  return httpRequest({
    url: '/rtm/api/v1/hubManager/NodeTask?flightId=' + data.flightId + '&flightNo=' + data.flightNo,
    method: 'get',
    data
  })
}
export function detailsData(data) {
  return httpRequest({
    url: 'rtm/api/v1/flightDynamics/' + data + '/display ',
    method: 'get'
  })
}
// 查看保证等级
export function leavelData(data) {
  return httpRequest({
    url: '/rtm/api/v1/ensure?ensureLevel=' + data.ensureLevel + '&beginTime=' + data.beginTime,
    method: 'get'
  })
}
export function EditleavelData(data) {
  return httpRequest({
    url: '/rtm/api/v1/ensure',
    method: 'post',
    data
  })
}
