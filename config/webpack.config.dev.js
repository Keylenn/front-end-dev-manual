/*
* 开发环境webpack配置
* */

const  { baseConfig,join } = require("./webpack.config.base");
const merge = require("webpack-merge");
const webpack = require("webpack");

const devCofig = merge(baseConfig, {
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  devServer: {
    host: '0.0.0.0',//可以使用ip访问
    contentBase: join("dist"), //配置DevServer HTTP服务器的文件根目录为静态文件根目录
    port: 1223,
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
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin() // 开启热更新配置第二步
  ]
});

module.exports = devCofig;