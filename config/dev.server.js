const express = require('express');
const webpackDevMiddle = require('webpack-dev-middleware');
const webpackHotMiddle = require('webpack-hot-middleware');
const webpack = require('webpack');
const devConfig = require('./webpack.config.dev');
const {
  compilingStats,
} = require('./config')

const {
  getLocalIp,
} = require('./utils')

const app = express();
const PORT = 2019;
const HOST = '0.0.0.0';

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
  webpackDevMiddle(devCompiler, {
    publicPath: devConfig.output.publicPath,
    stats: compilingStats,
  })
)

app.use(
  webpackHotMiddle(devCompiler, {
   
  })
)

// 使用静态资源目录，才能访问到/dist/
app.use(express.static(devConfig.output.path))

app.listen(PORT, HOST, function () {
  const localIp = getLocalIp();
  if(localIp) {
    console.log(
      'Project is running at'.white,
      `http://${localIp}:${PORT}/`.info,
      'or'.white, 
      `http://127.0.0.1:${PORT}/`.info,
      'or'.white, 
      `http://localhost:${PORT}/\n`.info
    );
  } else {
    console.log(
      'Project is running at'.white,
      `http://127.0.0.1:${PORT}/`.info,
      'or'.white, 
      `http://localhost:${PORT}/\n`.info
    );
    console.log(
      '｢tips｣:'.tip,
      'You can also use your local ip address to access\n'.white
    );
  }
});