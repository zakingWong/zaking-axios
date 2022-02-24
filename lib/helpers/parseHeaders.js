"use strict";

import utils from "../utils";

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
// 这是我们需要忽略的header
var ignoreDuplicateOf = [
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent",
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
export default function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;
  // 没有headers就返回个空对象
  if (!headers) {
    return parsed;
  }
  // 用自定义的forEach方法来遍历分割后的headers
  utils.forEach(headers.split("\n"), function parser(line) {
    // 这时候，line还是个字符串，i就是每一个key、value中间的位置
    i = line.indexOf(":");
    // 分割key，去空格
    key = utils.trim(line.substr(0, i)).toLowerCase();
    // 分割value，去空格
    val = utils.trim(line.substr(i + 1));

    if (key) {
      // 如果存在key并且是重复项，则略过
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      // 如果key是set-cookie，那么用数组合并作为值
      if (key === "set-cookie") {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        // 否则用逗号分隔已有的值或者直接设置值
        parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
      }
    }
  });

  return parsed;
}
