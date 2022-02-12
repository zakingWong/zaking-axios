import buildURL from "../helpers/buildURL";
export default function xhrAdapter(config) {
  var request = new XMLHttpRequest();

  request.open(
    config.method.toUpperCase(),
    buildURL(config.url, config.params, config.paramsSerializer),
    true
  );

  request.send(config.data);
}
