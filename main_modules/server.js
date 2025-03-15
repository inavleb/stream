"use strict";

var hbs = require("express-hbs");
var i18n = require("i18n");
var cors = require("cors");
var Path = require("node:path");
var morgan = require("morgan");
var express = require("express");
var cookieSession = require("cookie-session");
var { Server } = require("socket.io");
var { createServer } = require("node:http");

var db = global.$db;
var config = db.get("config").value();
var secret = config.secret;
var $erver = config.server;
var session = { name: "session", secret };

var app = express();
var server = createServer(app);
var io = new Server(server);

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
    layoutsDir: Path.resolve("views", "layouts"),
    partialsDir: Path.resolve("views", "partials"),
    defaultLayout: Path.resolve("views", "layouts", "main.hbs")
  })
);

app.set("view engine", "hbs");
app.set("views", Path.resolve("views"));

app.use(cookieSession(session));
app.use(i18n.init);

app.use(
  cors({
    origin: "http://example.com",
    optionsSuccessStatus: 200
  })
);

app.use(
  morgan("dev", {
    skip: function (req, res) {
      return res.statusCode < 400;
    }
  })
);

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

io.on("connection", socket => {
  console.log("a user connected");
});

server.on("error", err => (console.log("ServerError:"), console.error(err)));
server.on("listening", () =>
  console.log(`The server is listening on port ${$erver.port}.`)
);
