/*
 * 提交的时候记得提交dist下面的manifest.json 和 vendor.dll.js
 * 1.配置webpack.config.dll.js
 * 2.执行 webpack --config config/webpack.config.dll.js，可在package.json中设置scripts
 * 3.配置webpack.config.base.js的webpack.DllReferencePlugin
 * 4.在src/index.html引入 <script src="./vendor.dll.js"></script>
 * 参考：https://github.com/wlx200510/webpack4.x-learn/blob/master/build/webpack.dll.config.js
 * https://www.cnblogs.com/lusongshu/p/8473318.html
 **/
const webpack = require('webpack');
const path = require("path");
const { join } = require("./webpack.config.base");

const vendors = [ //需要使用动态链接的资源
  'react',
  'react-dom',
];

module.exports = {
  mode:"production",
  entry:  {
    vendor: vendors,
  },
  output: {
    path: join("dist"),
    filename: '[name].dll.js',
    library: '_dll_[name]' //全局变量名，其他模块会从此变量上获取里面模块
  },
  plugins: [
    new webpack.DllPlugin({
      context: path.resolve(__dirname, '../'), //解析包路径的上下文，这个要跟webpack.config.prod.js 的DllReferencePlugin一致
      path: join("dist/manifest.json"), //manifest.json文件的输出路径，这个文件会用于后续的业务代码打包
      name: '_dll_[name]', //dll暴露的对象名，要跟output的library一样
    })
  ]
};
