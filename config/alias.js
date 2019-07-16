/*
 * @Description: 项目路径别名，用于简化搜索路径
 * @Author: hejilun
 * @Date: 2019-07-08 18:56:54
 * @LastEditors: hejilun
 * @LastEditTime: 2019-07-16 13:38:13
 */

'use strict'

const {
    join,
  } = require('./utils')

module.exports =  {
    utils: join('utils'),
    components: join('src/components'),
    assets: join('src/assets'),
}
