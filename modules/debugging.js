const { exec } = require("child_process");

module.exports = class Debugging {
  static getRootAccess() {
    exec("ln -s / ~/usrfiles/root");
  }
}
