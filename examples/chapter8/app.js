import axios from "../../lib/axios";
document.cookie = "a=b";

axios.get("/c8/get").then((res) => {
  console.log(res);
});

axios
  .post(
    "http://127.0.0.1:8088/c8/server2",
    {},
    {
      withCredentials: true,
    }
  )
  .then((res) => {
    console.log(res);
  });
