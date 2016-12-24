### Mocha reporter for AppVeyor

Report your test results to AppVeyor's testing infrastructure.

[![Build status](https://ci.appveyor.com/api/projects/status/ddacjc9dr7w2iqfw/branch/master?svg=true)](https://ci.appveyor.com/project/tolbertam/mocha-appveyor-reporter/branch/master) [![Build Status](https://travis-ci.org/tolbertam/mocha-appveyor-reporter.svg?branch=master)](https://travis-ci.org/tolbertam/mocha-appveyor-reporter)

See it [in action](https://ci.appveyor.com/project/tolbertam/mocha-appveyor-reporter/build/tests) with this repository.

### Install

```
npm install --save-dev mocha-appveyor-reporter
```

#### Usage

```
mocha --reporter mocha-appveyor-reporter
```

#### Options

This reporter is configurable via use of `--reporter-options` or by setting environment variables.

|Reporter Option          |Environment Variable             |Default                                                  |
|-------------------------|---------------------------------|---------------------------------------------------------|
|appveyorBatchSize        |APPVEYOR\_BATCH\_SIZE            |100                                                      |
|appveyorBatchIntervalInMs|APPVEYOR\_BATCH\_INTERVAL\_IN\_MS|1000                                                     |
|appveyorApiUrl           |APPVEYOR\_API\_URL               |unset, but AppVeyor sets the environment variable for you|

The reporter will by default batch and send tests in an API call to AppVeyor for every 100 tests completed or 1000ms
elapsed (whichever happens first).

To override this behavior you may do the following:

```
mocha --reporter mocha-appveyor-reporter --reporter-options appveyorBatchSize=1
```

