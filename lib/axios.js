import xhr from "./adapters/xhr";

function axios(config) {
  xhr(config);
}

export default axios;
