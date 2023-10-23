const { exec } = require('child_process');
class Apps {
    static openBluetooth() {
        exec('notify-send "Pro zavření okna stiskněte Win + Shift + C"')
        exec("blueman-manager")
    }
}
module.exports = Apps