/*
 * @Description: 抽离公共的webpack配置--不区分环境
 * @Author: hejilun
 * @Date: 2019-06-05 09:25:56
 * @LastEditors: hejilun
 * @LastEditTime: 2019-07-16 10:06:41
 */

'use strict'
const dllConfig = require('../config/webpack.config.dll');
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 从js中抽离css，利用浏览器的缓存
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin'); // 基础库分离
const HappyPack = require('happypack'); //提高构建速度，参考https://www.jianshu.com/p/b9bf995f3712
const os = require('os');


const {
  rootPath,
} = require('./path');

const {
  getEntry,
  getOutput,
  join,
  getUrlLoader,
  getHtmlWebpackPlugin,
  getDllReferencePlugin,
} = require('./utils')

const {
  bundleAnalyzerReport,
} = require('./config');

const entry = getEntry(); //打包入口
const alias = require('./alias'); //别名
const dllEntry = Object.keys(dllConfig.entry); //动态链接库入口

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const baseConfig = {
  context: rootPath,
  entry,
  output: getOutput(),
  resolve: {
    // 定义的后缀列表进行文件查找
    extensions: [".js", ".jsx", ".json"],
    // require搜索路径
    modules: [
      join("src/"),
      join("node_modules"),
    ],
    // require路径简化
		alias
  },
  module: {
    rules:[
      {
        test: /\.jsx?$/,
        use: "babel-loader?cacheDirectory",
        include: join('src')
      },
      {
        test: /\.css$/,
        exclude:/node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          "postcss-loader"
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        exclude: /node_modules/,
        use: getUrlLoader('img')
      },
      {
				test: /\.(woff|woff2|eot|ttf)$/,
				exclude: /node_modules/,
				use: getUrlLoader('font')
			},
    ]
  },
  plugins: [
    ...getDllReferencePlugin(dllEntry),
    ...getHtmlWebpackPlugin(entry),
    new MiniCssExtractPlugin({
      //contenthash 保证只有当css文件本身发生变动时对应的hash才发生变化，与css文件所处的模块内容变化无关
      filename: 'css/[name].[contenthash].css',
      chunkFileName: 'css/[id].[contenthash].css'
    }),
    new HappyPack({
      id: 'happyBabel',  //处理哪类文件
      loaders: [{
        loader: 'babel-loader?cacheDirectory=true',
      }],
      threadPool: happyThreadPool, //共享进程池
      verbose: true, //允许输出日志
    }),
    new HtmlWebpackExternalsPlugin({ //基础库分离，如echarts，jquery， 百度地图api
      externals: [
        {
          module: 'echarts',
          entry: 'https://cdn.bootcss.com/echarts/4.2.0-rc.2/echarts-en.common.js',
          global: 'Echarts'
        }
      ]
    }),
  ]
}

if(bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; //可视化分析进行性能优化
  baseConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = baseConfig;