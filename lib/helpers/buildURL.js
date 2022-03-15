import utils from "../utils";

// 这个转换方法，就是不需要转换的在encodeURIComponent转换后再把它替换回来。
function encode(val) {
  return encodeURIComponent(val)
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",")
    .replace(/%20/g, "+")
    .replace(/%5B/gi, "[")
    .replace(/%5D/gi, "]");
}

/**
 *
 * @param {string} url  // 请求的url地址
 * @param {object} params // 请求的get方法的参数
 * @param {function} paramsSerializer // 自定义转换方法
 * @returns // 返回拼接参数后的url
 */
export default function buildURL(url, params, paramsSerializer) {
  // 如果没有params的参数的话，直接返回url即可
  if (!params) return url;
  // 首先啊，由于我们引入了可以自定义转换的逻辑，所以这里我们先判断一下
  let serializedParams; // 这个变量就是转换后的url参数
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    // 如果既没有自定义的转换方法，又不是一个URLSearchParams对象，那么就走默认的转换逻辑
    // 先声明一个存储变量
    let parts = [];
    // 这里用了一个自定义的循环方法
    utils.forEach(params, function serialize(val, key) {
      // 这个跟我们说好的场景一致，如果没有值，就不管它了。
      if (val === null || typeof val === "undefined") {
        return;
      }

      // 判断val是否是个数组,如果是数组的话，那么key要变化一下，这个咱们之前的需求也说过，
      // 如果不是的话，把它变成数组，方便后面统一循环处理
      if (utils.isArray(val)) {
        key = key + "[]";
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        // 这个也说了，日期的话要处理下
        if (utils.isDate(v)) {
          v = v.toISOString();
          // 如果是个对象的话，那直接stringify就好
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        // 数组里的样子就是这样的["a=1","v=2"]酱紫。
        parts.push(encode(key) + "=" + encode(v));
      });
    });
    // parts里面的参数都放完了，咱隔一下
    serializedParams = parts.join("&");
    // 此时的serializedParams就是这样的"a=1&v=2"了
  }

  // 上面，我们根据不同的条件（自定义转换，URLSearchParams，默认）处理好了searchParams
  // 下面，我们要处理hash
  // 这个逻辑很简单，就是有hash的时候，只留下hash前的地址
  if (serializedParams) {
    console.log(url, "url");

    var hashmarkIndex = url.indexOf("#");
    // 要注意的是，如果hash存在，并且还存在参数，那么hash后面的参数也会被视为hash的一部分
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    console.log(url, "url");
    // 判断下url有没有参数，根据不同条件分割searchParams
    url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }

  return url;
}
