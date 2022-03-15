(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.zakingAxios = factory());
})(this, (function () { 'use strict';

  function axios() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://httpbin.org/post");
    xhr.send(JSON.stringify({ a: 1, b: 2 }));
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log(xhr.response);
        console.log(xhr.responseText);
      }
    };
  }

  return axios;

}));
//# sourceMappingURL=axios.umd.js.map
