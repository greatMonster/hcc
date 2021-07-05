import httpRequest from '@/utils/http-request'
// 初始化查询基线类型
export function initTableData(data) {
  return httpRequest({
    url: '/rtm/api/v1/tasks/useRatio/list',
    method: 'post',
    data
  })
}