'use strict';

var binPath = require('bin-path');
var which = require('which');
var unparseArgs = require('unparse-args');
var childProcess = require('child_process');
var gaze = require('gaze');
var async = require('async');
var fs = require('fs');
var path = require('path');

var EXECUTABLE = 'mocha';

function findMocha(done) {
  if (findMocha.bin) {
    return done(null, findMocha.bin);
  }

  function found(bin) {
    findMocha.bin = bin;
    done(null, bin);
  }

  binPath(require)(EXECUTABLE, function(err, bin) {
    if (err) {
      return which(EXECUTABLE, function(err, bin) {
        if (err) {
          return done('Could not find Mocha installed locally or in the PATH.' +
            ' Please install Mocha!');
        }
        found(bin);
      });
    }
    found(bin.mocha);
  });
}
function globberFactory(recursive) {
  return function globber(paths, done) {
    function dirToGlob(filepath, callback) {
      fs.stat(filepath, function(err, stat) {
        if (err) {
          return callback(err);
        }
        if (stat.isDirectory()) {
          return callback(null, path.join(filepath, recursive ?
            path.join('**', '*.js') : '*.js'));
        }
        return callback(null, filepath);
      });
    }

    async.map(paths, dirToGlob, function(err, result) {
      if (err) {
        return done(err);
      }
      done(null, result);
    });
  };
}

function mowatch(filepaths, options, done) {
  var executeMocha = mowatch.executor();
  var paths;
  var callback;

  options = options || {};
  callback = options.callback || function noop() {};
  filepaths = filepaths || [];
  paths = filepaths.concat(options.watch || []);

  delete options.h;
  delete options.help;
  delete options.version;
  delete options.watch;
  delete options.w;
  delete options.callback;
  delete options.$0;

  gaze(paths, function(err, watcher) {
    if (err) {
      return done(err);
    }

    watcher.on('all', function() {
      executeMocha(options, callback);
    });
  });
}

function executor() {
  var proc;
  return function executeMocha(options, done) {
    if (!proc) {
      return mowatch.findMocha(function(err, bin) {
        var args;
        if (err) {
          return done(err);
        }
        args = unparseArgs(options);
        proc = childProcess.fork(bin, args)
          .on('exit', function() {
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
