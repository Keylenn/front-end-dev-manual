const express = require('express');
const webpackDevMiddle = require('webpack-dev-middleware');
const webpackHotMiddle = require('webpack-hot-middleware');
const webpack = require('webpack');
const devConfig = require('./webpack.config.dev');
const app = express();
const PORT = 2019;

const isSingleEntry = typeof devConfig.entry === 'string';
const webpackHotMiddleEntry = `webpack-hot-middleware/client?noInfo=true&reload=true`;
if(isSingleEntry){
  devConfig.entry = [ webpackHotMiddleEntry, devConfig.entry ];
} else {
  const multipeEntry = devConfig.entry;
  Object.keys(multipeEntry)
    .forEach(name => {
      multipeEntry[name] = [webpackHotMiddleEntry,  multipeEntry[name]];
    });
}

const devCompiler = webpack(devConfig);

app.use(
  webpackDevMiddle(devCompiler,{
    publicPath: devConfig.output.publicPath,
  })
)

app.use(
  webpackHotMiddle(devCompiler,{
   
  })
)

// 使用静态资源目录，才能访问到/dist/
app.use(express.static(devConfig.output.path))

app.listen(PORT, function () {
  console.log(`Your project listening on port ${PORT}!\n`);
});