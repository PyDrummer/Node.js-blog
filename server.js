var http = require("http");

var fs = require("fs");
var path = require("path");
var mime = require("mime");

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("It's alive!");
  response.end();
}).listen(3000);

// This code performs a request for some resource. When the response comes back, an anonymous function is called. It contains the argument data, which is the data received from that request.
$.post('/some_requested_resource', function(data) {
  console.log(data);
});

// create send404() function. It will handle the sending of 404 error, which usually appears when requested file doesn't exist:
function send404(response) {
  response.writeHead(404, {"Content-type" : "text/plain"});
  response.write("Error 404: resource not found");
  response.end();
}

// define sendPage() function. It first writes the header and then sends the contents of the file:
function sendPage(response, filePath, fileContents) {
  response.writeHead(200, {"Content-type" : mime.lookup(path.basename(filePath))});
  response.end(fileContents);
}

// define how our server will handle responses. This function will return the content of the requested file or the 404 error otherwise:
function serverWorking(response, absPath) {
  fs.exists(absPath, function(exists) {
    if (exists) {
      fs.readFile(absPath, function(err, data) {
        if (err) {
          send404(response)
        } else {
          sendPage(response, absPath, data);
        }
      });
    } else {
      send404(response);
    }
  });
}

//create the HTTP server
var server = http.createServer(function(request, response) {
  var filePath = false;

  if (request.url == '/') {
    filePath = "public/index.html";
  } else {
    filePath = "public" + request.url;
  }

  var absPath = "./" + filePath;
  serverWorking(response, absPath);
});

var port_number = server.listen(process.env.PORT || 3000);