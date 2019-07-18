import React from 'react';
import css from 'styled-jsx/css';

export default function About() {
  return(
    <>
      <div className="about">
       这是关于webpack4.0+babel7.0+其他库的使用以及参数配置的手册，项目基于webpack4.0和babel7.0，开发环境支持webpack内置的devServer和自定制server两种方式开启服务和热更新，默认支持antd，配合React-Router v4实现异步加载页面组件，支持styled-jsx， 使用post-css（px2vw实现移动端适配，autoprefixer自动加前缀，...），内置封装了axios和常用的React Hooks~~
      </div>
      <style jsx>{staticStyle}</style>
    </>
  );
}


const staticStyle = css`
  .about {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding:0 40px;
    font-size: 20px; /*no*/
    text-align: justify;
  }
`;