/**
 * @desc 关于日期、时间相关模块的函数
 */

import type from "./type";

//showTime:,可选，boolean，是否显示时间， options，可选，对象，{dateSymbol，timeSymbol}
const getNow = (showTime, options = {}) => {
  if(type.isObject(showTime)){
    options = showTime
    showTime = false;
  }
  return showTime ? `${_getDate(options)} ${_getTime(options)}` : `${_getDate(options)}`;
}

//myDate:,必须，string，时间， options，可选，对象，{dateSymbol，timeSymbol，showTime, beforeDay, afterDay}
const setMyDate = (myDate, options = {}) => {
  const {showTime} = options;
  const _options = Object.assign({},{
    myDate,
    ...options
  });
  return showTime ? `${_getDate(_options)} ${_getTime(_options)}` : `${_getDate(_options)}`;
}

/**
 * @desc 获取格式化的时间格式
 */
const getFormedDate = (myDate, format) => {
  const _options = Object.assign({},{
    showTime: format.toUpperCase() === "YYYY-MM-DD HH:MM:SS",
    dateSymbol: format.includes("/") ? "/" : "-"
  });
  return setMyDate(myDate, _options);
}

/**
 * @desc 星期几
 */
const getWeek = myDate => {
  const { week } = _init(myDate);
  const digit = ["天", "一", "二" ,"三", "四", "五", "六"];
  return `星期${digit[week]}`;
}


const _init = value => {
  const date = value ? new Date(value) : new Date();
  return {
    year: date.getFullYear(),
    month: _fixedZero( date.getMonth() + 1 ),
    day: _fixedZero( date.getDate() ),
    hour: _fixedZero( date.getHours() ),
    min: _fixedZero( date.getMinutes() ),
    sec: _fixedZero( date.getSeconds() ),
    week: date.getDay()
  }
}

const _getDate = options => {
  const {
    myDate,
    dateSymbol = "-",
    beforeDay = 0,
    afterDay = 0
  } = options;
  const _date = new Date(myDate);
  const _myDate = _date.setDate(_date.getDate() + afterDay - beforeDay);
  const dateInfo = _myDate ? _init(_myDate) : _init();
  const {year, month, day} = dateInfo;
  return `${year}${dateSymbol}${month}${dateSymbol}${day}`
}

const _getTime = options => {
  const {
    myDate,
    timeSymbol = ":"
  } = options;
  const timeInfo = myDate ? _init(myDate) : _init();
  const {
    hour = "00",
    min = "00",
    sec = "00"
  } = timeInfo;
  return `${hour}${timeSymbol}${min}${timeSymbol}${sec}`;
}

const _fixedZero = value => (value * 1 < 10 ? `0${value}` : value);



export default {
  getNow,
  setMyDate,
  getFormedDate,
  getWeek
};

