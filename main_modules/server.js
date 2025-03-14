"use strict";

var hbs = require("express-hbs");
var i18n = require("i18n");
var cors = require("cors");
var Path = require("node:path");
var http = require("node:http");
var morgan = require("morgan");
var express = require("express");
var cookieSession = require("cookie-session");

var db = global.$db;
var config = db.get("config").value();
var secret = config.secret;
var $erver = config.server;
var app = express();
var server = http.createServer(app);

module.exports = async () => server.listen($erver.port, $erver.host);

i18n.configure({
  locales: ["en", "pt-BR"],
  cookie: "locale",
  directory: Path.resolve("locales"),
  defaultLocale: "pt-BR"
});

app.engine(
  "hbs",
  hbs.express4({
    //i18n,
    layoutsDir: Path.resolve("views", "layouts"),
    partialsDir: Path.resolve("views", "partials"),
    defaultLayout: Path.resolve("views", "layouts", "main.hbs")
  })
);

app.set("view engine", "hbs");
app.set("views", Path.resolve("views"));

app.use(cors());
app.use(
  morgan("dev", {
    skip: function (req, res) {
      return res.statusCode < 400;
    }
  })
);

app.use(
  cookieSession({
    name: "session",
    keys: [secret]
  })
);

app.use(i18n.init);

app.use((req, res, next) => {
  res.locals.origin = req.protocol + "://" + req.get("host");
  res.locals.url = res.locals.origin + req.originalUrl;

  res.set({ "X-Powered-By": "Sandel" });
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(Path.resolve("public")));
app.use(require("./routes"));
app.use(require("./routes/error/404"));
app.use(require("./routes/error/500"));

server.on("error", err => (console.log("ServerError:"), console.error(err)));
server.on("listening", () =>
  console.log(`The server is listening on port ${$erver.port}.`)
);
