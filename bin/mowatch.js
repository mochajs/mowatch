#!/usr/bin/env node
'use strict';

var pkg = require('../package.json');
var chalk = require('chalk');
var async = require('async');
var yargs = require('yargs');
var mowatch = require('../lib');

var argv = yargs
  .usage(pkg.description + '\n\n\t$0 [mocha options] <test files>')
  .version(function() {
    return pkg.version;
  })
  .option('watch', {
    alias: 'w',
    describe: 'Additional files/globs to watch; comma-separated',
    array: true,
    'default': []
  })
  .help('help')
  .alias('help', 'h')
  .showHelpOnFail(true)
  .epilog('Refer to "mocha --help" for more command line options.')
  .argv;

function notifyErr(err) {
  if (err) {
    console.error('mowatch: ' + chalk.red('Tests failed!'));
  }
}

function fatal(err) {
  throw new Error(err);
}

if (!(argv.help && argv.version)) {
  if (!argv._.length) {
    argv._.push('test');
  }

  async.map([argv._, argv.watch], mowatch.globberFactory(argv.recursive),
    function(err, result) {
      if (err) {
        return fatal(err);
      }

      argv._ = result[0];
      argv.w = argv.watch = result[1];

      console.error('mowatch: ' + chalk.green('Watching %s'),
        argv._.concat(argv.watch).join(', '));

      argv.callback = notifyErr;

      mowatch(argv._, argv, function(err) {
        if (err) {
          return fatal(err);
        }
        console.error('mowatch: ' + chalk.green('Done.'));
      });
    });
}
