/**
 * 用于 WebStorm 识别 Webpack 配置（比如根据 Alias 跳转至定义或引用）
 */

'use strict'
const vueConfig = require('./vue.config')

module.exports = vueConfig.configureWebpack
