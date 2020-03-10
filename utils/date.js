/*
 * @Description: 时间相关的工具函数
 * @Author: hejilun
 * @Date: 2019-07-22 09:48:17
 * @LastEditors: hejilun
 * @LastEditTime: 2019-07-23 10:07:18
 */

 import { isObject } from './type'; 

 export function getWeek(myDate, type) {
    const week = _getDate(myDate).getDay();
    const digitMap = {
        "zh-cn": [ "星期天", "星期一", "星期二" ,"星期三", "星期四", "星期五", "星期六" ],
        "en": [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday' , 'Friday', 'Saturday' ],
        "en_abbr": [ 'Sun.', 'Mon.', 'Tues.', 'Wed.', 'Thur.', 'Fri.', ' Sat.' ] 
    }
    return type ? digitMap[type][week] : week;
 }

 export function getDateInfo(myDate, showTime) {
     if(typeof myDate === "boolean") {
         showTime = myDate;
         myDate = void 0;
     }
     const date = _getDate(myDate);
     const dateInfo = {
        year: date.getFullYear(),
        mon: date.getMonth() + 1,
        day: date.getDate(),
        quar: Math.floor((date.getMonth() + 3) / 3),
    };
    return showTime 
        ? Object.assign(dateInfo, {
            hour: date.getHours(),
            min: date.getMinutes(),
            sec: date.getSeconds(),
            msec: date.getMilliseconds(),
          })
        : dateInfo;  
 }




 /**  以下为私有辅助函数 **/

/**
 * @description: 统一检验处理参数，返回时间对象
 * @param {object | number | string} myDate  
 * @return {object} date
 */
function _getDate(myDate) {
    try {
        const date =  myDate 
            ? isObject(myDate)
                ? myDate
                :new Date(myDate)
            : new Date();
        if(isNaN( date.getDate() )) {
            console.error('输入参数无效~');
        } else {
            return date;
        }
    } catch(err) {
        console.error(err);
    }
}

 