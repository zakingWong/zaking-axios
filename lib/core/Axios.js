import utils from "../utils";
import dispatchRequest from "./dispatchRequest";
import mergeConfig from "./mergeConfig";
export default function Axios(config) {}

Axios.prototype.request = function (url, config) {
  if (typeof url === "string") {
    if (!config) {
      config = {};
    }
    config.url = url;
  } else {
    config = url;
  }
  return dispatchRequest(config);
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
