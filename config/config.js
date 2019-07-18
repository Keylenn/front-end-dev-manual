/*
 * @Description: webpack的基础配置
 * @Author: hejilun
 * @Date: 2019-07-12 15:34:51
 * @LastEditors: hejilun
 * @LastEditTime: 2019-07-18 17:07:46
 */

'use strict'

const colors = require( "colors");

//打包的入口文件名字
const ENTRY_DOCUMENT_NAME = 'index'

//用来控制编译的时候shell上的输出内容, 具体参考https://webpack.js.org/configuration/stats/#stats
const compilingStats = { 
    assetsSort: 'field',
    timings: true,
    performance: true,
    errors: true,
    warnings: true,
    colors: true,
    modules: false,
    assets: false,
    entrypoints: false,
    builtAt: false,
    cached: false,
    cachedAssets: false,
    children: false,
    chunks: false,
    chunkGroups: false,
    chunkModules: false,
    chunkOrigins: false,
    version: false,
    hash: false,
}

//自定义console主题
colors.setTheme({
    info: 'blue',
    warn: 'yellow',
    error: 'red',
    success: 'green',
    tip: 'grey',
});

module.exports = {
    NODE_ENV: process.env.NODE_ENV, //当前环境（development | production）
    entryDocName: ENTRY_DOCUMENT_NAME,
    productionGzip: false, //是否开启gzip压缩
    bundleAnalyzerReport: process.env.npm_config_report, //是否开启可视化分析文件
    commission_server: process.env.commission_server ? true : false, // 是否使用定制的devServer 
    compilingStats,
}
