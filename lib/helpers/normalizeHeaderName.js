"use strict";

import utils from "../utils";
// 首先，由于http对header是大小写不敏感的，我们需要这样的方法来规范统一
export default function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    // 如果header中的name也就是key和传入的normalizedName不等，但是都大写化后又是相等的。
    // 那么我们就用传入的header，并且删除掉原来的小写的。
    // 这个比较容易理解
    if (
      name !== normalizedName &&
      name.toUpperCase() === normalizedName.toUpperCase()
    ) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
}
