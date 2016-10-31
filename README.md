# mowatch [![Build Status](https://travis-ci.org/mochajs/mowatch.svg?branch=master)](https://travis-ci.org/mochajs/mowatch)

> Watch Mocha tests for changes and execute them 

Prototype of a replacement for `mocha --watch` functionality.

## Install

```shell
$ npm install -g mowatch
```

`mowatch` requires [`mocha`](https://mochajs.org) in some form.  If `mocha` is present in the local project, its executable will be used instead of a global one.

## Example

```shell
$ mowatch test/**/*.js --watch lib/**/*.js
```

## Usage

```
Watch Mocha tests for changes and execute them

mowatch [mocha options] <test files>

Options:
  --version    Show version number                                     [boolean]
  --watch, -w  Additional files/globs to watch; comma-separated
                                                           [array] [default: []]
  --help, -h   Show help                                               [boolean]

Refer to "mocha --help" for more command line options.
```

`mowatch` accepts all command line options except those listed above.

## License

:copyright: 2016 [JS Foundation](https://js.foundation) and contributors.
