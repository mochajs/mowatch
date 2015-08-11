'use strict';

var rewire = require('rewire');
var mowatch = rewire('../lib');

describe('mowatch', function() {
  var sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create('mowatch');
  });

  it('should be a function', function() {
    expect(mowatch).to.be.a('function');
  });

  it('should ignore certain arguments', function() {
    var gaze = sandbox.stub();
    mowatch.__with__({
      gaze: gaze
    })(function() {
      var argv = {
        version: false,
        help: false,
        h: false,
        watch: 'some/path/*.js',
        w: 'some/path/*.js',
        $0: 'path/to/mowatch',
        callback: function() {}
      };
      mowatch(argv._, argv);
      expect(argv).to.eql({});
      expect(gaze).to.have.been.calledOnce;
    });
  });
});
