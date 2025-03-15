"use strict";

var fs = require("node:fs");
var Path = require("node:path");
var express = require("express");

var symlinkdir = global.$symlinkdir;
var uuid_format =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

var router = express.Router();

router.get("/-/media/stream/:uuid?", (req, res, next) => {
  req.uuid = req.params.uuid || req.query.uuid;
  req.uuid = (uuid_format.exec(req.uuid) || [null])[0];
  req.uuid ? next() : next(404);
});

router.get("/-/media/stream/:uuid?", (req, res, next) => {
  console.log(req.path, req.headers);

  if (!req.range()) return res.end();
  if (!req.headers.referer) return res.end();
  if (req.headers.referer.includes(req.path)) return res.end();
  if (!req.headers.referer.includes(req.headers.host)) return res.end();
  if (req.headers.referer.includes(req.headers.origin)) return res.end();

  next();
});

router.get("/-/media/stream/:uuid?", (req, res, next) => {
  req.symlink = Path.join(symlinkdir, req.uuid);

  fs.realpath(req.symlink, (err, path) =>
    err ? next(404) : res.sendFile(path)
  );
});

module.exports = router;
