import xhr from "../adapters/xhr";
function transformResponse(data) {
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      // do nothing
    }
  }
  return data;
}
export default function dispatchRequest(config) {
  return xhr(config).then((res) => {
    res.data = transformResponse(res.data);
    return res;
  });
}
