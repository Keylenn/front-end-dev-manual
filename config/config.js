/*
 * @Description: webpack的基础配置
 * @Author: hejilun
 * @Date: 2019-07-12 15:34:51
 * @LastEditors: hejilun
 * @LastEditTime: 2019-07-12 17:41:31
 */

'use strict'

//打包的入口文件名字
const ENTRY_DOCUMENT_NAME = 'index'

module.exports = {
    NODE_ENV: process.env.NODE_ENV, //当前环境（development | production）
    entryDocName: ENTRY_DOCUMENT_NAME,
    productionGzip: false, //是否开启gzip压缩
    bundleAnalyzerReport: process.env.npm_config_report, //是否开启可视化分析文件
}
