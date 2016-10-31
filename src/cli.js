#!/usr/bin/env node
import chalk from 'chalk';
import Liftoff from 'liftoff';
import interpret from 'interpret';
import yargs from 'yargs';
import {modulePath} from './mocha-path';
import mowatch from './mowatch';

const Mowatch = new Liftoff({
  name: 'mowatch',
  processTitle: 'mocha',
  configName: '.mowatch',
  moduleName: 'mowatch',
  extensions: interpret
});


let mochaModulePath;
const argv = yargs
  .usage('$0 [mocha options]')
  .version()
  .option('watch', {
    alias: 'w',
    describe: 'Additional files/globs to watch; comma-separated',
    array: true
  })
  .option('poll', {
    describe: 'Force polling; use for networked drives',
    boolean: true,
    default: false
  })
  .option('mocha-path', {
    describe: 'Specify absolute path to mocha module',
    string: true
  })
  .help('help')
  .alias('help', 'h')
  .check(argv => {
    mochaModulePath =
      argv.mochaPath ? modulePath(argv.mochaPath) : modulePath();
  })
  .epilog('Refer to "mocha --help" for more command line options.').argv;

if (!(argv.help && argv.version)) {
  if (!argv._.length) {
    argv._.push('test');
  }

  async.map([
    argv._,
    argv.watch
  ], mowatch.globberFactory(argv.recursive), function (err, result) {
    if (err) {
      return fatal(err);
    }

    argv._ = result[0];
    argv.w = argv.watch = result[1];

    console.error('mowatch: ' + chalk.green('Watching %s'),
      argv._.concat(argv.watch)
        .join(', '));

    argv.callback = notifyErr;

    mowatch(argv._, argv, function (err) {
      if (err) {
        return fatal(err);
      }
      console.error('mowatch: ' + chalk.green('Done.'));
    });
  });
}
