/*
* 生产环境webpack配置
* */
const  baseConfig = require("./webpack.config.base");
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 打包前清空打包目录的插件@v3.0.0
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); //优化压缩css
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); //压缩js
const merge = require("webpack-merge");

const {
  rootPath,
} = require('./path');

const {
  productionGzip,
} = require('./config');




const prodConfig = merge(baseConfig, {
  mode: "production",
  performance: { //webpack 性能提示，当文件大小超过 250kb 时的提示方式
    hints: 'warning'
  },
  /**
   * 生产环境公共代码分离，利用webpack4内置的SplitChunksPlugin，具体参考文档https://webpack.js.org/plugins/split-chunks-plugin/
   * chunks：async，异步引入的库进行分离（默认）| initial，同步引入的库进行分离 | all，所有库
   * minChunks：模块的最小被引用次数
   * priority：缓存组的优先级
   * enforce：忽略splitChunks.minSize，splitChunks.minChunks，splitChunks.maxAsyncRequests和splitChunks.maxInitialRequests选项，只为这个高速缓存组创建块
   * reuseExistingChunk：如果当前块包含已从主束拆分的模块，则将重用它而不是生成新的块。这可能会影响块的结果文件名
   * runtimeChunk：单独打包分离的公共代码，避免hash变更导致缓存失效
   */
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial', 
          name: 'vendors',
          minChunks: typeof baseConfig.entry === 'string' ? 1 : 2,
          priority: -10,
          enforce: true
        },
        common: {
          chunks: 'initial',
          name: 'common',
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        },
        styles: {
          test: /\.css$/,
          chunks: 'all',
          name: 'styles',
          minChunks: 2,  
          enforce: true, 
          reuseExistingChunk: true    
        }
      }
    },
    runtimeChunk: { name: 'manifest' },
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
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!*.dll.js', '!*.manifest.json' ], //不清除动态依赖库
    })
  ]
});

if(productionGzip) {
  /*
  * 需要在服务器开启gzip，参考https://segmentfault.com/q/1010000012377236
  * 文件很大才开启： 原因参考https://cloud.tencent.com/developer/article/1047637
  * */
  const CompressionPlugin = require("compression-webpack-plugin"); //开启gzip压缩
  prodConfig.plugins.push(
    new CompressionPlugin({
      filename: '[path].gz[query]', //目标资源名称,[path] 会被替换成原资源路径，[query] 替换成原查询字符串
      algorithm: 'gzip',
      test: /\.(js|css)/,
      threshold: 10 * 1024, //只处理比这个值大的资源
      minRatio: 0.8 //只有压缩率比这个值小的资源才会被处理
    })
  ); 
}


module.exports = prodConfig;