/*
* 抽离公共的webpack配置--不区分环境
* */
const NODE_ENV = process.env.NODE_ENV;
const isProd = NODE_ENV ==="production" ? true : false;

const path = require("path");
const webpack= require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin"); //根据模板生成html文件，实现html资源复用
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //从js中抽离css，利用浏览器的缓存
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; //可视化分析进行性能优化
const HappyPack = require('happypack'); //提高构建速度，参考https://www.jianshu.com/p/b9bf995f3712
const os = require('os');


const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const join = dir => path.join(__dirname, "..", dir); //定位路径到根目录（xxxx\\dev-demo-pc\\dir）

const getCssLoader = ()=> ({
  loader: "css-loader",
  options: { //配置参考：http://www.mamicode.com/info-detail-1752561.html
    alias: { //起别名
      "~sprite.png": join("src/assets/spritesmith/sprite.png")
    },
    /*
    *开启css-modules模式，详情及参考：http://www.ruanyifeng.com/blog/2016/06/css_modules.html
    * https://blog.csdn.net/xiangzhihong8/article/details/53195926
    **/
    modules: true,
    localIdentName: "[name]-[local]-[hash:base64:5]"//设置css-modules模式下local类名的命名（只会转换 class 名）
  }
});
const getUrlLoader = () => ({
  loader: "url-loader",
  options: {
    limit: 8 * 1024, // 单位 : 1B(Byte，字节) = 8b(bit, 位), 图片大小小于8KB时会自动转成 base64 码引用
    name: "[path][name].[ext]", //生成图片的路径、名字
    context: join("src")
  }
});
const getHtmlConfig = (name, title) => ({
  template: join(`src/${name}.html`), //模板路径
  filename: `${name}.html`, //目标文件位置，以output下的path作为相对路径
  title,
  inject:true, //script标签位于html文件的 body 底部
  hash: false, //给生成的 js 文件一个独特的 hash 值
  minify: { //压缩html，参考https://github.com/kangax/html-minifier#options-quick-reference
    collapseWhitespace: true, //移除空格
    removeComments: true, //移除注释
    useShortDoctype: true //使用HTML5doctype 替换
  }
});

const baseConfig = {
  context: path.resolve(__dirname, '../'),
  entry: "./src/index.js",
  output: {
    path: join("dist"),
    filename: "js/index.js"
  },
  resolve: { //缩小文件的搜索范围，参考：https://www.jianshu.com/p/7f48a21d8c5e
    modules: [ //避免层层查找
      join("src/"),
      join("node_modules"),
      join("src/assets/spritesmith")
    ],
    extensions: [".js", ".jsx", ".json"] //定义的后缀列表进行文件查找
  },
  externals: { //在index.html中直接引入cdn资源，如echarts，jquery， 百度地图api
    "echarts": "echarts"
  },
/*  optimization:{
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          name: 'vendors',
        },
        'async-vendors': {
          test: /[\\/]node_modules[\\/]/,
          minChunks: 2,
          chunks: 'async',
          name: 'async-vendors'
        },
        runtimeChunk: { name: 'manifest' }
      }
    }
  },*/
  module: {
    rules:[
      {
        test: /\.jsx?$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(scss|css)$/,
        exclude:/node_modules/, //只对自定义的css|scss文件开启css modules
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          getCssLoader(),
          "postcss-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.css$/,
        exclude:/src/, //解决开启css modules第三方库（antd）样式失效问题
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          "css-loader"
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: getUrlLoader()
      },
      /* {
        test: /\.html$/,
        use: 'html-loader',
      },*/
    ]
  },
  plugins: [
    new HtmlWebpackPlugin(getHtmlConfig('index','development-demo-pc')),
    new MiniCssExtractPlugin({
      //contenthash 保证只有当css文件本身发生变动时对应的hash才发生变化，与css文件所处的模块内容变化无关
      filename: isProd ?  'css/[name].[contenthash].css' : 'css/[name].css',
      chunkFileName: isProd ? 'css/[id].[contenthash].css' :'css/[id].css'
    }),
    new BundleAnalyzerPlugin({ //可视化分析文件大小
      openAnalyzer: false
    }),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, '..', 'dist', 'manifest.json')
    }),
    new HappyPack({
      id: 'happyBabel',  //处理哪类文件
      loaders: [{
        loader: 'babel-loader?cacheDirectory=true',
      }],
      threadPool: happyThreadPool, //共享进程池
      verbose: true, //允许输出日志
    })
  ]
}

module.exports = {
  baseConfig,
  join
};
