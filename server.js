var nodeStatic = require('node-static');
var open = require('open');
var http = require('http');

const args = process.argv.reduce(function (acc, val, index, array) {
  acc[val] = true;
  return acc;
}, {});

var PORT = 9999;
var file = new nodeStatic.Server('./dist');

http.createServer(function (request, response) {
  request.addListener('end', function () {
    file.serve(request, response);
  }).resume();
}).listen(PORT);

console.log('Server is listening on ' + PORT + ' port');

if (!args['-s']) {
  console.log('Opening browser on http://localhost:' + PORT);
  open('http://localhost:' + PORT);
}

