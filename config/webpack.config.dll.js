/*
 * 1.配置webpack.config.dll.js
 * 2.执行 npm run dll
 * 3.根据入口自动配置webpack.config.base.js的webpack.DllReferencePlugin
 * 4.在index.html引入 <script src="./[name].dll.js"></script>
 * 参考：https://github.com/wlx200510/webpack4.x-learn/blob/master/build/webpack.dll.config.js
 * https://webpack.wuhaolin.cn/4%E4%BC%98%E5%8C%96/4-2%E4%BD%BF%E7%94%A8DllPlugin.html
 **/
'use strict'

const webpack = require('webpack');

const {
  join,
} = require('./utils')


module.exports = {
  mode:"production",
  entry:  {
    react:  [ 'react', 'react-dom', 'react-router-dom' ],
    polyfill: [ 'core-js/fn/object/assign', 'core-js/fn/promise' ],
  },
  output: {
    path: join("dist"),
    filename: '[name].dll.js',
    library: '_dll_[name]' //全局变量名，其他模块会从此变量上获取里面模块,_dll_防止全局变量冲突
  },
  plugins: [
    new webpack.DllPlugin({
      path: join('dist', '[name].manifest.json'), //manifest.json文件的输出路径，这个文件会用于后续的业务代码打包
      name: '_dll_[name]', //dll暴露的对象名，要跟output的library一样
    })
  ]
};
