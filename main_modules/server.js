"use strict";

var hbs = require("express-hbs");
var cors = require("cors");
var Path = require("node:path");
var http = require("node:http");
var morgan = require("morgan");
var express = require("express");

var db = global.$db;
var config_server = db.get("config.server").value();
var app = express();
var server = http.createServer(app);

module.exports = async () =>
  server.listen(config_server.port, config_server.host);

app.set("view engine", "hbs");
app.set("views", Path.resolve("views"));

app.engine(
  "hbs",
  hbs.express4({
    layoutsDir: Path.resolve("views", "layouts"),
    partialsDir: Path.resolve("views", "partials"),
    defaultLayout: Path.resolve("views", "layouts", "main.hbs")
  })
);

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(Path.resolve("public")));
app.use(require("./routes"));
app.use(require("./routes/error/404"));
app.use(require("./routes/error/500"));

server.on("error", err => (console.log("ServerError:"), console.error(err)));
server.on("listening", () =>
  console.log(`The server is listening on port ${config_server.port}.`)
);
