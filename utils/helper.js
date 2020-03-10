/*
 * @Description: 
 * @Author: hejilun
 * @Date: 2020-03-10 17:30:31
 * @LastEditors: hejilun
 * @LastEditTime: 2020-03-10 17:31:47
 */
import React from 'react';

export function resolveCompdStyles(allCompStyles) {
    const comp = <scope><style jsx>{allCompStyles}</style></scope>
    return {
      compClass: comp.props.className, //就是被styled-jsx添加的独特className
      compStyles: comp.props.children  //就是style，注入到组件中
    }
  }