import utils from "../utils";

export function transformRequest(data) {
  if (utils.isPlainObject(data)) {
    return JSON.stringify(data);
  }
  return data;
}
