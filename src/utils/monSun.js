export const produceMonSun = (num) => {
  // 使用时：
  // var Stamp
  // Stamp = new Date()
  // 例如var num1 = 7 - Stamp.getDay() + 1 周一
  // 然后将num值传进来即可计算并输出未来一周任一天的日期

  var Stamp
  Stamp = new Date()
  Stamp.setDate(Stamp.getDate() + num)
  var year = Stamp.getFullYear() // 获取完整的年份(4位,1970-????)
  var month = Stamp.getMonth() + 1 // 获取当前月份(0-11,0代表1月)
  var mvar = ''
  if (month < 10) {
    mvar = '0' + month
  } else {
    mvar = month + ''
  }
  var day = Stamp.getDate()
  var dvar = ''
  if (day < 10) {
    dvar = '0' + day
  } else {
    dvar = day + ''
  }
  var date = year + '-' + mvar + '-' + dvar
  return date
}
