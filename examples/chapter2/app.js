import axios from "../../lib/axios";
axios({
  method: "post",
  url: "/c2/post",
  data: {
    a: 1,
    b: 2,
  },
});

axios({
  method: "post",
  url: "/c2/post",
  headers: {
    "content-type": "application/json;charset=utf-8",
  },
  data: {
    a: 3,
    b: 4,
  },
});

const arr = new Int32Array([21, 31]);

axios({
  method: "post",
  url: "/c2/buffer",
  data: arr,
});

const paramsString = "q=URLUtils.searchParams&topic=api";
const searchParams = new URLSearchParams(paramsString);

axios({
  method: "post",
  url: "/c2/post",
  data: searchParams,
});

axios({
  method: "post",
  url: "/c2/post",
  data: {
    a: 5,
    b: 6,
  },
}).then((res) => {
  console.log(res);
});

axios({
  method: "post",
  url: "/c2/post",
  responseType: "json",
  data: {
    a: 7,
    b: 8,
  },
}).then((res) => {
  console.log(res);
});
