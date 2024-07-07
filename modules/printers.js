const { exec } = require("child_process");

class Printers {
  static listAll(callback) {
    exec("lpstat -a | awk '{print $1}'", function (error, stdout, stderr) {
      if (error) {
        callback(new Error("Cannnot read printers"));
        return;
      }
      if (stdout.trim() == "lpstat: No destinations added.") {
        callback([]);
        return;
      }

      var data = stdout.split("\n");
      var final = [];
      for (const printerName of data) {
        if (printerName.trim() == "") continue;

        final.push(printerName.trim());
      }
      callback(final);
    });
  }
}

module.exports = Printers;
