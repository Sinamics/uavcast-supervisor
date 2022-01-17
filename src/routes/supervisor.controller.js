const { spawn } = require('child_process');

//Docker json format
//https://docs.docker.com/config/formatting/
// example::  --format='{{json .}}'
class SupervisorController {
  constructor() {}
  startContainer(version, callback) {
    // update supervisor using the uavpipe fifo
    const supervisorInstallUrl = `
    echo "docker stop supervisor && docker rm supervisor &&
    docker run --restart unless-stopped --name supervisor \
    --net=host -d -v /var/run/docker.sock:/var/run/docker.sock \
    -v /home/uavcast/uavpipe:/home/uavpipe \
    sinamics/uavcast-supervisor:${version}
    " > /home/uavpipe
    `;
    const child = spawn(supervisorInstallUrl, { shell: true });
    child.stdout.on('data', async (data) => {
      console.log(data.toString('utf8'));
      // callback(data.toString('utf8'));
    });
    child.stderr.on('data', async (error) => {
      console.log(error.toString('utf8'));
    });
    child.on('exit', () => {
      callback('supervisor is restarting \n');
    });
  }
  downloadNewVersion(version, callback) {
    const child = spawn(`docker pull sinamics/uavcast-supervisor:${version}`, { shell: true });
    child.stdout.on('data', async (data) => {
      callback(data.toString('utf8'));
    });
    child.stderr.on('data', async (error) => {
      callback(error.toString('utf8'));
    });
    child.on(
      'exit',
      function (exitCode) {
        if (exitCode === 0) {
          this.startContainer(version, (response) => {
            callback(response);
          });
        }
      }.bind(this)
    );
  }
}

module.exports = SupervisorController;
