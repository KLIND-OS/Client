const { exec } = require("child_process");
const { promisify } = require("util");
const execPromise = promisify(exec);

class DiskManagement {
  static async unmount(disk) {
    await execPromise(`sudo umount /mnt/${disk}*`);
    await execPromise(`sudo rm -rf /mnt/${disk}*`);
    await execPromise(`sudo rm ~/usrfiles/Devices/${disk}*`);

    return true;
  }
}

module.exports = DiskManagement;
