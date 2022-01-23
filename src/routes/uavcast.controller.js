const { spawn } = require('child_process');

class UavcastController {
  constructor() {}
  startContainer(version, callback) {
    const uavcastInstallUrl = `
    echo "Restarting uavcast...\n" && docker stop uavcast && \ 
    echo "Deleting previous version\n" && docker rm uavcast && \ 
    echo "Starting ${version} uavcast container...\n" && docker run \
    --restart unless-stopped --name uavcast -d \
    -v uavdata:/app/uavcast/data \
    -v /var/lib/zerotier-one:/var/lib/zerotier-one \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v /dev:/dev \
    --privileged=true --net=host sinamics/uavcast:${version}
    `;

    // const uavcastInstallUrl = `curl -s http://install.uavmatrix.com/next/ | sudo bash -s -- -v ${version} -s`;
    const child = spawn(uavcastInstallUrl, { shell: true });
    child.stdout.on('data', async (data) => {
      callback(data.toString('utf8'));
    });
    child.stderr.on('data', async (error) => {
      callback(error.toString('utf8'));
    });
  }
  downloadNewVersion(version, callback) {
    const child = spawn(`docker pull sinamics/uavcast:${version}`, { shell: true });
    child.stdout.on('data', async (data) => {
      // console.log(data.toString('utf8'));
      // socket.emit('S_SUPERVISOR_MESSAGES', data.toString('utf8'));
      callback(data.toString('utf8'));
    });
    child.stderr.on('data', async (error) => {
      //   console.log(error.toString('utf8'));
      callback(error.toString('utf8'));
      // socket.emit('S_SUPERVISOR_MESSAGES', error.toString('utf8'));
    });
    child.on(
      'exit',
      function (exitCode) {
        console.log('Child exited with code: ' + exitCode);
        if (exitCode === 0) {
          this.startContainer(version, (response) => {
            callback(response);
          });
        }
      }.bind(this)
    );
  }
}

module.exports = UavcastController;
