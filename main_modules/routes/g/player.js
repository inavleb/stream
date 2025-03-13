"use strict";

var fs = require("node:fs");
var Path = require("node:path");
var express = require("express");

var db = global.$db;
var err_page = "pages/error/stream_unavailable";
var err_data = { title: "Media stream unavailable!" };

var router = express.Router();

router.get("/player/:stream?", (req, res, next) => {
  req.id = (req.params.stream || req.query.stream || "").trim().slice(0, 11);
  req.id.length === 11 ? next() : res.redirect("/");
});

router.get("/player/:stream?", (req, res, next) => {
  res.locals.layout = "player";
  req.stream = db.get("streams").find({ id: req.id }).value();
  req.stream ? next() : res.status(404).render(err_page, err_data);
});

router.get("/player/:stream?", (req, res, next) => {
  res.locals.title = req.stream.name;
  res.locals.stream = req.stream.url;

  res.render("pages/player");
});

module.exports = router;
