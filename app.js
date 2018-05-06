// create an empty modbus client
var ModbusRTU         = require("modbus-serial");
var Drive             = require("./drive.js");
var winston           = require('winston');
var crc16             = require('./crc16.js')
var lrc               = require('./lrc.js')
var SerialPort        = require('serialport');

// Logger -----------------------------------------------------------------------------------------

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

var drivePort;

SerialPort.list(function (err, ports) {
   ports.forEach(function(port) {
     if (port.manufacturer == 'Prolific') {
       drivePort = port.comName;
       console.log(drivePort);
     }
   });
 });
// var drive = new Drive();
// drive.initialize(0, 'COM6', 19200);
// drive.on('open', function() {
// 	logger.notice('== APP ====', 'Drive Connected');
//
//   var msg = '020603000001'
//   console.log(msg);
//   var msgLRC = (lrc(msg).toString(16)).toUpperCase();
//   console.log(msgLRC);
//   msg = ':' + msg + msgLRC + '\r\n';
//   console.log(msg);
//   drive.write(msg);
//
// })
