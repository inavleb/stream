"use strict";

var HTTP_STATUS_CODES = require("./http-status-codes");

function PageNotFound(err, req, res, next) {
  res = res.status(err);
  this.status = HTTP_STATUS_CODES[err];
  this.title = `Error ${err} (${this.status.message})`;

  if (req.xhr) res.json(this.status);
  else res.render("pages/error/404", this);
}

function InternalServerError(err, req, res, next) {
  res = res.status(500);
  this.status = HTTP_STATUS_CODES[500];
  this.title = `Error 500 (${this.status.message})`;
  this.layout = false;

  if (req.xhr) res.json(this.status);
  else res.render("pages/error/500", this);

  console.error(err);
}

module.exports = function (err, req, res, next) {
  var obj = Object.create(null);

  if (err === 404) PageNotFound.apply(obj, arguments);
  else InternalServerError.apply(obj, arguments);
};
