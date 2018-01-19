var store = require('store');

var ngGetData = angular.module('ng.getdata', []);

/**
 * 获取数据, 根据存活时间读取已缓存的数据或从服务器端获取
 * @param url {String} 请求url
 * @param params {Object} 请求参数
 * @param ttl (time to live) {Number} 缓存有效时长单位[秒]
 * @param config {Object} httpConfig
 * @returns {Promise}
 */
ngGetData.factory('getDataWithCache', ['$q', '$http', function ($q, $http) {


    return function (url, params, ttl, config) {

        //参数处理, 接受 function(url, ttl, config)的调用
        if (angular.isNumber(params))
            ttl = params;
        if (angular.isObject(ttl))
            config = ttl;

        config = config || {};

        //合并params
        if (params && angular.isObject(params))
            config.params = angular.extend({}, config.params, params);

        //构建缓存的key
        var key = buildUrl(url, config.params);


        //查找缓存
        if (ttl) {
            var value = store.get(key);

            //如果命中缓存, 且缓存没有失效返回缓存数据
            if (value && (new Date().getTime() - value.timestamp) < ttl * 1000) {
                return $q.when(value.data);
            }

            //清空缓存数据
        } else {
            store.remove(key);
        }

    
       return $http.get(url, config).then(

        function (response) {
          try {
              //如果启用了缓存, 把数据保存到缓存中
              if (ttl) {
                  store.set(key, {timestamp: new Date().getTime(), data: response.data})
              }
          } catch (e) {
              //localstroge容量可能满了, 清空所有缓存数据
              store.clear();
          }

          return response.data;
      });
       
    }
}]);

/**
 * $http.get 语法糖
 * @param url {String} 请求url
 * @param params {Object} 请求参数
 * @param cache {boolean} 是否使用缓存, 默认为 false
 * @returns {Promise}
 */
ngGetData.factory('getData', ['$http', function($http){

    return function(api, params, cache){
        var config = {};
        if(params)
            config = {"params": params};
        if(cache)
            config.cache = true;
        else
            config.cache = false;

        return $http.get(api, config).then(function(response){
            return response.data;
        });
    }
}]);

function sortedKeys(obj) {
    var keys = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            keys.push(key);
        }
    }
    return keys.sort();
}

function forEachSorted(obj, iterator, context) {
    var keys = sortedKeys(obj);
    for (var i = 0; i < keys.length; i++) {
        iterator.call(context, obj[keys[i]], keys[i]);
    }
    return keys;
}

function encodeUriQuery(val, pctEncodeSpaces) {
    return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
}

//构建url, 对请求参数进行排序
function buildUrl(url, params) {
    if (!params) return url;
    var parts = [];
    forEachSorted(params, function (value, key) {
        if (value === null || angular.isUndefined(value)) return;
        if (!angular.isArray(value)) value = [value];

        angular.forEach(value, function (v) {
            if (angular.isObject(v)) {
                v = angular.toJson(v);
            }
            parts.push(encodeUriQuery(key) + '=' +
                encodeUriQuery(v));
        });
    });
    if (parts.length > 0) {
        url += ((url.indexOf('?') == -1) ? '?' : '&') + parts.join('&');
    }
    return url;
}
