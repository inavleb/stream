"use strict";

const low = require("lowdb");
const Path = require("node:path");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync(Path.join(__dirname, "data.json"));
const db = low(adapter);
const defaults = {
  streams: [],
  config: {
    source: "/data/data/com.termux/files/home/storage/shared",
    server: {
      host: null,
      port: 8080
    }
  }
};

db.defaults(defaults).write();
module.exports = db;
