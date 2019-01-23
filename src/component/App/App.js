import React from 'react';

import style from './App.scss';
import {Button} from "antd";
import noResult from '../../assets/img/no-result.png';
import TestClassProperties from "./TestClassProperties";
import Audio from './Audio';
import TestEgg from './TestEgg';
import TestCRUD from './TestCRUD';




const App = ()=>{
  return (
    <div className="app">
      <h2 className={style.h2}>Hello World!</h2>
      <div>
        <p className = {style.testPostcssPresetEnv}>测试模块热替换</p>
        <p className = {style.testComposes}>测试css-modules的composes</p>
      </div>
      <div className = {style.testPostcssAssets}>
        <img src={noResult} alt="no result"/>
      </div>
      <Button type="primary">antdButton</Button>
      <TestClassProperties />
      <section className={style.sectionLayout}>
        <Audio src= "./message_prompt.ogg" />  {/*src路径要相对于dist */}
        <TestEgg />
      </section>
      <TestCRUD />
    </div>
  );
}
export default  App;