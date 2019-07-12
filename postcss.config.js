const postcssAssets = require('postcss-assets'); //提供图像处理函数，归约 URL、处理尺寸、内联图像、清除缓存
const postcssPresetEnv = require('postcss-preset-env'); //使用未来的CSS特性
const autoprefixer = require("autoprefixer"); //根据can I use网站数据css自动添加前缀，https://caniuse.com/
const px2vw = require('postcss-px2vw'); //自动将px转成vw，不转添加注释/*no*/

module.exports = {
  plugins: [
    postcssAssets({
      basePath: './src/',
      loadPaths: ["assets/img"] //查找目录
    }),
    postcssPresetEnv(),
    autoprefixer({}), // Replace Autoprefixer browsers option to Browserslist config. Use browserslist key in package.json.
    px2vw({
      viewportWidth: 750, //设计稿宽度（px）
      unitPrecision: 5, //转换保留精度
      viewportUnit: 'vw', 
      minPixelValue: 1, //最小的转换值（px）
    }),
  ]
}
