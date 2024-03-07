const { exec } = require("child_process");
class Apps {
  static openBluetooth() {
    setTimeout(() => {
      exec("python ~/scripts/closebtn.py blueman-manager");
    }, 5000);
    exec("blueman-manager");
  }
  static openNetwork() {
    setTimeout(() => {
      exec("python ~/scripts/closebtn.py nm-connection-editor");
    }, 5000);
    exec("nm-connection-editor");
  }
}
module.exports = Apps;
