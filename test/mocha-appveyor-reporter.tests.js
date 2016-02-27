var mockery = require('mockery'),
sinon = require('sinon'),
Mocha = require('mocha'),
reporter = require('../mocha-appveyor.js');
require('chai').should();

describe('mocha-appveyor-reporter', function() {
  var tests = [], jsonPost;
  before(function() {
    mockery.enable({
      warnOnUnregistered: false,
      warnOnReplace: false
    });

    mockery.registerMock('request-json', {
      createClient: function(url) {
        url.should.equal(process.env.APPVEYOR_API_URL);

        jsonPost = sinon.spy(function(path, data, callback) {
          path.should.equal('api/tests');
          tests.push(data);
          callback(null);
        });

        return {
          post: jsonPost
        }
      }
    });

    process.env.APPVEYOR_API_URL = 'http://localhost:9884/'
  });

  after(function() {
    mockery.disable()
  });

  beforeEach(function() {
    tests = [];

    mocha = new Mocha({
      ui: 'bdd',
      reporter: reporter
    });
  });

  afterEach(function() {
    Object.keys(require.cache).forEach(function(file) {
      if (file && file.match(/\/test\/tests\/.*\.js$/)) {
        delete require.cache[file];
      }
    });
  });

  it('should project test results in the shape that AppVeyor expects', function(done) {
    mocha.addFile('test/tests/mixed.js').run(function() {
      tests.length.should.equal(7);
      tests.forEach(function(test) {
        test.testName.should.be.a('string');
        test.outcome.should.be.a('string');
        test.testFramework.should.equal('Mocha');
        test.fileName.should.contain('mixed.js');
      });
      done();
    });
  });

  it('should include error information in failures', function(done) {
    mocha.addFile('test/tests/mixed.js').run(function() {
      var failedTests = tests.filter(function(t) { return t.outcome === 'Failed' });
      failedTests.length.should.equal(3);
      failedTests[0].ErrorMessage.should.equal('boom!');
      failedTests[1].ErrorMessage.should.equal('oops!');
      failedTests[0].ErrorStackTrace.should.match(/test\/tests\/mixed.js:\d{1,2}:\d{1,2}\)/);
      failedTests[1].ErrorStackTrace.should.match(/test\/tests\/mixed.js:\d{1,2}:\d{1,2}/);
      done();
    })
  });

  it('should include ignored tests', function(done) {
    mocha.addFile('test/tests/mixed.js').run(function() {
      tests.some(function(t) { return t.outcome === 'Ignored' }).should.be.true;
      done();
    })
  });

  it('should include stdout and output from tests', function(done) {
    mocha.addFile('test/tests/mixed.js').run(function() {
      tests.some(function(t) { return t.StdOut === 'Here is some STDOUT!\nHere is some more STDOUT!\n'}).should.be.true;
      done();
    });
  });

  it('should include stderr and output from tests', function(done) {
    mocha.addFile('test/tests/mixed.js').run(function() {
      tests.some(function(t) { return t.StdErr === 'Here is some STDERR!\nHere is some more STDERR!\n'}).should.be.true;
      done();
    });
  });
});
