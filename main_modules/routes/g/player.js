"use strict";

var fs = require("node:fs");
var Path = require("node:path");
var express = require("express");

var db = global.$db;
var symlinkdir = global.$symlinkdir;

var router = express.Router();

router.get("/player/:stream?", (req, res, next) => {
  req.id = (req.params.stream || req.query.stream || "").trim().slice(0, 11);
  res.locals.layout = false;
  req.id.length === 11 ? next() : res.redirect("/");
});

router.get("/player/:stream?", (req, res, next) => {
  var sendError = () => {
    res.status(404).render("pages/error/playback", {
      title: req.__("MediaStreamUnavailable")
    });

    if (req.stream) {
      req.symlink = Path.join(symlinkdir, req.stream.uuid);
      fs.unlink(req.symlink, err => {});
      req.streams.remove({ path: req.stream.path }).write();
    }
  };

  req.streams = db.get("streams");
  req.stream = req.streams.find({ id: req.id }).value();
  req.stream && fs.existsSync(req.stream.path) ? next() : sendError();
});

router.get("/player/:stream?", (req, res, next) => {
  res.locals.title = `${req.stream.name} - ${req.__("appname")}`;
  res.locals.stream = req.stream.url;
  res.render("pages/player");
});

module.exports = router;
