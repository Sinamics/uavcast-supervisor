const SupervisorCont = require('./supervisor.controller');
const UavcastCont = require('./uavcast.controller');
const HostCont = require('./host.controller');

class Supervisor {
  constructor(io) {
    this.io = io;
    this.listners();
    this.supervisorController = new SupervisorCont(this.io);
    this.uavcastController = new UavcastCont(this.io);
    this.hostcontroller = new HostCont(this.io);
  }
  listners() {
    this.io.on('connection', (socket) => {
      // ?download and update container to user selected version
      socket.on('DOWNLOAD_AND_UPDATE_UAVCAST_CONTAINER', async (version, callbak) => {
        try {
          this.uavcastController.downloadNewVersion(version, (response) => {
            socket.emit('SUPERVISOR_MESSAGES', response);
          });
          socket.emit('SUPERVISOR_MESSAGES', 'Update in progress, please wait...\nThis could take a moment');
          callbak({ message: 'Supervisor is working...' });
        } catch (error) {
          callbak({ errors: [{ message: error, path: 'supervisor, DOWNLOAD_AND_UPDATE_UAVCAST_CONTAINER' }] });
        }
      });
      // ?download and update container to user selected version
      socket.on('DOWNLOAD_AND_UPDATE_SUPERVISOR_CONTAINER', async (version, callbak) => {
        try {
          this.supervisorController.downloadNewVersion(version, (response) => {
            socket.emit('SUPERVISOR_MESSAGES', response);
          });

          callbak({ message: 'Supervisor is working...' });
        } catch (error) {
          callbak({ errors: [{ message: error, path: 'supervisor, DOWNLOAD_AND_UPDATE_SUPERVISOR_CONTAINER' }] });
        }
      });
      // ?download and update container to user selected version
      socket.on('RESTART_HOST', async (_, callbak) => {
        try {
          this.hostcontroller.reboot((response) => {
            callbak(null, response);
          });
        } catch (error) {
          console.log(error);
          callbak({ errors: [{ message: error, path: 'supervisor, RESTART_HOST' }] });
        }
      });
    });
  }
}

module.exports = Supervisor;
