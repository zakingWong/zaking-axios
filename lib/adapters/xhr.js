import Cancel from "../cancel/Cancel";
import createError from "../core/createError";
import settle from "../core/settle";
import buildURL from "../helpers/buildURL";
import cookies from "../helpers/cookies";
import isURLSameOrigin from "../helpers/isURLSameOrigin";
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
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;
    var onCanceled;
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener("abort", onCanceled);
      }
    }

    if (utils.isFormData(requestData)) {
      delete requestHeaders["Content-Type"]; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    config.headers = processHeaders(config.headers || {}, config.data);
    config.data = transformRequest(config.data);
    request.open(
      config.method.toUpperCase(),
      buildURL(config.url, config.params, config.paramsSerializer),
      true
    );

    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders =
        "getAllResponseHeaders" in request
          ? parseHeaders(request.getAllResponseHeaders())
          : null;
      var responseData =
        !responseType || responseType === "text" || responseType === "json"
          ? request.responseText
          : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request,
      };

      settle(
        function _resolve(value) {
          resolve(value);
          done();
        },
        function _reject(err) {
          reject(err);
          done();
        },
        response
      );

      // Clean up request
      request = null;
    }

    if ("onloadend" in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (
          request.status === 0 &&
          !(request.responseURL && request.responseURL.indexOf("file:") === 0)
        ) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError("Request aborted", config, "ECONNABORTED", request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError("Network Error", config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = config.timeout
        ? "timeout of " + config.timeout + "ms exceeded"
        : "timeout exceeded";
      var transitional = config.transitional || defaults.transitional;
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(
        createError(
          timeoutErrorMessage,
          config,
          transitional.clarifyTimeoutError ? "ETIMEDOUT" : "ECONNABORTED",
          request
        )
      );

      // Clean up request
      request = null;
    };

    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue =
        (config.withCredentials || isURLSameOrigin(config.url)) &&
        config.xsrfCookieName
          ? cookies.read(config.xsrfCookieName)
          : undefined;
      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ("setRequestHeader" in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (
          typeof requestData === "undefined" &&
          key.toLowerCase() === "content-type"
        ) {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }
    // Handle progress if needed
    if (typeof config.onDownloadProgress === "function") {
      request.addEventListener("progress", config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === "function" && request.upload) {
      request.upload.addEventListener("progress", config.onUploadProgress);
    }
    // Add responseType to request if needed
    if (responseType && responseType !== "json") {
      request.responseType = config.responseType;
    }

    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = function (cancel) {
        if (!request) {
          return;
        }
        reject(
          !cancel || (cancel && cancel.type) ? new Cancel("canceled") : cancel
        );
        request.abort();
        request = null;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted
          ? onCanceled()
          : config.signal.addEventListener("abort", onCanceled);
      }
    }

    if (!requestData) {
      requestData = null;
    }

    request.send(requestData);
  });
}
