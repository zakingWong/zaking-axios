import axios from "../../lib/axios";

// method小写
axios({
  method: "get",
  url: "/c1/get",
});

// method大写
axios({
  method: "GET",
  url: "/c1/get",
});

// 普通的params对象
axios({
  method: "get",
  url: "/c1/get",
  params: {
    a: 1,
    b: 2,
  },
});

// params的参数的值为数组的情况
axios({
  method: "get",
  url: "/c1/get",
  params: {
    a: [1, 2, 3, 4],
  },
});

// params的参数的值为对象的情况
axios({
  method: "get",
  url: "/c1/get",
  params: {
    a: {
      b: 1,
    },
  },
});

// params的参数的值为Date类型
const date = new Date();

axios({
  method: "get",
  url: "/c1/get",
  params: {
    date,
  },
});

// 支持特殊字符
axios({
  method: "get",
  url: "/c1/get",
  params: {
    a: "@:$, ",
  },
});

// 忽略空值
axios({
  method: "get",
  url: "/c1/get",
  params: {
    a: 1,
    b: null,
    c: undefined,
  },
});

// 丢弃URL中的hash标记
axios({
  method: "get",
  url: "/c1/get#fuckhash?m=12&md=23",
  params: {
    a: 1,
    b: null,
    c: undefined,
  },
});

// 保留URL中已存在的参数
axios({
  method: "get",
  url: "/c1/get?m=12&md=23",
  params: {
    a: 1,
    b: null,
    c: undefined,
  },
});
