import axios from 'axios';
import {request} from '../../utils/func'
import { config } from '../common/config'

const _instance = axios.create({
  baseURL: config.contextPath,
  timeout: 1000,
  retry: 4, //默认请求次数
  retryDelay: 1000   //默认请求的间隙
});
//传参统一使用params:{}
const asyncRequest = async(options)=>{
  const config = _getConfig(options);
  return await _instance(config);
}

const asyncGet = async(url, config) =>{
  return await _instance.get(url, config);
}
const asyncPost = async(url, data, config)=>{
  return await _instance.post(url, data, config);
}

//添加拦截器，不安全请求时添加csrfToken
_instance.interceptors.request.use(config=>{
  let _config = Object.assign({}, config)
  const {isCsrfSafeMethod, getCsrfToken} = request;
  if(!isCsrfSafeMethod(_config.method)){
    const csrfToken = getCsrfToken('csrfToken');
    _config.headers['x-csrf-token'] = csrfToken;
  }
  return _config;
}, err=>{
  console.error('请求超时!');
  return Promise.resolve(err.response); //在成功的回调中返回error信息
});


_instance.interceptors.response.use(res=>{
  if(!res){
    return;
  }
  const error = _getError(res);
  if(error){
    console.error(error);
    return;
  }
  return res;
}, err=>{ //在成功的回调中返回err相关的信息
  if(err.response){
    const error = _getError(err.response);
    console.error(error);
    return Promise.resolve(err.response);
  }
  if(err.config && err.config.retry){ //拦截超时，重新请求
    return _rerty(err);
  }
  return Promise.resolve(err);
});


//根据method判断处理options的params
const _getConfig = options => {
  let _options = Object.assign({}, options);
  const {params, method} = _options;
  const isNotGet = method && method.toLowerCase() !== 'get';
  if(isNotGet){
    delete _options.params;
    _options = Object.assign({}, _options, {data: params});
  }
  const config = Object.assign({}, _options);
  return config;
}

//获取响应异常
const _getError = response =>{
  switch (response.status){
    case 200:
      return response.data.status === 'error'
        ? response.data.msg
        : '';
    case 403:
      return '权限不足,请联系管理员!(403)';
    case 404:
      return '页面走丢了!(404)';
    case 504:
      return '服务器被吃了!(504)';
    default:
      return `未知错误，status:${response.status}`;
  }
}
//超时重新请求
const _rerty =  err =>{
  const _config = Object.assign({_retryCount: 0}, err.config); //初始化 | 获取config
  const {retry, retryDelay} = _config;
  if(_config._retryCount >= retry) {
    return Promise.resolve(err); // 达到最大重试总次数,在成功的回调中返回err相关的信息
  }
  _config._retryCount += 1;
  // 创建新的异步请求
  const backoff = new Promise(function(resolve) {
    setTimeout(function() {
      resolve();
    }, retryDelay);
  });
  // 重新请求
  return backoff.then(function() {
    return _instance(_config);
  });
}

export {asyncRequest, asyncGet, asyncPost};