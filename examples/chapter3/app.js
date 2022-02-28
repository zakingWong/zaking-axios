import axios from "../../lib/axios";

axios({
  method: "get",
  url: "/c3/get1",
})
  .then((res) => {
    console.log(res);
  })
  .catch((e) => {
    console.log(e);
  });

axios({
  method: "get",
  url: "/c3/get",
})
  .then((res) => {
    console.log(res);
  })
  .catch((e) => {
    console.log(e);
  });

setTimeout(() => {
  axios({
    method: "get",
    url: "/c3/get",
  })
    .then((res) => {
      console.log(res);
    })
    .catch((e) => {
      console.log(e);
    });
}, 5000);

axios({
  method: "get",
  url: "/c3/timeout",
  timeout: 2000,
})
  .then((res) => {
    console.log(res);
  })
  .catch((e) => {
    console.log(e.message);
    console.log(e.config);
    console.log(e.code);
    console.log(e.request);
    console.log(e.isAxiosError);
  });
