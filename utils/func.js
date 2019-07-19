
export const common = {
  // 返回记忆函数，实现缓存函数的结果，对象类型调换顺序后产生新key，视为新的缓存结果
  memoize: fn => 
      (...args) => {
          if(!fn.cache) fn.cache = {};
          let key = '';
          args.forEach(arg => key += `_${JSON.stringify(arg)}`);
          return fn.cache[key] = fn.cache[key] || fn(...args);
      },
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
    const data = useLocalStorage === true 
      ? localStorage.getItem(key) 
      : sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  setItem(key, data, useLocalStorage) {
    useLocalStorage === true
      ? localStorage.setItem(key, JSON.stringify(data))
      : sessionStorage.setItem(key, JSON.stringify(data));
  },
  removeItem(key, useLocalStorage) {
    useLocalStorage === true
      ? localStorage.removeItem(key)
      : sessionStorage.removeItem(key);
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
  get: common.memoize(_getCookie),
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
const _getCookie = name => {
  let cookie = '';
  document.cookie.split('\;')
  .forEach(item => {
    if(cookie) return;
    const [key, value] = item.trim().split('\=');
    if(key === name)  cookie = value;
  })
  return cookie;
}

const _getExpires = expiredays => {
  const _exdate = new Date();
  _exdate.setDate(_exdate.getDate() + expiredays);
  return _exdate.toUTCString();
}

const _initDate = (value, options={}) => {
  if(type.isObject(value)){
    options = value;  
    value = void 0;
  }
  const {
    showType = 'all',
    useFixedZero = true,
  } = options;
  const date = value ? new Date(value) : new Date();
  if(showType === 'week') return date.getDay();
  const dateInfo = {
      year: date.getFullYear(),
      month: useFixedZero ? _fixedZero( date.getMonth() + 1 ) :  date.getMonth() + 1,
      day: useFixedZero ?_fixedZero( date.getDate() ) : date.getDate(),
  };
  if(showType === 'all' || showType === 'time'){
    dateInfo.hour = useFixedZero ? _fixedZero( date.getHours() ) : date.getHours();
    dateInfo.min = useFixedZero ? _fixedZero( date.getMinutes() ) : date.getMinutes();
    dateInfo.sec = useFixedZero ? _fixedZero( date.getSeconds() ) : date.getSeconds();
  }
  return dateInfo;
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