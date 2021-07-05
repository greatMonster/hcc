import request from '@/utils/request'

export function initList() {
  var now = new Date()
  var year = now.getFullYear() // 年
  var month = now.getMonth() + 1 // 月
  var day = now.getDate() // 日
  month = month < 10 ? ('0' + month) : month
  day = day < 10 ? ('0' + day) : day
  var time = year.toString() + '-' + month.toString() + '-' + day.toString()
  return request({
    url: '/prepare/task/realTask/selectTaskByDay?Day=' + time,
    method: 'get',
    params: { }
  })
}
