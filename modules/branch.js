const { exec } = require('child_process');
class Branch {
  static getSelected(callback) {
    exec('cat ~/branch', (error, stdout, stderr) => {
      if (error) {
        callback(stderr);
      }
      callback(stdout.trim());
    })
  }
  static getAvailable(callback) {
    fetch("http://localhost:8000/klindos/branches/getAll")
    .then(res => res.json())
    .then(res => {
      callback(res);
    })
  }
  static setBranch(branchName, callback) {
    this.getAvailable((data) => {
      if (data.includes(branchName)) {
        exec("rm ~/branch", (error) => {
          if (error) callback(false);

          exec("touch ~/branch", (error) => {
            if (error) callback(false);

            exec("echo '"+branchName+"' >> ~/branch", (error) => {
              if (error) callback(false);

              callback(true);
            })
          })
        })
      }
      else {
        callback(false);
        throw new Error("Selected branch is invalid: "+branchName);
      }
    })
  }
}
module.exports = Branch;
