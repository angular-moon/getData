# getData
获取数据, 根据存活时间读取已缓存的数据或从服务器端获取

## function getDataWithCache(url, params, ttl, config)
 * @param url {String} 请求url
 * @param params {Object} 请求参数
 * @param ttl (time to live) {Number} 缓存有效时长单位[秒]
 * @param config {Object} httpConfig
 * @returns {Promise}


## function getData(url, params, cache)
* $http.get 语法糖
* @param url {String} 请求url
* @param params {Object} 请求参数
* @param cache {boolean} 是否使用缓存, 默认为 false
* @returns {Promise}

### 注意!
>* getData 中的缓存是缓存到 <code>内存</code> 中, 刷新浏览器缓存失效
>* getDataWithCache 的缓存是缓存到 <code>localstroge</code> 中, 在指定的 <code>ttl</code> 到期后失效
