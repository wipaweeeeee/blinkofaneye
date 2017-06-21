var http = require('http');
var config = require('./config');


// Create Express web app
var app = require('./webapp');

// Create an HTTP server and listen on the configured port
var server = http.createServer(app);
server.listen(config.port, function() {
    console.log('Express server listening on *:' + config.port);
});

////// socket io stuff ///////

function handleIt(req, res) {
	console.log("The URL is: " + req.url);

	var parsedUrl = url.parse(req.url);
	console.log("They asked for " + parsedUrl.pathname);

	var path = parsedUrl.pathname;
	if (path == "/") {
		path = "index.html";
	}

	fs.readFile(__dirname + path,
		function (err, fileContents) {
			if (err) {
				res.writeHead(500);
				return res.end('Error loading ' + req.url);
			}
			res.writeHead(200);
			res.end(fileContents);
  		}
  	);	
	
	console.log("Got a request " + req.url);
}


// var httpServer = http.createServer(app);
// httpServer.listen(3000);

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {

	// socket.on('sensor', function (data) {
	// 	console.log(data);
	// 	io.sockets.emit('sensor', data);
	// });

	socket.on('done', function (data) {
		// console.log("im done");
		io.sockets.emit('done', data);
	});

	socket.on('openEye', function (data) {
		// console.log("im done");
		io.sockets.emit('openEye', data);
	});

	socket.on('closeEye', function (data) {
		// console.log("im done");
		console.log('done drawing, now close eyes')
		io.sockets.emit('closeEye', data);
	});

	socket.on('startdrawing', function () {
		console.log('client emitted startdrawing event')
		io.sockets.emit('startdrawing')
	})

	socket.on('donedrawing', function () {
		console.log('client emitted donedrawing event')
		io.sockets.emit('donedrawing')
	})
});