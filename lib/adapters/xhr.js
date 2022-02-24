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
  return new Promise((resolve) => {
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
      resolve(response);
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
