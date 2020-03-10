/*
 * @Description: 数据类型相关工具函数
 * @Author: hejilun
 * @Date: 2019-07-19 14:16:40
 * @LastEditors: hejilun
 * @LastEditTime: 2019-07-22 09:48:39
 */

export const isObject = value => Object.prototype.toString.call(value) === '[object Object]';
    
export const isFunc = value => Object.prototype.toString.call(value) === '[object Function]';

export function isArray(value){
    return Array.isArray
    ? Array.isArray(value) 
    : Object.prototype.toString.call(value) === '[object Array]'
} 

/**
 * @description: 判断是否为普通的对象，标准为对象的原型与该对象（在原型链最顶端上的非null）原型是否一致，
 * 代码来源为redux源码（https://github.com/reduxjs/redux/blob/master/src/utils/isPlainObject.js）
 * @param {any} obj 
 * @return {boolean}
 */
export function isPlainObject(obj) {
    if(!isObject(obj)) return false;
    let proto = obj;
    while(Object.getPrototypeOf(proto) !== null) { //循环得到obj（在原型链最顶端上的非null）原型proto
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(obj) === proto;
}
