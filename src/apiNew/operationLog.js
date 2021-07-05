import httpRequest from '@/utils/http-request'

// 查询
export function initData(data) {
  return httpRequest({
    url: '/prepare/api/v1/log?userName=' + data.userName + '&name=' + data.name + '&startTime=' + data.startTime + '&endTime=' + data.endTime + '&pageSize=' + data.pageSize + '&pageNum=' + data.pageNum,
    method: 'get'
  })
}