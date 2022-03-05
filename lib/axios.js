import Cancel from "./cancel/Cancel";
import CancelToken from "./cancel/CancelToken";
import isCancel from "./cancel/isCancel";
import Axios from "./core/Axios";
import mergeConfig from "./core/mergeConfig";
import defaults from "./defaults";
import bind from "./helpers/bind";
import utils from "./utils";

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);
  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };
  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);
// Expose Axios class to allow class inheritance
axios.Axios = Axios;

axios.Cancel = Cancel;
axios.CancelToken = CancelToken;
axios.isCancel = isCancel;
// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};

// Expose isAxiosError
axios.isAxiosError = function isAxiosError(payload) {
  return utils.isObject(payload) && payload.isAxiosError === true;
};
export default axios;
export { axios };
