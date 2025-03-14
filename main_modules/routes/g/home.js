"use strict";

var express = require("express");
var router = express.Router();

var db = global.$db;

router.get("/", (req, res, next) => {
  res.locals.title = req.__("appname");
  res.locals.streams = db.get("streams").value();

  res.render("pages/home");
});

module.exports = router;
