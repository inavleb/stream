"use strict";

var express = require("express");
var router = express.Router();

router.use(require("./g/home"));
router.use(require("./g/stream"));
router.use(require("./g/player"));

module.exports = router;
