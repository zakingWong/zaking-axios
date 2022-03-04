import axios from "../../lib/axios";
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios
  .get("/c7/get", {
    cancelToken: source.token,
  })
  .catch(function (e) {
    if (axios.isCancel(e)) {
      console.log("Request canceled", e.message);
    }
  });

setTimeout(() => {
  source.cancel("Operation canceled by the user.");

  axios
    .post("/c7/post", { a: 1 }, { cancelToken: source.token })
    .catch(function (e) {
      if (axios.isCancel(e)) {
        console.log(e.message);
      }
    });
}, 100);

let cancel = null;

axios
  .get("/c7/get", {
    cancelToken: new CancelToken((c) => {
      cancel = c;
    }),
  })
  .catch(function (e) {
    if (axios.isCancel(e)) {
      console.log("Request canceled");
    }
  });

setTimeout(() => {
  cancel();
}, 200);

const controller = new AbortController();

axios
  .get("/c7/get", {
    signal: controller.signal,
  })
  .catch(function (e) {
    if (axios.isCancel(e)) {
      console.log("Request canceled");
    }
  });

setTimeout(() => {
  controller.abort();
}, 1000);
