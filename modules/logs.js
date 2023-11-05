const fs = require("fs")

class Logs {
  static getNohupLogs(callback) {
    fs.readFile("/root/nohup.out", 'utf8', (err, data) => {
      if (err) {
        callback(null, err)
      }
      else {
        const lines = data.trim().split("\n")
        callback(lines)
      }
    })
  }
}

module.exports = Logs
