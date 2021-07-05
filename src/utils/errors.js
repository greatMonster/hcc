/**
 * 从 Error 对象中获取可用于展示的消息
 * @param error Error 对象
 * @returns {string} 错误消息
 */
function getMessage(error) {
  let message = '未知错误，请稍候重试'
  if (error.response) {
    if (error.response.data) {
      const data = error.response.data
      message = data.message || data
    }
    message += ` (${error.response.status})`
  } else if (error.message) {
    message = error.message
  }
  return message
}

module.exports = { getMessage }
