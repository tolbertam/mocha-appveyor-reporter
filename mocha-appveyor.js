function AppVeyorReporter(runner) {
  var requestJson = require('request-json'),
  tests = [],

  mapTest = function(test) {
    return {
      testName: test.fullTitle(),
      testFramework: 'Mocha',
      fileName: test.file,
      outcome: test.state === 'passed' ? 'Passed' : undefined,
      durationMilliseconds: test.duration
    }
  }

  runner.on('pass', function(test){
    tests.push(mapTest(test))
  })

  runner.on('pending', function(mochaTest) {
    var test = mapTest(mochaTest)
    test.outcome = 'Ignored'
    tests.push(test)
  })

  runner.on('fail', function(mochaTest, err) {
    var test = mapTest(mochaTest)
    test.outcome = 'Failed'
    test.ErrorMessage = err.message
    test.ErrorStackTrace = err.stack
    tests.push(test)
  })

  process.stdin.resume()
  runner.on('end', function(done) {
    console.log('-- END -- ' + process.env.APPVEYOR_API_URL)
    console.log(process._exiting)
    process.nextTick(function() {
      console.log('-- next tick -- ')
    })
    setTimeout(function() {
      console.log('-- TIMEOUT -- ')
    }, 4)
    process.on('exit', function() {
      console.log('-- process exit -- ')
    })

    requestJson.newClient(process.env.APPVEYOR_API_URL).post('api/tests/batch', tests, function(err, body, resp) {
      console.log('-- POST DONE -- ')
      console.log(err)
    })

    console.log(process._getActiveHandles())
    console.log(process._getActiveRequests())
  })
}

module.exports = AppVeyorReporter