var sio = require('socket.io');

var io = null;

exports.io = function () {
  // require('socket.io-stream')(io);
  return io;
};

exports.initialize = function (server) {
  io = sio(server);
  // io.sockets.setMaxListeners(20);
  return io;
};
