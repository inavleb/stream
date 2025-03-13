"use strict";

var fs = require("node:fs");
var Path = require("node:path");

global.$db = require("./db");
global.$symlinkdir = Path.resolve("media_streams");
