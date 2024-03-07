const { exec } = require("child_process");
class Apps {
  static openBluetooth() {
    exec("blueman-manager");
    exec("python ~/scripts/closebtn.py blueman-manager");
  }
  static openNetwork() {
    exec("nm-connection-editor");
    exec("python ~/scripts/closebtn.py nm-connection-editor");
  }
}
module.exports = Apps;
