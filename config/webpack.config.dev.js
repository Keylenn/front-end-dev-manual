/*
* 开发环境webpack配置
* */

const baseConfig = require("./webpack.config.base");
const webpack = require('webpack');
const merge = require("webpack-merge");

const {
  commission_server,
} = require('./config');

let config = {
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  plugins: [
    new webpack.HotModuleReplacementPlugin() // 开启热更新
  ]
}

//非自定制服务，添加webapck的devServer配置
if(!commission_server) {
  const { getDefaultDevServerConfig } = require('./utils');
  const defaultDevServerConfig = getDefaultDevServerConfig()
  config = merge(config, defaultDevServerConfig);
}

const devConfig = merge(baseConfig, config);

module.exports = devConfig;