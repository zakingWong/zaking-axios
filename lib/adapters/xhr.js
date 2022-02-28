import createError from "../core/createError";
import buildURL from "../helpers/buildURL";
import normalizeHeaderName from "../helpers/normalizeHeaderName";
import parseHeaders from "../helpers/parseHeaders";
import utils from "../utils";
function processHeaders(headers, data) {
  normalizeHeaderName(headers, "Content-Type");
  if (utils.isPlainObject(data)) {
    if (headers && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json;charset=utf-8";
    }
  }
  return headers;
}

function transformRequest(data) {
  if (utils.isPlainObject(data)) {
    return JSON.stringify(data);
  }
  return data;
}

export default function xhrAdapter(config) {
  return new Promise((resolve, reject) => {
    var request = new XMLHttpRequest();
    config.headers = processHeaders(config.headers || {}, config.data);
    config.data = transformRequest(config.data);
    request.open(
      config.method.toUpperCase(),
      buildURL(config.url, config.params, config.paramsSerializer),
      true
    );
    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) {
        return;
      }
      if (request.status === 0) {
        return;
      }
      const responseHeaders = parseHeaders(request.getAllResponseHeaders());
      const responseData =
        config.responseType && config.responseType !== "text"
          ? request.response
          : request.responseText;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request,
      };
      handleResponse(response);
    };
    function handleResponse(response) {
      if (response.status >= 200 && response.status < 300) {
        resolve(response);
      } else {
        reject(
          createError(
            "Request failed with status code " + response.status,
            response.config,
            null,
            response.request,
            response
          )
        );
      }
    }
    request.onerror = function handleError() {
      reject(createError("Network Error", config, null, request));
      request = null;
    };

    if (config.timeout) {
      request.timeout = config.timeout;
    }

    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = config.timeout
        ? "timeout of " + config.timeout + "ms exceeded"
        : "timeout exceeded";
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      console.log(
        createError(timeoutErrorMessage, config, "ETIMEDOUT", request).toJSON()
      );
      reject(createError(timeoutErrorMessage, config, "ETIMEDOUT", request));

      // Clean up request
      request = null;
    };
    // 如果data是空的话，那就去掉content-type头字段
    Object.keys(config.headers).forEach((name) => {
      if (config.data === null && name.toLowerCase() === "content-type") {
        delete config.headers[name];
      } else {
        request.setRequestHeader(name, config.headers[name]);
      }
    });
    request.send(config.data);
  });
}
