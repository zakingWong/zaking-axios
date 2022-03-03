import qs from "qs";
import axios from "../../lib/axios";
axios.defaults.headers.common["test2"] = 123;

axios({
  url: "/c6/post",
  method: "post",
  data: qs.stringify({
    a: 1,
  }),
  headers: {
    test: "321",
  },
}).then((res) => {
  console.log(res.data);
});

axios({
  transformRequest: [
    function (data) {
      return qs.stringify(data);
    },
    ...axios.defaults.transformRequest,
  ],
  transformResponse: [
    ...axios.defaults.transformResponse,
    function (data) {
      if (typeof data === "object") {
        data.b = 2;
      }
      return data;
    },
  ],
  url: "/c6/post",
  method: "post",
  data: {
    a: 1,
  },
}).then((res) => {
  console.log(res.data);
});

const instance = axios.create({
  transformRequest: [
    function (data) {
      return qs.stringify(data);
    },
    ...axios.defaults.transformRequest,
  ],
  transformResponse: [
    ...axios.defaults.transformResponse,
    function (data) {
      if (typeof data === "object") {
        data.b = 2;
      }
      return data;
    },
  ],
});

instance({
  url: "/c6/post",
  method: "post",
  data: {
    a: 1,
  },
}).then((res) => {
  console.log(res.data);
});
