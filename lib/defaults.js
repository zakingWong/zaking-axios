"use strict";

import adapterXHR from "./adapters/xhr";
import enhanceError from "./core/enhanceError";
import normalizeHeaderName from "./helpers/normalizeHeaderName";
import toFormData from "./helpers/toFormData";
import utils from "./utils";
var DEFAULT_CONTENT_TYPE = {
  "Content-Type": "application/x-www-form-urlencoded",
};

function setContentTypeIfUnset(headers, value) {
  if (
    !utils.isUndefined(headers) &&
    utils.isUndefined(headers["Content-Type"])
  ) {
    headers["Content-Type"] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== "undefined") {
    // For browsers use XHR adapter
    // adapter = require("./adapters/xhr");
    adapter = adapterXHR;
  } else if (
    typeof process !== "undefined" &&
    Object.prototype.toString.call(process) === "[object process]"
  ) {
    // For node use HTTP adapter
    // 咱们没有实现服务端的http，所以直接用xhr的
    adapter = adapterXHR;
    // adapter = require("./adapters/http");
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  // 如果需要转换的rawValue是字符串
  if (utils.isString(rawValue)) {
    try {
      // 是否传入了转换器，否则就用JSON.parse来转换
      (parser || JSON.parse)(rawValue);
      // trim一下
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== "SyntaxError") {
        throw e;
      }
    }
  }
  // 如果不是字符串就转换成字符串，逻辑一样
  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [
    function transformRequest(data, headers) {
      normalizeHeaderName(headers, "Accept");
      normalizeHeaderName(headers, "Content-Type");

      if (
        utils.isFormData(data) ||
        utils.isArrayBuffer(data) ||
        utils.isBuffer(data) ||
        utils.isStream(data) ||
        utils.isFile(data) ||
        utils.isBlob(data)
      ) {
        return data;
      }
      if (utils.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils.isURLSearchParams(data)) {
        setContentTypeIfUnset(
          headers,
          "application/x-www-form-urlencoded;charset=utf-8"
        );
        return data.toString();
      }

      var isObjectPayload = utils.isObject(data);
      var contentType = headers && headers["Content-Type"];

      if (isObjectPayload && contentType === "multipart/form-data") {
        return toFormData(
          data,
          new ((this.env && this.env.FormData) || FormData)()
        );
      } else if (isObjectPayload || contentType === "application/json") {
        setContentTypeIfUnset(headers, "application/json");
        return stringifySafely(data);
      }

      return data;
    },
  ],

  transformResponse: [
    function transformResponse(data) {
      console.log(data, "data");
      console.log(JSON.parse(data));
      if (utils.isString(data) && data.length) {
        try {
          return JSON.parse(data);
        } catch (e) {
          if (e.name === "SyntaxError") {
            throw enhanceError(e, this, "E_JSON_PARSE");
          }
          throw e;
        }
      }
      return data;
    },
  ],

  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },

  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
    },
  },
};

utils.forEach(["delete", "get", "head"], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

export default defaults;
