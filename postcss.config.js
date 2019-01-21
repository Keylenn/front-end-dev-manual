const postcssAssets = require('postcss-assets'); //提供图像处理函数，归约 URL、处理尺寸、内联图像、清除缓存
const postcssPresetEnv = require('postcss-preset-env'); //使用未来的CSS特性

module.exports = {
  plugins: [
    postcssAssets({
      basePath: './src/',
      loadPaths: ["assets/img"] //查找目录
    }),
    postcssPresetEnv
  ]
}
