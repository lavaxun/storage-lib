# S3 storage helper  
A high level nodejs s3 wrapper

Support for **Docker** through **Wercker**

## Start development with local nodejs (recommended)
### Prerequisites  
- nodejs  

### Instructions  
1. First install the dependencies using `npm install`  
2. To start with development, you have to:  
   - execute `npm run bdd` and keep it running in terminal  
     *Note: this will not start your web app but continuous testing.*  
     *every time you update your js files. it will auto restart test cases.*  

## Alternatives (using Wercker)
### Prerequisites  
- docker for Mac/Windows/Linux (*or virtualbox 5.0.20 + boot2docker-vagrant*)  
- wercker cli  

### Wercker dev
For some reason you might don't want to use nodejs in your local machine.   
Then you can still start development using **wercker cli**:

1. To start with development using **wercker**  
    execute `wercker dev`   

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
