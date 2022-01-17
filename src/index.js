const express = require('express');
const http = require('http');
const socketIo = require('./socket/init');
const Supervisor = require('./routes/index');
const SupervisorController = require('./routes/supervisor.controller');
const UavcastController = require('./routes/uavcast.controller');
class Server {
  constructor() {
    this.express = express;
    this.app = this.express();
    this.http = http.createServer(this.app);
    this.io = socketIo.initialize(this.http);
    this.port = 32500;
  }

  socketMiddleware() {
    this.io.on('connection', (socket) => {
      console.log('client connected to supervisor');
      // We can assume user return from "update application"
      socket.emit('SUPERVISOR_MESSAGES', '\nApplication has successfully started.\nPlease reload this window');
    });
    new Supervisor(this.io);
    new SupervisorController();
    new UavcastController();
  }

  /* Including app Routes ends */
  start() {
    this.socketMiddleware();

    // Start your app.
    this.http.listen(this.port, () => {
      console.log('Supervisor listen at: ' + this.port);
    });
  }
}
const App = new Server();
App.start();
