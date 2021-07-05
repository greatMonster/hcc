/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
// export function validateEmail(email) {
//   const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//   return re.test(email)
// }

/* 验证pad还是pc*/
export const vaildatePc = function() {
  const userAgentInfo = navigator.userAgent
  const Agents = ['Android', 'iPhone',
    'SymbianOS', 'Windows Phone',
    'iPad', 'iPod']
  let flag = true
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false
      break
    }
  }
  return flag
}

/**
 * 判断身份证号码
 */
export function cardid(code) {
  const list = []
  let result = true
  let msg = ''
  var city = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外 '
  }
  if (!validatenull(code)) {
    if (code.length === 18) {
      if (!code || !/(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(code)) {
        msg = '证件号码格式错误'
      } else if (!city[code.substr(0, 2)]) {
        msg = '地址编码错误'
      } else {
        // 18位身份证需要验证最后一位校验位
        code = code.split('')
        // ∑(ai×Wi)(mod 11)
        // 加权因子
        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
        // 校验位
        var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2, 'x']
        var sum = 0
        var ai = 0
        var wi = 0
        for (var i = 0; i < 17; i++) {
          ai = code[i]
          wi = factor[i]
          sum += ai * wi
        }
        if (parity[sum % 11] !== code[17]) {
          msg = '证件号码校验位错误'
        } else {
          result = false
        }
      }
    } else {
      msg = '证件号码长度不为18位'
    }
  } else {
    msg = '证件号码不能为空'
  }
  list.push(result)
  list.push(msg)
  return list
}
/**
 * 判断手机号码是否正确
 */
export function validatePhone(rule, value, callback) {
  var isPhone = /^(10[0-9]|13[0-9]|14[1456789]|15[0-3,5-9]|16[6]|17[01235678]|18[0-9]|19[89])\d{8}$/
  if (value !== '') {
    if (value.length === 11) {
      if (!isPhone.test(value)) {
        callback(new Error('手机号码格式不正确'))
      } else {
        callback()
      }
    } else {
      callback(new Error('手机号码长度不为11位'))
    }
  } else {
    callback(new Error('手机号码不能为空'))
  }
}
// 验证为正整数并且保留小数点后两位

export function validatefloat2(rule, value, callback) {
  var float2 = /^-?\d+\.?\d{0,2}$/
  if (value.toString().length > 10) {
    callback(new Error('数值长度不能超过10位'))
  } else if (!float2.test(value)) {
    callback(new Error('请保留两位小数'))
  } else {
    callback()
  }
  // if (value !== '') {
  //   if (float2.test(value)) {
  //     if (number.test(value)) {
  //       callback()
  //     } else {
  //       callback(new Error('请保留两位小数点'))
  //     }
  //   } else {
  //     callback(new Error('请输入正确的数值'))
  //   }
  // } else {
  //   callback(new Error('内容不能为空'))
  // }
}
// 验证开票税号==================
export function validateTaxlist(rule, value, callback) {
  var taxlist = /^[a-zA-Z0-9]+$/
  if (value !== '') {
    if (taxlist.test(value)) {
      if (value.length === 15 || value.length === 18) {
        callback()
      } else {
        callback(new Error('开票税号长度必须为15位或18位'))
      }
    } else {
      callback(new Error('开票税号只能输入数字或字母'))
    }
  } else {
    callback(new Error('开票税号不能为空'))
  }
}
// 验证名称为字母数字以及汉字，不能输入符号
export function validatecan(rule, value, callback) {
  var can = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/
  if (value !== '') {
    if (can.test(value)) {
      callback()
    } else {
      callback(new Error('请输入中文、字母或数字'))
    }
  } else {
    callback(new Error('内容不能为空'))
  }
}
// 不是必填项 验证名称为字母数字以及汉字，不能输入符号

export function validatecanNo(rule, value, callback) {
  var can = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/
  if (value !== '') {
    if (can.test(value)) {
      callback()
    } else {
      callback(new Error('请输入中文、字母或数字'))
    }
  } else {
    callback()
  }
}

// 验证账号为：字母数字或下划线
export function validateID(rule, value, callback) {
  var userid = /^\w+$/
  if (value !== '') {
    if (userid.test(value)) {
      callback()
    } else {
      callback(new Error('请输入字母、数字或下划线'))
    }
  } else {
    callback(new Error('输入不能为空'))
  }
}
// 验证账号为：数字;
export function validatenumber(rule, value, callback) {
  var number = /^[0-9]*$/
  if (value !== '') {
    if (number.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的数值'))
    }
  } else {
    callback(new Error('输入内容不能为空'))
  }
}
export function validatetel(rule, value, callback) {
  var tel = /^[0-9\-]*$/
  if (tel.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的数值'))
  }
}
// 验证邮箱为正确邮箱地址
export function validateEmail(rule, value, callback) {
  var email = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{1,3}$/
  if (value !== '') {
    if (email.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的邮箱地址'))
    }
  } else {
    callback(new Error('邮箱地址不能为空'))
  }
}
// 验证密码规范输入5-30位
export function validatepwd(rule, value, callback) {
  var pwd = /^[a-zA-Z0-9_\/]{5,30}$/
  if (value !== '') {
    if (value.length >= 5) {
      if (pwd.test(value)) {
        callback()
      } else {
        callback(new Error('请输入字母、数字或下划线'))
      }
    } else {
      callback(new Error('密码长度在5-30之间'))
    }
  } else {
    callback(new Error('用户密码不能为空'))
  }
}
// 验证禁止输入非法字符
export function NoSpecialChara(rule, value, callback) {
  var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%]")
  var result = value.match(pattern)
  if (!result) {
    callback()
  } else {
    callback(new Error())
  }
}
/**
 * 判断姓名是否正确
 */
export function validatename(name) {
  var regName = /^[\u4e00-\u9fa5]{2,4}$/
  if (!regName.test(name)) return false
  return true
}
/**
 * 判断是否为整数
 */
export function validatenum(num, type) {
  let regName = /[^\d.]/g
  if (type === 1) {
    if (!regName.test(num)) return false
  } else if (type === 2) {
    regName = /[^\d]/g
    if (!regName.test(num)) return false
  }
  return true
}

/**
 * 判断是否为小数
 */
export function validatenumord(num, type) {
  let regName = /[^\d.]/g
  if (type === 1) {
    if (!regName.test(num)) return false
  } else if (type === 2) {
    regName = /[^\d.]/g
    if (!regName.test(num)) return false
  }
  return true
}
/**
 * 判断是否为空
 */
export function validatenull(val) {
  if (val instanceof Array) {
    if (val.length === 0) return true
  } else if (val instanceof Object) {
    if (JSON.stringify(val) === '{}') return true
  } else {
    if (val === 'null' || val == null || val === 'undefined' || val === undefined || val === '') return true
    return false
  }
  return false
}

/**
* 英文名称的校验(必填)
* 只能输入英文和数字
 */
export function validateEnglishAndNum(rule, value, callback) {
  var reg = /^[a-zA-Z0-9]+$/
  if (value !== '') {
    if (!reg.test(value)) {
      callback(new Error('请输入字母或数字'))
    } else {
      callback()
    }
  } else {
    callback(new Error('请输入英文名称'))
  }
}
/**
* 英文名称的校验(非必填)
* 只能输入英文和数字
 */
export function validateEnglishAndNumNo(rule, value, callback) {
  var reg = /^[a-zA-Z0-9]+$/
  if (value !== '') {
    if (!reg.test(value)) {
      callback(new Error('请输入字母或数字'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
/**
* 中文名称的校验(非必填)
* 只能输入汉字、字母和数字
 */
export function validateChineseName(rule, value, callback) {
  var reg = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/
  if (value !== '') {
    if (!reg.test(value)) {
      callback(new Error('请输入字母或数字'))
    } else {
      callback()
    }
  } else {
    callback(new Error('请输入中文名称'))
  }
}
/**
* 航班号校验
* 只能输入英文和数字
 */

export function validateFlightNo(rule, value, callback) {
  var reg = /^[a-zA-Z0-9]+$/
  if (value !== '') {
    if (!reg.test(value)) {
      callback(new Error('请输入字母或数字'))
    } else {
      callback()
    }
  } else {
    callback(new Error('请输入航班号'))
  }
}
/**
* 机型校验
* 只能输入英文和数字
 */
export function validateAirModel(rule, value, callback) {
  var reg = /^[a-zA-Z0-9]+$/
  if (value !== '') {
    if (!reg.test(value)) {
      callback(new Error('请输入字母或数字'))
    } else {
      callback()
    }
  } else {
    callback(new Error('请输入机型'))
  }
}
/**
 * 验证机场代码
* 只能输入大写字母
 */
export function airportCode3(rule, value, callback) {
  var reg = /^[A-Z]+$/
  if (value !== '') {
    if (!reg.test(value)) {
      callback(new Error('请输入大写字母'))
    } else {
      callback()
    }
  } else {
    callback(new Error('请输入机场三字码'))
  }
}
/**
* 只能输入大写字母
 */
export function validateCapital(rule, value, callback) {
  var reg = /^[A-Z]+$/
  if (value !== '') {
    console.log('=====', value)
    if (!reg.test(value)) {
      callback(new Error('请输入大写字母'))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
/**
* 只能输入字母和数字
 */
export function validateLetterAndNum(rule, value, callback) {
  var reg = /^[a-zA-Z0-9]+$/
  if (!reg.test(value)) {
    callback(new Error('请输入字母或数字'))
  } else {
    callback()
  }
}
/**
* 只能输入大写字母和数字
 */
export function validateCapitalAndNum(rule, value, callback) {
  var reg = new RegExp(/^[A-Z0-9]+$/)
  if (!reg.test(value)) {
    callback(new Error('请输入大写字母或数字'))
  } else {
    callback()
  }
}
/**
 * 校验经验
* 只能输入汉字和数字
 */
export function validateExperience(rule, value, callback) {
  var reg = new RegExp(/^[0-9\u4e00-\u9fa5]+$/)
  if (value !== undefined) {
    if (!reg.test(value)) {
      callback(new Error('请输入中文和数字'))
    } else {
      callback()
    }
  } else {
    callback(new Error('请输入经验'))
  }
}
/**
 * 校验人数
* 只能输入汉字和数字
 */
export function validateNumOfPeople(rule, value, callback) {
  var reg = new RegExp(/^[0-9\u4e00-\u9fa5]+$/)
  if (value !== undefined) {
    if (!reg.test(value)) {
      callback(new Error('请输入中文和数字'))
    } else {
      callback()
    }
  } else {
    callback(new Error('请输入人数'))
  }
}

