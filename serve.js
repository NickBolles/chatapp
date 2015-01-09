var host = "127.0.0.1";
var port = 1338;
var express = require("express");
var baseDir = __dirname;

var app = express();
app.use('/', express.static(baseDir));
app.listen(port, host);

console.log("Serving Directory \r\n" + baseDir + "\r\non port " + port);