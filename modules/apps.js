const { exec } = require('child_process');
class Apps {
  static openBluetooth() {
    exec('notify-send "Pro zavření okna stiskněte Win + Shift + C"')
    exec("blueman-manager")
  }
  static openNetwork() {
    exec('notify-send "Pro zavření okna stiskněte Win + Shift + C"')
    exec("nm-connection-editor")
  }
}
module.exports = Apps
