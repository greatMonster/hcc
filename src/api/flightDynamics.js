import request from '@/utils/request'
import httpRequest from '@/utils/http-request'
export function initData(data) {
  return request({
    url: 'rtm/flightDynamic/getFlightDynamic',
    method: 'post',
    data
  })
}
export function selectData(data) {
  return request({
    url: 'rtm/flightDynamic/getSearchParam?startDate=' + data.startDate + '&endDate=' + data.endDate + '&airportId=' + data.airportId,
    method: 'get'
  })
}
// 航班性质
export function attributOptionsFcn(data) {
  return httpRequest({
    url: 'basic/api/v1/flightNature?flag=' + data,
    method: 'get'
  })
}
export function attributeFcn(data) {
  return httpRequest({
    url: 'api/v1/rtm/flightDynamic/findFlightDynamicById?id=' + data,
    method: 'get'
  })
}

export function SaveAttributeFcn(data) {
  return httpRequest({
    url: 'api/v1/rtm/flightDynamic/update',
    method: 'post',
    data
  })
}

export function searchOptionsUrl(data) {
  return httpRequest({
    url: '/prepare/api/v1/selectAttributeValues?typeId=' + data.typeId + '&query=' + data.query,
    method: 'get',
    data
  })
}
export function filterDataFCN(data) {
  return httpRequest({
    url: '/api/v1/rtm/flightDynamic/getSearchParam/getCarriers?startDate=' + data.startDate + '&endDate=' + data.endDate + '&nameOrCode=' + data.nameOrCode,
    method: 'get',
    data
  })
}
