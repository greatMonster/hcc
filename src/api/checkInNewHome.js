import request from '@/utils/http-request'

// 初始化参数组合
export function parameterList(data) {
  return request({
    url: '/prepare/api/v1/deskPredictions?airportId=' + data.airportId,
    method: 'get'
  })
}

// 初始化核心参数
export function initable(data) {
  return request({
    url: '/prepare/api/v1/deskPredictions/' + data.id + '?airportId=' + data.airportId,
    method: 'get',
    data
  })
}

// 图表结果
export function Prediction(data) {
  return request({
    url: '/prepare/api/v1/deskPredictions/' + data.id + '/result?showType=' + data.showType + '&beginDate=' + data.beginDate + '&endDate=' + data.endDate + '&airportId=' + data.airportId,
    method: 'get',
    data
  })
}
// 重新计算
export function reCalculate(data) {
  return request({
    url: '/prepare/api/v1/deskPredictions/' + data.id + '/calc',
    method: 'post',
    data
  })
}
export function stopClick(data) {
  return request({
    url: '/prepare/api/v1/deskPredictions/' + data.id + '/stop',
    method: 'post',
    data
  })
}

