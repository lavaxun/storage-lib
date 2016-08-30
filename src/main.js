'use strict'

var _ = require('lodash')
var request = require('request')
var fs = require('fs')
var s3 = require('s3')

var getStorageServiceInstance = function (config) {
  var storageService = {
    client: null,
    config: {
      s3Options: {
        accessKeyId: '',
        secretAccessKey: '',
        region: ''
      },
      uploads: {
        s3Bucket: '',
        dest: '/tmp/upload'
      }
    }
  }

  storageService.config = _.defaultsDeep(config, storageService.config)
  storageService.getS3Client = function () {
    if (_.isObject(this.client) && !_.isEmpty(this.client)) {
      return this.client
    }

    this.client = s3.createClient({
      maxAsyncS3: 20,     // this is the default
      s3RetryCount: 3,    // this is the default
      s3RetryDelay: 1000, // this is the default
      multipartUploadThreshold: 20971520, // this is the default (20 MB)
      multipartUploadSize: 15728640, // this is the default (15 MB)
      s3Options: this.config.s3Options
    })
    return this.client
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
    var uploadKey = remoteFilePath
    var uploadBucket = this.config.uploads.s3Bucket
    var client = this.getS3Client()
    var params = {
      localFile: filePath,
      s3Params: {
        Bucket: uploadBucket,
        Key: uploadKey
      }
    }
    var self = this
    var uploader = client.uploadFile(params)
    uploader.on('error', function (err) {
      console.log(err)
      done(err, null)
    }).on('end', function () {
      var s3Url = s3.getPublicUrl(uploadBucket, uploadKey, self.config.s3Options.region)
      done(null, s3Url)
    })
  }

  storageService.removeFile = function (remoteFilePath, done) {
    var deleteKey = remoteFilePath
    var targetBucket = this.config.uploads.s3Bucket
    var client = this.getS3Client()
    var params = {
      Bucket: targetBucket,
      Delete: {
        Objects: [
          {
            Key: deleteKey
          }
        ],
        Quiet: true
      }
    }
    var deleter = client.deleteObjects(params)
    deleter.on('error', function (err) {
      done(err)
    }).on('end', function () {
      done(null)
    })
  }

  storageService.storageFolder = function () {
    return _.trimEnd(this.config.uploads.dest)
  }

  return storageService
}

exports.getInstance = getStorageServiceInstance
