var mockery = require('mockery'),
sinon = require('sinon'),
Mocha = require('mocha')

require('chai').should()

describe('mocha-appveyor', function() {
  var lastTestBatch, jsonPost
  before(function() {
    mockery.enable({
      warnOnUnregistered: false,
      warnOnReplace: false
    })

    mockery.registerMock('request-json', {
      newClient: function(url) {
        url.should.equal(process.env.APPVEYOR_API_URL)

        jsonPost = sinon.spy(function(path, data, callback) {
          path.should.equal('api/tests/batch')
          lastTestBatch = data
          callback();
        })

        return {
          post: jsonPost
        }
      }
    })

    process.env.APPVEYOR_API_URL = 'http://localhost:9884/'
  })

  after(function() {
    mockery.disable()
  })

  beforeEach(function() {
	var testFileName = 'tests/mixed.js';
	delete require.cache[require.resolve('./' + testFileName)];
	
    lastTestBatch = null

    mocha = new Mocha({
      ui: 'bdd',
      reporter: 'mocha-appveyor'
    }).addFile('test/' + testFileName)
  })

  afterEach(function() {
    Object.keys(require.cache).forEach(function(file) {
      if (file && file.match(/\/test\/tests\/.*\.js$/)) {
        delete require.cache[file]
      }
    })
  })

  it('should project test results in the shape that AppVeyor expects', function(done) {
    mocha.run(function() {
	  console.log(JSON.stringify(lastTestBatch))
      lastTestBatch.length.should.equal(5)
      lastTestBatch.forEach(function(test) {
        test.testName.should.be.a('string')
        test.outcome.should.be.a('string')
        test.testFramework.should.equal('Mocha')
        test.fileName.should.contain('mixed.js')
      })
      done()
    })
  })

  it('should include error information in failures', function(done) {
    mocha.run(function() {
	  console.log(JSON.stringify(lastTestBatch))
      var failedTests = lastTestBatch.filter(function(t) { return t.outcome === 'Failed' })
      failedTests.length.should.equal(2)
      failedTests[0].ErrorMessage.should.equal('boom!')
      failedTests[1].ErrorMessage.should.equal('oops!')
      failedTests[0].ErrorStackTrace.should.match(/[\/\\]test[\/\\]tests[\/\\]mixed.js:\d{1,2}:\d{1,2}/)
      failedTests[1].ErrorStackTrace.should.match(/[\/\\]test[\/\\]tests[\/\\]mixed.js:\d{1,2}:\d{1,2}/)
      done()
    })
  })

  it('should include ignored tests', function(done) {
    mocha.run(function() {
	  console.log(JSON.stringify(lastTestBatch))
      lastTestBatch.some(function(t) { return t.outcome === 'Ignored' }).should.be.true
      done()
    })
  })
})