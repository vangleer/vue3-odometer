export function isObject(value) {
  var type = typeof value
  return value != null && (type == 'object' || type == 'function')
}

export const funcTags = ['[object AsyncFunction]', '[object Function]', '[object GeneratorFunction]', '[object Proxy]']

export function isFunction(value) {
  if (!isObject(value)) {
    return false
  }
  var tag = Object.prototype.toString.call(value)
  return funcTags.includes(tag)
}