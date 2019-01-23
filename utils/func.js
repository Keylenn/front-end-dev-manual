export const type = {
  isObject: value => Object.prototype.toString.call(value) === '[object Object]',
  isFunc: value => Object.prototype.toString.call(value) === '[object Function]',
  isArray: value => ( !Array.isArray
    ? Object.prototype.toString.call(value) === '[object Array]'
    : Array.isArray(value) ),
  isNumber: value => typeof value === "number",
  isString: value => typeof value === "string"
}

export const date = {
  //showTime:,可选，boolean，是否显示时间， options，可选，对象，{dateSymbol，timeSymbol}
  getNow: (showTime, options = {}) => {
    if(type.isObject(showTime)){
      options = showTime
      showTime = false;
    }
    return showTime ? `${_getDate(options)} ${_getTime(options)}` : `${_getDate(options)}`;
  },
  //myDate:,必须，string，时间， options，可选，对象，{dateSymbol，timeSymbol，showTime, beforeDay, afterDay}
  setMyDate: (myDate, options = {}) => {
    const {showTime} = options;
    const _options = Object.assign({},{
      myDate,
      ...options
    });
    return showTime ? `${_getDate(_options)} ${_getTime(_options)}` : `${_getDate(_options)}`;
  },
  //获取格式化的时间格式
  getFormedDate: (myDate, format) => {
    const _options = Object.assign({},{
      showTime: format.toUpperCase() === "YYYY-MM-DD HH:MM:SS",
      dateSymbol: format.includes("/") ? "/" : "-"
    });
    return date.setMyDate(myDate, _options);
  },
  getWeek: myDate => {
    const { week } = _initDate(myDate);
    const digit = ["天", "一", "二" ,"三", "四", "五", "六"];
    return `星期${digit[week]}`;
  }

}

export const storage =  {
  getItem(key, useLocalStorage) {
    const data = useLocalStorage && useLocalStorage === true ? localStorage.getItem(key) : sessionStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  },
  setItem(key, data, useLocalStorage) {
    if (useLocalStorage && useLocalStorage === true) {
      localStorage.setItem(key, JSON.stringify(data));
    } else {
      sessionStorage.setItem(key, JSON.stringify(data));
    }
  },
  removeItem(key, useLocalStorage) {
    if (useLocalStorage && useLocalStorage === true) {
      localStorage.removeItem(key);
    } else {
      sessionStorage.removeItem(key);
    }
  }
};

export const request = {
  isCsrfSafeMethod: method => /^(GET|HEAD|OPTIONS|TRACE)$/i.test(method) ,
  getCsrfToken: (name, type) => { //目前只实现从cookie中获取
    if (type === undefined) {
      type = 'cookie';
    }
    const typeMap = {
      cookie: cookie.get(name)
    }
    return typeMap[type];
  }
}

export const cookie = { //许多浏览器（如Google Chrome）不支持在本地文件中直接访问cookie,本地打开使用127.0.0.1
  get: name => {
    const cookieObj = _parseCookie2Json();
    return name === undefined ? cookieObj : cookieObj[name];
  },
  set: (name, value, expiresDay) => {
    const _expires = type.isNumber(expiresDay)
                      ? `expires=${_getExpires(expiresDay)}`
                      : '';
    const _cookie = `${name}=${encodeURIComponent(value)};${_expires}`
    document.cookie = _cookie;
  },
  del: name => {
    cookie.set(name, '', -1);
  }
}


/**
 * 私有辅助函数
 * */

const _parseCookie2Json = () => {
  const _cookie = document.cookie;
  const _cookieArr = _cookie.split(";");
  let _cookieObj = {};
  _cookieArr.map(singleCookie => {
    const _singleCookieArr = singleCookie.trim().split("=");
    const key = _singleCookieArr[0];
    const value = _singleCookieArr[1];
    _cookieObj[key] = value;
  })
  return Object.assign({}, _cookieObj);
}

const _getExpires = expiredays => {
  const _exdate=new Date();
  _exdate.setDate(_exdate.getDate() + expiredays);
  const expires = _exdate.toUTCString();
  return expires;
}

const _initDate = value => {
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
  const dateInfo = _myDate ? _initDate(_myDate) : _initDate();
  const {year, month, day} = dateInfo;
  return `${year}${dateSymbol}${month}${dateSymbol}${day}`
}

const _getTime = options => {
  const {
    myDate,
    timeSymbol = ":"
  } = options;
  const timeInfo = myDate ? _initDate(myDate) : _initDate();
  const {
    hour = "00",
    min = "00",
    sec = "00"
  } = timeInfo;
  return `${hour}${timeSymbol}${min}${timeSymbol}${sec}`;
}

const _fixedZero = value => (value * 1 < 10 ? `0${value}` : value);