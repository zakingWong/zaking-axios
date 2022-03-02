import utils from "../utils";
import dispatchRequest from "./dispatchRequest";
import InterceptorManager from "./InterceptorManager";
import mergeConfig from "./mergeConfig";
export default function Axios(config) {
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager(),
  };
}

Axios.prototype.request = function (configOrUrl, config) {
  if (typeof configOrUrl === "string") {
    if (!config) {
      config = {};
    }
    config.url = configOrUrl;
  } else {
    config = configOrUrl;
  }
  // 请求拦截器调用链
  var requestInterceptorChain = [];
  // 是否同步
  var synchronousRequestInterceptors = true;
  // 通过拦截器的forEach方法，通过回调函数的方式，把所有的请求拦截放到requestInterceptorChain数组里
  this.interceptors.request.forEach(function unshiftRequestInterceptors(
    interceptor
  ) {
    if (
      // 判断下如果runWhen是false就return掉了
      typeof interceptor.runWhen === "function" &&
      interceptor.runWhen(config) === false
    ) {
      return;
    }
    // 判断是否是同步执行
    synchronousRequestInterceptors =
      synchronousRequestInterceptors && interceptor.synchronous;
    // 把两个回调函数放到数组的头部
    // 注意这里不是unshift一个数组，而是独立的，就是这样[interceptor.fulfilled,interceptor.rejected]
    // [3,2,1]
    requestInterceptorChain.unshift(
      interceptor.fulfilled,
      interceptor.rejected
    );
  });
  // 响应拦截器调用链
  var responseInterceptorChain = [];
  // response这个比较简单，直接push进数组就完事了
  this.interceptors.response.forEach(function pushResponseInterceptors(
    interceptor
  ) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });
  // 定一个promise变量，后面用
  var promise;
  // 如果不是同步的
  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];
    // 这块呢，就把整个requestInterceptorChain放到chain的前面
    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    // 这个就是把responseInterceptorChain放到[requestInterceptorChain,chain]后面
    chain = chain.concat(responseInterceptorChain);
    // 额外要说的是到了这里，这个chain数组是什么样的呢
    // 我们打印下,以我们之前的例子代码为例：
    // 它实际上是这样的[fn,undefined,fn,undefined,fn,undefined,fn,undefined,fn,undefined,fn,undefined]
    // 具体点，[requestInterceptorChain,chain,responseInterceptorChain]
    // 再具体点：[requestResolve3,undefined,requestResolve2,undefined,requestResolve1,undefined,dispatchRequest, undefined,responseResolve1,undefined,responseResolve3,undefined]
    console.log(chain, "chian");
    // 这块可能就优点疑惑了，首先promise变量变成了一个已经resolved的Promise，resolve出去的就是config配置
    promise = Promise.resolve(config);
    while (chain.length) {
      // 所以这里的then里面就是这样(resolve，reject)
      // 注意then方法的第二个参数就是reject的。
      // 换句话说，这里就形成了一个一个的链式调用，源头是一个已经resolved的promise。
      promise = promise.then(chain.shift(), chain.shift());
    }
    // 返回咯
    return promise;
  }
  // 那如果是同步的话，走下面的代码
  // 很简单，就是同步执行罢了，我就不说了哦。
  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      // 新的config就是onFulfilled同步函数执行的结果，一步一步往下传
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }
  // 执行dispatchRequest返回个promise，dispatchRequest本身就会返回promise，对吧？
  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }
  // 循环执行responseInterceptorChain链。
  while (responseInterceptorChain.length) {
    promise = promise.then(
      responseInterceptorChain.shift(),
      responseInterceptorChain.shift()
    );
  }
  // 返回，结束
  return promise;
};

// Provide aliases for supported request methods
utils.forEach(
  ["delete", "get", "head", "options"],
  function forEachMethodNoData(method) {
    /*eslint func-names:0*/
    Axios.prototype[method] = function (url, config) {
      return this.request(
        mergeConfig(config || {}, {
          method: method,
          url: url,
          data: (config || {}).data,
        })
      );
    };
  }
);

utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function (url, data, config) {
    return this.request(
      mergeConfig(config || {}, {
        method: method,
        url: url,
        data: data,
      })
    );
  };
});
