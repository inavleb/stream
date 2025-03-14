"use strict";

const low = require("lowdb");
const Path = require("node:path");
const FileSync = require("lowdb/adapters/FileSync");
const { nanoid } = require("nanoid");

const adapter = new FileSync(Path.join(__dirname, "data.json"));
const db = low(adapter);
const defaults = {
  streams: [],
  config: {
    secret: nanoid(16),
    source: "/data/data/com.termux/files/home/storage/shared",
    server: {
      host: null,
      port: 8080
    }
  }
};

db.defaults(defaults).write();
module.exports = db;
