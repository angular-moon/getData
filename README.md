# getData
获取数据, 根据存活时间读取已缓存的数据或从服务器端获取

## function getDataWithCache(url, params, ttl, config)
 * @param url {String} 请求url
 * @param params {Object} 请求参数
 * @param ttl (time to live) {Number} 缓存有效时长单位[秒]
 * @param config {Object} httpConfig
 * @returns {Promise}
