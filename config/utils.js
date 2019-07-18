/*
 * @Description: 抽离公共方法
 * @Author: hejilun
 * @Date: 2019-07-08 18:37:58
 * @LastEditors: hejilun
 * @LastEditTime: 2019-07-16 10:33:23
 */

'use strict'
const path = require("path");
const glob = require("glob");
const webpack= require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 根据模板生成html文件，实现html资源复用

const {
  rootPath,
} = require('./path');

const {
  NODE_ENV,
  entryDocName,
} = require('./config')

const isProd = NODE_ENV ==="production" ? true : false;

module.exports = {
  join,
  getEntry,
  getOutput,
  getUrlLoader,
  getHtmlWebpackPlugin,
  getDllReferencePlugin,
  getDefaultDevServerConfig,
}

/**
 * @description: 拼接路径,转相对路径为绝对路径
 * @param {string} relativePath 
 * @return {string} absolutePath
 */
function join(...relativePath) {
  return path.join(rootPath, ...relativePath)
}

/**
 * @description: 根据src的目录结构统一处理单入口和多入口
 * @return {string | object} webpack入口
 */
 function getEntry() {
  const singleEntryArr = glob.sync( join(`src/${entryDocName}.js`) );
  if(singleEntryArr.length) return `./src/${entryDocName}.js`;
  const multipeEntry = {};
  const multipleEntryArr = glob.sync( join(`src/*/${entryDocName}.js`) );
  multipleEntryArr.map(entry => {
    const entryName = entry.split('/src/')[1]
      .split(`/${entryDocName}.js`)[0];
      multipeEntry[entryName] = `./src/${entryName}/${entryDocName}.js`;
  })
  return multipeEntry;
 }


/**
 * @description: 打包存放目录配置，开发环境热更新和chunkhash冲突，所以不适用chunkhash
 * @return {object} 打包存放目录配置
 */ 
function getOutput() {
  return {
    publicPath: '/',
    path: join("dist"),
    filename: `js/[name]${isProd ? '[chunkhash:8]' : ''}.js`
  }
}

/**
 * @description: 处理字体和图片资源，对符合大小的文件转码成base64，减少请求
 * @param {string} 'img' | 'font'
 * @return {object} 对应的url-loader配置
 */
function getUrlLoader(type) {
  return {
    loader: "url-loader",
    options: {
      limit: 8 * 1024, // 单位 : 1B(Byte，字节) = 8b(bit, 位), 图片大小小于8KB时会自动转成 base64 码引用
      name: `${type}/[name].[ext]`, // 生成图片 | 字体的路径、名字
      context: join("src")
    }
  }
}

/**
 * @description: 处理（单 | 多入口）& （开发 | 生产环境）时的html-webpack-plugin插件配置
 * @param {string | object} 入口 
 * @return {array} html-webpack-plugin配置后的数组
 */
function getHtmlWebpackPlugin(entry) {
  const htmlWebpackPluginList = [];
  let entryNames = [];
  const isSingleEntry = typeof entry === 'string';
  isSingleEntry 
    ? entryNames.push(entryDocName)
    : entryNames = Object.keys(entry)
  entryNames.forEach(name => {
    const baseConfig = {
      template: join(`src/${name}.html`), //模板路径
      filename: `${name}.html`, //目标文件位置，以output下的path作为相对路径
      inject: true, //注入script标签到body底部，具体参考https://github.com/jantimon/html-webpack-plugin
      excludeChunks: entryNames.filter(n => n !== name) //允许跳过块
    }; 
    const prodConfig = {
      minify: { // 压缩html，参考https://github.com/kangax/html-minifier#options-quick-reference
        collapseWhitespace: true, // 移除空格
        removeComments: true, // 移除注释
      },
      chunksSortMode: 'dependency', // 根据依赖对块进行排序
    }
    htmlWebpackPluginList.push(
      new HtmlWebpackPlugin(
        isProd 
          ? Object.assign(baseConfig, prodConfig) 
          : baseConfig
      )
    )
  });  
  return htmlWebpackPluginList;
}


/**
 * @description: 自动引入动态库
 * @param {object} dllEntry 
 * @return {array} dllReferencePluginList
 */
function getDllReferencePlugin(dllEntry) {
  const dllReferencePluginList = [];
  dllEntry.forEach(dllEntryName => {
    dllReferencePluginList.push(
      new webpack.DllReferencePlugin({
        manifest:  require(`${rootPath}/dist/${dllEntryName}.manifest.json`)
      })
    )
  })
  return dllReferencePluginList;
}

/**
 * @description: 使用webpack-dev-server开启服务的wepack配置
 * @return {object} defaultDevServerConfig
 */
function getDefaultDevServerConfig() {
  const defaultDevServerConfig = {
    devServer: {
      host: '0.0.0.0',//可以使用ip访问
      contentBase: join("dist"), //配置DevServer HTTP服务器的文件根目录为静态文件根目录
      port: 2019,
      compress: true, // 服务器返回浏览器的时候是否启动gzip压缩
      hot: true, // 开启热更新配置第一步
      stats: { //用来控制编译的时候shell上的输出内容
        timings: true,
        modules: false,
        assets: false,
        entrypoints: false,
        assetsSort: 'field',
        builtAt: false,
        cached: false,
        cachedAssets: false,
        children: false,
        chunks: false,
        chunkGroups: false,
        chunkModules: false,
        chunkOrigins: false,
        performance: true,
        errors: true,
        warnings: true,
      },
    }
  }
  return defaultDevServerConfig;
}







