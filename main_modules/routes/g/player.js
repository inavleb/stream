"use strict";

var fs = require("node:fs");
var Path = require("node:path");
var express = require("express");

var db = global.$db;
var ERROR_PAGE = "pages/error/stream_unavailable";
var ERROR_TITLE = { title: "Media stream unavailable!" };

var router = express.Router();

router.get("/player/:stream?", (req, res, next) => {
  req.id = (req.params.stream || req.query.stream || "").trim().slice(0, 11);
  req.id.length === 11 ? next() : res.redirect("/");
});

router.get("/player/:stream?", (req, res, next) => {
  req.stream = db.get("streams").find({ id: req.id }).value();
  req.stream ? next() : res.status(404).render(ERROR_PAGE, ERROR_TITLE);
});

router.get("/player/:stream?", (req, res, next) => {
  res.locals.title = req.stream.name;
  res.locals.stream = req.stream.url;
  res.locals.layout = "player";

  res.render("pages/player");
});

module.exports = router;
