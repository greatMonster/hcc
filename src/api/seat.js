import request from '@/utils/request'

export function initData() {
  return request({
    url: '/rtm/seat/task/find',
    method: 'get'
  })
}
export function addseat() { // 生成席位下拉选择
  return request({
    url: '/rtm/seat/flight/get',
    method: 'get'
  })
}

export function makeSeat(data) { // 生成席位
  return request({
    url: '/rtm/seat/algorithm/make?documentId=' + data.documentId + '&date=' + data.date + '&ToDate=' + data.ToDate,
    method: 'post'
  })
}
