/*
* 生产环境webpack配置
* */
const  { baseConfig, join } = require("./webpack.config.base");
const merge = require("webpack-merge");
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 打包前清空打包目录的插件
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); //优化压缩css
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); //压缩js
const CompressionPlugin = require("compression-webpack-plugin"); //开启gzip压缩

const prodConfig = merge(baseConfig, {
  mode: "production",
  performance: { //webpack 性能提示，当文件大小超过 250kb 时的提示方式
    hints: 'warning'
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        /*
         * 选项配置参考：https://blog.csdn.net/u013884068/article/details/83511343
         * https://www.cnblogs.com/tugenhua0707/p/9569762.html
         * */
        uglifyOptions: {
          output:{
            comments: false, //去注释
            beautify: false  //去美化
          },
          compress: {
            warnings: false, //不输出警告信息
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins:[
    new CleanWebpackPlugin(['dist'], {
      root: join(''),
      exclude: ['manifest.json', 'vendor.dll.js'],
      verbose: true, //将日志写入控制台
      dry:  false //删除文件
    }),
    /*
      * 需要在服务器开启gzip，参考https://segmentfault.com/q/1010000012377236
      * 文件很大才开启： 原因参考https://cloud.tencent.com/developer/article/1047637
      * */
    new CompressionPlugin({
      filename: '[path].gz[query]', //目标资源名称,[path] 会被替换成原资源路径，[query] 替换成原查询字符串
      algorithm: 'gzip',
      test: /\.(js|css)/,
      threshold: 10 * 1024, //只处理比这个值大的资源
      minRatio: 0.8 //只有压缩率比这个值小的资源才会被处理
    })
  ]
});

module.exports = prodConfig;