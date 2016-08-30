# S3 storage helper  [![wercker status](https://app.wercker.com/status/a891080ef23f64251eb729d499efbb46/s/master "wercker status")](https://app.wercker.com/project/byKey/a891080ef23f64251eb729d499efbb46)   [![Dependency Status](https://gemnasium.com/badges/github.com/axnux/storage-lib.svg)](https://gemnasium.com/github.com/axnux/storage-lib)  
A high level nodejs s3 wrapper



## Installation
```shell
npm install storage-lib
```


## Config
```js
var config = {   // must provide these
  s3Options: {
    accessKeyId: '',
    secretAccessKey: '',
    region: ''
  },
  uploads: {
    s3Bucket: '',
    dest: '' // default: '/tmp/upload'
  }
}
```


## Usage
```js
var storageHelper = require('storage-lib')(config) // see the above config

// check remote file exists
storageHelper.remoteFileExists('http://remote.file.url', function (err, exists) {
  // exists: true, false
})

// get the local storage folder path
storageHelper.storageFolder() // same as config.uploads.dest

// download the remote file with and rename as local/file/path.txt (inside the folder  storageHelper.storageFolder())
storageHelper.downloadFile('http://remote.file.url', 'local/file/path.txt', function (err, fullLocalPath) {
  // 'fullLocalPath' will be:
  // config.uploads.dest + '/' + 'local/file/path.txt'
})

// delete file from s3
storageHelper.removeFile('remote/file/path/in/s3', function () {
  //
})

// upload file to s3
storageHelper.toS3('/full/local/file/path.txt', 'remote/file/path/in/s3.txt', function (err, url) {
  // will upload the file from '/full/local/file/path.txt' to s3
  // 'url' will be:
  // a valid http(s)://url.pointing.tos3bucket/remote/file/path/in/s3.txt
})

```



## License
(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
