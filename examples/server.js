const path = require("path"); //  node内置模块
const express = require("express"); // express
const webpack = require("webpack"); // webpack
const webpackDevMiddleware = require("webpack-dev-middleware"); // express的webpack的开发环境的中间件，可以通过express来使用webpack构建
const webpackHotMiddleware = require("webpack-hot-middleware"); // 同上，热更新中间件
const WebpackConfig = require("./webpack.config");

const app = express();
const compiler = webpack(WebpackConfig);
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: "/__build__/",
    stats: {
      colors: true,
      chunks: false,
    },
  })
);

app.use(webpackHotMiddleware(compiler));
app.use(express.static(__dirname));
const router = express.Router();

registerC1Router();

app.use(router);

const port = process.env.PORT || 9090;
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`);
});

function registerC1Router() {
  router.get("/c1/get", function (req, res) {
    res.json({
      msg: `hello world`,
    });
  });
}
