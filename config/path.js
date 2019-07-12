/*
 * @Description: 项目的路径配置
 * @Author: hejilun
 * @Date: 2019-07-12 09:29:40
 * @LastEditors: hejilun
 * @LastEditTime: 2019-07-12 15:34:08
 */
'use strict'

const fs = require('fs')

/**
 * @description: 项目根目录(当前执行node命令时候的文件夹的绝对路径)
 * 区别于__dirname： __dirname是被执行的js 文件的地址 ——文件所在目录
 * 详情链接：https://www.cnblogs.com/tim100/p/6590733.html
 */
const rootPath = fs.realpathSync(process.cwd()) 

module.exports = {
  rootPath, // 项目根目录
}