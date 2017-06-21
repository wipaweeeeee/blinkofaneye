var SerialPort = require("serialport");
var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);


//----------------Route--------------------//

app.use(express.static('public'));


http.listen(3000, function(){
  	console.log("");
    console.log("");
    console.log("---------------| Simple Seiral Example |-----------------");
    console.log("");
    console.log("Server is on port 3000");
});


var portNameChoice = ["/dev/cu.usbmodem14111", "/dev/cu.usbmodem14311"];
portName = null;

SerialPort.list(function (err, ports) {
  	ports.forEach(function (port) {

	    for(i=0; i < portNameChoice.length ;i++){

			if (portNameChoice[i] == port.comName) {
				portName = port.comName;
			}
	    }
	});

	if (portName != null) {

		console.log(portName);

		var port = new SerialPort(portName, {
		  baudRate: 9600,
		  parser: SerialPort.parsers.readline("\n"),
		});


		port.on('open', function() {
			console.log("opened");

		});

		var serialData = null;
		var client = require("socket.io-client")("http://ws1236.itp.io:3000");
		client.on('connect', function() {
			console.log('connecting to client');
			
			// client.on('done', function (data) {
			// 	// console.log("i am done drawing");
			// 	port.write("4");
			// });

			client.on('openEye', function (data) {
				console.log('im in openEye');
				port.write("1");
			});

			client.on('closeEye', function (data) {
				console.log('im in closeEye');
				port.write("2");
			})

			port.on('data', function (data) {
				console.log(data);

				if (data.trim() === 'startdrawing') {
					console.log('emit <startdrawing> event')
					client.emit('startdrawing')
				}

				if (data.trim() === 'donedrawing') {
					console.log('emit <donedrawing> event')
					client.emit('donedrawing')
				}

				// if(mySocket != undefined){
				// 	mySocket.emit("serialData",serialData);
				// }

				// num++;
				// if(num >= 10){
				// 	num = 0;
				// }

				// port.write("" + num);
				// port.write("0");
				// client.emit('sensor', data)
				
			})
		})
	} else {
		console.log("there is no port available");
	}
})

var num = 0;

//-----------------Socket.io----------------//

var mySocket = null;

io.on('connection', function(socket){

	mySocket = socket;

});
