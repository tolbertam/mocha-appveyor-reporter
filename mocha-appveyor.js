function AppVeyorReporter(runner) {
  var requestJson = require('request-json'),
  tests = []

  runner.on('pass', function(test){
    tests.push({
      testName: test.fullTitle(),
      testFramework: 'Mocha',
      fileName: test.file,
      outcome: 'Passed',
      durationMilliseconds: test.duration
    })
  })

  runner.on('fail', function(test, err) {
    tests.push({
      testName: test.fullTitle(),
      testFramework: 'Mocha',
      fileName: test.file,
      outcome: 'Failed',
      durationMilliseconds: test.duration,
      ErrorMessage: err.message,
      ErrorStackTrace: err.stack
    })
  })

  runner.on('end', function() {
    requestJson.newClient(process.env.APPVEYOR_API_URL).post('api/tests/batch', tests, function(err, body, resp) {
      
    })
  })
}

module.exports = AppVeyorReporter