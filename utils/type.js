const type = {
  isObject: value => Object.prototype.toString.call(value) === '[object Object]',
  isFunc: value => Object.prototype.toString.call(value) === '[object Function]',
  isArray: value => ( !Array.isArray
                    ? Object.prototype.toString.call(value) === '[object Array]'
                    : Array.isArray(value) ),
  isNumber: value => typeof value === "number",
  isString: value => typeof value === "string"
}

export default type;