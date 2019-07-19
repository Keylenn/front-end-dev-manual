/*
 * @Description: 数据类型相关函数
 * @Author: hejilun
 * @Date: 2019-07-19 14:16:40
 * @LastEditors: hejilun
 * @LastEditTime: 2019-07-19 16:48:17
 */

export const isObject = value => Object.prototype.toString.call(value) === '[object Object]';
    
export const isFunc = value => Object.prototype.toString.call(value) === '[object Function]';

export function isArray(value){
    return Array.isArray
    ? Array.isArray(value) 
    : Object.prototype.toString.call(value) === '[object Array]'
} 
