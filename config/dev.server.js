const express = require('express');
const webpackDevMiddle = require('webpack-dev-middleware');
const webpack = require('webpack');
const devConfig = require('./webpack.config.dev');
const app = express();
const devCompiler = webpack(devConfig);
const PORT = 2019;

console.log(devConfig.entry);

app.use(
  webpackDevMiddle(devCompiler,{
    publicPath: devConfig.output.publicPath,
  })
)

// 使用静态资源目录，才能访问到/dist/
app.use(express.static(devConfig.output.path))

app.listen(PORT, function () {
  console.log(`Your project listening on port ${PORT}~~\n`);
});