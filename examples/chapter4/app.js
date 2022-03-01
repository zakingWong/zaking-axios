import axios from "../../lib/axios";

axios({
  url: "/c4/post",
  method: "post",
  data: {
    msg: "hi",
  },
});

axios.request({
  url: "/c4/post",
  method: "post",
  data: {
    msg: "hello",
  },
});

axios.get("/c4/get");

axios.options("/c4/options");

axios.delete("/c4/delete");

axios.head("/c4/head");

axios.post("/c4/post", { msg: "post" });

axios.put("/c4/put", { msg: "put" });

axios.patch("/c4/patch", { msg: "patch" });
