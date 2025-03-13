"use strict";
require("./main_modules/globals");

var fs = require("node:fs");
var Path = require("node:path");
var server = require("./main_modules/server");
var crypto = require("node:crypto");
var chokidar = require("chokidar");
var { nanoid } = require("nanoid");

var DB = {};
var db = global.$db;
var queue = [];
var source = db.get("config.source").value();
var symlinkdir = global.$symlinkdir;

var watcher = chokidar.watch(source, {
  persistent: true,
  ignored: (file, stats) =>
    stats?.isFile() && !/\.(mp4|webm)$/i.test(Path.parse(file).ext)
});

var error = options => Object.assign(new Error(), options);
var guid = async () => {
  var limit = 64 ** 11;
  var stream = null;
  var streams = db.get("streams");
  var length = streams.size().value();
  var idParse = id => {
    stream = streams.find({ id }).value();
    return stream ? idParse(nanoid(11)) : id;
  };

  if (length < limit) return idParse(nanoid(11));
  throw error({
    name: "GuidError",
    message: "maximum limit exceeded for generating new IDs."
  });
};

DB.add = async path => {
  var item, symlink;
  var streams = db.get("streams");
  var stream = streams.find({ path }).value();
  var fail = err => {
    watcher.emit("error", err);
    watcher.close().then(() => console.log("chokidar is closed!"));
  };

  var done = id => {
    item = Object.assign(Path.parse(path), { path });
    item.id = id;
    item.uuid = crypto.randomUUID();
    item.url = "/-/media/stream/" + item.uuid;
    symlink = Path.join(symlinkdir, item.uuid);

    fs.symlink(path, symlink, "file", err => {
      if (err) {
        watcher.emit("error", err);
        return queue.execute();
      }

      streams.push(item).write();
      queue.execute();
    });
  };

  stream ? queue.execute() : guid().then(done).catch(fail);
};

DB.del = async path => {
  var symlink;
  var streams = db.get("streams");
  var stream = streams.find({ path }).value();

  if (stream) {
    symlink = Path.join(symlinkdir, stream.uuid);
    fs.unlink(symlink, err => streams.remove({ path }).write());
  }
};

if (!fs.existsSync(symlinkdir)) fs.mkdirSync(symlinkdir, { recursive: true });

queue.execute = async () => {
  if (queue.length) DB.add(queue.shift());
  else setTimeout(queue.execute, 2500);
};

watcher.on("add", path => queue.push(path));
watcher.on("error", err => (console.log("WatcherError:"), console.error(err)));
watcher.on("unlink", path => DB.del(path));
watcher.on("ready", () => (queue.execute(), server()));
