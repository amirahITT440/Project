var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var term = require('term.js');

//setup the express app
var app = express();
//static file serving
app.use("/",express.static("./"));
//creating an HTTP server
var server = http.createServer(app).listen(8080);
var options = {
key: fs.readFileSync('/home/amirah95/project/key.pem'),
cert: fs.readFileSync('/home/amirah95/project/csr.pem')
};
//Create an HTTPS server
var server = https.createServer(options, app).listen(8080);
//bind the socket.io
var io = require('socket.io')(server);

//when a new socket connects
io.on('connection', function(socket){
//create terminal
var terms = term.spawn('sh', [], {
	name : 'xterm-color',
	cols : 80,
	rows : 30,
	cwd : process.env.HOME,
	env : process.env
});
//Listen on the terminal for output and send it to the client
terms.on('data', function(data){
	socket.emit('output', data);
});
//Listen on the client and send any input to the terminal
socket.on('input', function(data){
	terms.write(data);
});
//When socket disconnects, destroy the terminal
socket.on("disconnect", function(){
	terms.destroy();
	console.log("bye");
});
}); 
