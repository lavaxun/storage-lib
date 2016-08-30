'use strict'

var path = require('path')
var glob = require('glob')
var gulp = require('gulp')
var _ = require('lodash')
var plugins = require('gulp-load-plugins')()
var runSequence = require('run-sequence')

var changedTestFiles = []
var testAssets = {
  tests: ['test/*.js']
}
var defaultAssets = {
  gulpConfig: ['gulpfile.js'],
  allJS: ['src/*.js']
}

// ESLint JS linting task
gulp.task('eslint', function () {
  var assets = _.union(
    defaultAssets.gulpConfig,
    defaultAssets.allJS,
    testAssets.tests
  )

  return gulp.src(assets)
    .pipe(plugins.eslint())
    .pipe(plugins.eslint.format())
})

// prepare mocha code coverage
gulp.task('prepare-mocha', function (done) {
  return gulp.src(defaultAssets.allJS)
    .pipe(plugins.istanbul())
    .pipe(plugins.istanbul.hookRequire())
})

// Mocha tests task
gulp.task('mocha', ['prepare-mocha'], function (done) {
  var testSuites = testAssets.tests

  console.log('run test on files')
  console.log(testSuites)

  var istanbulOpts = {
    dir: './test_coverage',
    reporters: ['lcov', 'text', 'text-summary']
  }

  gulp.src(testSuites)
    .pipe(plugins.mocha({
      reporter: 'spec',
      timeout: 10000
    }))
    .on('error', function () {
      console.log('Failed mocha test!')
      process.exit(1)
    })
    .on('end', function () {
      done()
    })
    .pipe(plugins.istanbul.writeReports(istanbulOpts))
})

// For bdd
gulp.task('mocha:live', function (done) {
  var testSuites = changedTestFiles.length ? changedTestFiles : testAssets.tests
  gulp.src(testSuites)
    .pipe(plugins.mocha({
      reporter: 'spec',
      timeout: 3000
    }))
    .on('error', function () {
      console.log('Failed mocha test!')
    })
    .on('end', function () {
      done()
    })
})

gulp.task('watch:test', function () {
  gulp.watch([testAssets.tests, defaultAssets.allJS], ['test:marathon'])
    .on('change', function (file) {
      changedTestFiles = []

      // iterate through server test glob patterns
      _.forEach(testAssets.tests, function (pattern) {
        // determine if the changed (watched) file is a server test
        _.forEach(glob.sync(pattern), function (f) {
          var filePath = path.resolve(f)

          if (filePath === path.resolve(file.path)) {
            changedTestFiles.push(f)
          }
        })
      })
    })
})

// external interface
gulp.task('test:once', function (done) {
  runSequence('eslint', 'mocha', done)
})

gulp.task('bdd', function (done) {
  runSequence('mocha:live', 'watch:test', done)
})
