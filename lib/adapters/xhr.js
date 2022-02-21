import { transformRequest } from "../core/transformRequest";
import buildURL from "../helpers/buildURL";
import normalizeHeaderName from "../helpers/normalizeHeaderName";
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

export default function xhrAdapter(config) {
  var request = new XMLHttpRequest();
  config.headers = processHeaders(config.headers || {}, config.data);
  config.data = transformRequest(config.data);
  request.open(
    config.method.toUpperCase(),
    buildURL(config.url, config.params, config.paramsSerializer),
    true
  );
  // 如果data是空的话，那就去掉content-type头字段
  Object.keys(config.headers).forEach((name) => {
    if (config.data === null && name.toLowerCase() === "content-type") {
      delete config.headers[name];
    } else {
      request.setRequestHeader(name, config.headers[name]);
    }
  });
  request.send(config.data);
}
