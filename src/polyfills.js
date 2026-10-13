// Safari < 15.4 and Chrome < 93 lack Object.hasOwn (ES2022). It runs before any other module.
if (typeof Object.hasOwn !== 'function') {
  Object.defineProperty(Object, 'hasOwn', {
    value(object, key) {
      if (object == null) throw new TypeError('Cannot convert undefined or null to object')
      return Object.prototype.hasOwnProperty.call(Object(object), key)
    },
    configurable: true,
    writable: true,
  })
}
