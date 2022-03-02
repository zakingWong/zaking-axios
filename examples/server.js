const path = require("path"); //  node内置模块
const express = require("express"); // express
const webpack = require("webpack"); // webpack
const webpackDevMiddleware = require("webpack-dev-middleware"); // express的webpack的开发环境的中间件，可以通过express来使用webpack构建
const webpackHotMiddleware = require("webpack-hot-middleware"); // 同上，热更新中间件
const bodyParser = require("body-parser");

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
app.use(bodyParser.json());
// app.use(bodyParser.text())
app.use(bodyParser.urlencoded({ c4ed: true }));
const router = express.Router();

registerC1Router();
registerC2Router();
registerC3Router();
registerC4Router();
registerC5Router();
registerC6Router();
app.use(router);

const port = process.env.PORT || 9091;
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`);
});

function registerC1Router() {
  router.get("/c1/get", function (req, res) {
    res.json(req.query);
  });
}

function registerC2Router() {
  router.post("/c2/post", function (req, res) {
    res.json(req.body);
  });

  router.post("/c2/buffer", function (req, res) {
    let msg = [];
    req.on("data", (chunk) => {
      if (chunk) {
        msg.push(chunk);
      }
    });
    req.on("end", () => {
      let buf = Buffer.concat(msg);
      res.json(buf.toJSON());
    });
  });
}

function registerC3Router() {
  router.get("/c3/get", function (req, res) {
    if (Math.random() > 0.5) {
      res.json({
        msg: `hello world`,
      });
    } else {
      res.status(500);
      res.end();
    }
  });

  router.get("/c3/timeout", function (req, res) {
    setTimeout(() => {
      res.json({
        msg: `hello world`,
      });
    }, 3000);
  });
}

function registerC4Router() {
  router.get("/c4/get", function (req, res) {
    res.json({
      msg: "hello world",
    });
  });

  router.options("/c4/options", function (req, res) {
    res.end();
  });

  router.delete("/c4/delete", function (req, res) {
    res.end();
  });

  router.head("/c4/head", function (req, res) {
    res.end();
  });

  router.post("/c4/post", function (req, res) {
    res.json(req.body);
  });

  router.put("/c4/put", function (req, res) {
    res.json(req.body);
  });

  router.patch("/c4/patch", function (req, res) {
    res.json(req.body);
  });

  router.get("/c4/user", function (req, res) {
    res.json({
      code: 0,
      message: "ok",
      result: {
        name: "jack",
        age: 18,
      },
    });
  });
}
function registerC5Router() {
  router.get("/c5/get", function (req, res) {
    res.end("hello");
  });
}

function registerC6Router() {
  router.post("/c6/post", function (req, res) {
    res.json(req.body);
  });
}
