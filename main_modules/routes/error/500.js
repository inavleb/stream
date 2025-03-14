"use strict";

var HTTP_STATUS_CODES = require("./http-status-codes");

function PageNotFound(err, req, res, next) {
  res = res.status(err);
  this.title = req.__("pageNotFoundTitle");
  this.message = req.__("pageNotFoundMessage", {
    url: `<code>${req.path}</code>`
  });

  this.summary = req.__("pageNotFoundSummary");
  this.status = HTTP_STATUS_CODES[err];

  if (req.xhr) res.json(this.status);
  else res.render("pages/error/404", this);

  console.log(this);
}

function InternalServerError(err, req, res, next) {
  res = res.status(500);
  this.status = HTTP_STATUS_CODES[500];
  this.layout = false;

  if (req.xhr) res.json(this.status);
  else res.render("pages/error/500");

  console.error(err);
}

module.exports = function (err, req, res, next) {
  var $this = Object.create(null);

  if (err === 404) PageNotFound.apply($this, arguments);
  else InternalServerError.apply($this, arguments);
};
