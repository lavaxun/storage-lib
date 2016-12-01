'use strict'

var _ = require('lodash')
var request = require('request')
var fs = require('fs')
var mime = require('mime')
var url = require('url')
var AwsS3 = require('aws-sdk').S3

var getStorageServiceInstance = function (config) {
  var storageService = {
    _s3: null,
    config: {
      s3Options: {
        accessKeyId: '',
        secretAccessKey: '',
        region: '',
        maxRetries: 3
      },
      uploads: {
        s3Bucket: '',
        dest: '/tmp/upload'
        // defaultContentType
      }
    }
  }

  storageService.config = _.defaultsDeep(config, storageService.config)
  storageService.getS3Client = function () {
    if (_.isObject(this._s3) && !_.isEmpty(this._s3)) {
      return this._s3
    }

    this._s3 = new AwsS3(this.config.s3Options)
    return this._s3
  }

  storageService.remoteFileExists = function (remoteUrl, done) {
    request.head(remoteUrl, function (err, res, body) {
      done(err, !err)
    })
  }

  storageService.downloadFile = function (fileUrl, filePath, done) {
    request.head(fileUrl, function (err, res, body) {
      if (err) {
        done(err, null)
        return
      }
      var fileDestination = storageService.storageFolder() + '/' + _.trimStart(filePath, '/')
      var requestThread = request(fileUrl).pipe(fs.createWriteStream(fileDestination))
      requestThread.on('close', function () {
        done(null, fileDestination)
      })
      requestThread.on('error', function (err) {
        done(err, null)
        return
      })
    })
  }

  storageService.toS3 = function (filePath, remoteFilePath, done) {
    var self = this
    var uploadKey = remoteFilePath
    var uploadBucket = this.config.uploads.s3Bucket

    var s3Params = {
      Body: fs.createReadStream(filePath),
      Bucket: uploadBucket,
      Key: encodeSpecialCharacters(uploadKey)
    }

    // taken from https://github.com/andrewrk/node-s3-client/blob/master/lib/index.js
    if (s3Params.ContentType === undefined) {
      var defaultContentType = this.config.uploads.defaultContentType || 'application/octet-stream'
      s3Params.ContentType = mime.lookup(filePath, defaultContentType)
    }

    var client = this.getS3Client()
    client.putObject(s3Params, function (err, data) {
      if (err) {
        done(err)
        return
      }
      var s3Url = getPublicUrl(uploadBucket, uploadKey, self.config.s3Options.region)
      done(null, s3Url)
    })
  }

  storageService.removeFile = function (remoteFilePath, done) {
    var self = this
    var deleteKey = remoteFilePath
    var targetBucket = this.config.uploads.s3Bucket
    var s3Params = {
      Bucket: targetBucket,
      Key: encodeSpecialCharacters(deleteKey)
    }

    var client = this.getS3Client()
    client.deleteObject(s3Params, function (err, data) {
      if (err) {
        done(err)
        return
      }
      var s3Url = getPublicUrl(targetBucket, deleteKey, self.config.s3Options.region)
      done(null, s3Url)
    })
  }

  storageService.storageFolder = function () {
    return _.trimEnd(this.config.uploads.dest)
  }

  // this code is shamelessly taken from this repo
  // https://github.com/andrewrk/node-s3-client/blob/master/lib/index.js
  function getPublicUrl (bucket, key, bucketLocation, endpoint) {
    var nonStandardBucketLocation = (bucketLocation && bucketLocation !== 'us-east-1')
    var hostnamePrefix = nonStandardBucketLocation ? ('s3-' + bucketLocation) : 's3'
    var parts = {
      protocol: 'https:',
      hostname: hostnamePrefix + '.' + (endpoint || 'amazonaws.com'),
      pathname: '/' + bucket + '/' + encodeSpecialCharacters(key)
    }
    return url.format(parts)
  }

  function encodeSpecialCharacters (filename) {
    // Note: these characters are valid in URIs, but S3 does not like them for
    // some reason.
    return encodeURI(filename).replace(/[!'()* ]/g, function (char) {
      return '%' + char.charCodeAt(0).toString(16)
    })
  }

  return storageService
}

module.exports = getStorageServiceInstance
