const { spawn } = require('child_process');

class HostController {
  constructor() {}
  reboot(callback) {
    const rebootCommand = `echo "sudo shutdown -r now" > /home/uavpipe`;
    spawn(rebootCommand, { shell: true });
    callback(true);
  }
}

module.exports = HostController;
