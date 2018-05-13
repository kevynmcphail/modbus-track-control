// create an empty modbus client
var ModbusRTU         = require("modbus-serial");
var Drive             = require("./drive.js");
var winston           = require('winston');
var crc16             = require('./crc16.js')
var lrc               = require('./lrc.js')
var SerialPort        = require('serialport');
var emitter           = require("events");
var express           = require('express');
var expressLayouts    = require("express-ejs-layouts");
var http 			        = require("http");
var path              = require('path');
var app               = express();

var DRIVE_ADDRESS = 1;
var WRITE_REGISTER = 6;
var READ_REGISTER = 3;

/* Command Infos

Set Up DIs for Modbus Control      = Regsiter: 308, Command: FF3E
Seek Home                          = Register: 407, Command: 8
Trigger                            = Register: 407, Command: 4
Alarm Reset                        = Register: 407, Command: 2
Position Command Select 0          = Register: 407, Command: 10
Position Command Select 1          = Register: 407, Command: 20

*///----------------------------------------------------------------------------

// Logger ----------------------------------------------------------------------
var logger = new (winston.Logger)({
    levels: {info: 0, notice: 1, warning: 2, success: 3, error: 4},
    colors: {info: "blue", notice: "yellow", warning: "magenta", success:"green", error: "red"},
    transports: [
        new winston.transports.Console({
            level: "error",
            colorize: true
        })
    ]
});

// Server/App ------------------------------------------------------------------

app.set('views', path.join(__dirname, 'views')); // set the views folder in this directory as the one the app references
app.set('view engine', 'ejs'); // set the views engine to look for .ejs files
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));

var server = http.createServer(app);
server.listen(8003, function() {
	logger.info('==== APP ====', 'Server Created')
});

var router = express.Router();

app.get('/', function(req,res) {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Socket IO -------------------------------------------------------------------

var io = require("socket.io")(server);

var socket = io.of('/controller');

socket.on('connection', function(socket) {
	logger.info('==== APP ====', 'Page Conencted to Socket');

	socket.on('query', function(packet) {
		logger.notice('== APP ====', 'Received Command')
    var msg = buildPacket(DRIVE_ADDRESS, WRITE_REGISTER, packet.register, packet.data);//'010603000002'
    //console.log(msg);
    var msgLRC = (lrc(msg));
    //console.log(msgLRC.toString(16));
    msg_string = ':' + buffToString(msg).toUpperCase() + msgLRC.toString(16).toUpperCase() + '\r\n';
    //console.log(msg_string);
    drive.write(msg_string);
	})

});

// Drive ------------------------------------------------------------------------------------------

var drive = new Drive();

SerialPort.list(function (err, ports) {
   ports.forEach(function(port) {
     if (port.manufacturer == 'Prolific') {
       drivePort = port.comName;
       drive.initialize(port.comName, 19200);
       //console.log(drivePort);
     }
   });
 });

drive.on('open', function() {
	logger.notice('== APP ====', 'Drive Connected');


})

var buildPacket  = function (address, command, register, data) {
  var packet = Buffer.allocUnsafe(6).fill(0);
  packet.writeUIntBE(address,0,1);
  packet.writeUIntBE(command,1,1);
  packet.writeUIntBE(register,2,2);
  packet.writeUIntBE(data,4,2);
  console.log(packet);
  return packet;
}

var buffToString = function (buffer) {
  var buffString = '';
  for (var i = 0; i < buffer.length; i++) {
    var value = buffer[i].toString(16);
    if (value.length == 1) {
      value = '0'+value;
    }
    buffString += value;
  }
  console.log(buffString);
  return buffString;
}
