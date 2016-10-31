'use strict';

var resolveBin = require('resolve-bin');
var which = require('which');
var unparseArgs = require('unparse-args');
var childProcess = require('child_process');
var watchpack = require('watchpack');
var path = require('path');
var parallel = require('fastparallel');

var EXECUTABLE = 'mocha';
var execPath;

function noop () {
}

function findMocha (done) {
  function setExecutablePath (filepath) {
    execPath = filepath;
    findMocha(done);
  }

  if (execPath) {
    return done(null, execPath);
  }

  resolveBin(EXECUTABLE, {executable: EXECUTABLE}, function (err, filepath) {
    if (err) {
      return which(EXECUTABLE, function (err, filepath) {
        if (err) {
          return done('Could not find Mocha installed locally or globally!');
        }
        setExecutablePath(filepath);
      });
    }
    setExecutablePath(filepath);
  });
}

function globberFactory (recursive) {
  function dirToGlob (filepath, done) {
    fs.stat(filepath, function (err, stat) {
      if (err) {
        return done(err);
      }
      if (stat.isDirectory()) {
        return done(null,
          path.join(filepath, recursive ? path.join('**', '*.js') : '*.js'));
      }
      return done(null, filepath);
    });
  }

  return parallel({
    results: true
  })
    .bind(null, null, dirToGlob);
}

function mowatch (filepaths, options, done) {
  var executeMocha = mowatch.executor();
  var paths;
  var callback;

  options = options || {};
  callback = options.callback || noop;
  filepaths = filepaths || [];
  paths = filepaths.concat(options.watch || []);

  delete options.h;
  delete options.help;
  delete options.version;
  delete options.watch;
  delete options.w;
  delete options.callback;
  delete options.$0;

  gaze(paths, function (err, watcher) {
    if (err) {
      return done(err);
    }

    watcher.on('all', function () {
      executeMocha(options, callback);
    });
  });

  return
}

function executor () {
  var proc;
  return function executeMocha (options, done) {
    if (!proc) {
      return mowatch.findMocha(function (err, bin) {
        var args;
        if (err) {
          return done(err);
        }
        args = unparseArgs(options);
        proc = childProcess.fork(bin, args)
          .on('exit', function () {
            proc = null;
            done();
          });
      });
    }
    done();
  };
}

mowatch.findMocha = findMocha;
mowatch.executor = executor;
mowatch.globberFactory = globberFactory;

module.exports = mowatch;
