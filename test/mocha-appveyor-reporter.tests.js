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
    lastTestBatch = null

    mocha = new Mocha({
      ui: 'bdd',
      reporter: 'mocha-appveyor'
    })
  })

  it('should project test results in the shape that AppVeyor expects', function(done) {
    mocha.addFile('test/tests/mixed.js').run(function() {
      lastTestBatch.length.should.equal(4)
      lastTestBatch.forEach(function(test) {
        test.testName.should.be.a('string')
        test.testFramework.should.equal('Mocha')
        test.fileName.should.contain('mixed.js')
      })
      done()
    })
  })
})