const { exec } = require("child_process");
class Updates {
  static update(callback) {
    LowLevelApi.Branch.getSelected((branch) => {
      callback("0%", "Aktualizování systému");
      exec(`pacman -Suy --noconfirm`, (error) => {
        if (error) {
          console.log(error);
          callback("0%", "Error!");
          return;
        }
        callback("20%", "Aktualizace grafického rozhraní");
        exec(`rm -rf /root/klindos-server/data`, (error) => {
          if (error) {
            console.log(error);
            callback("0%", "Error!");
            return;
          }
          callback("25%", "Aktualizace grafického rozhraní");
          exec(
            `git clone --branch ${branch} --depth 1 https://github.com/KLIND-OS/Server /root/klindos-server/data`,
            (error) => {
              if (error) {
                console.log(error);
                callback("0%", "Error!");
                return;
              }
              callback("45%", "Aktualizace klienta");
              exec(
                `git clone --branch ${branch} --depth 1 https://github.com/KLIND-OS/Client /root/KLIND-OS-Client`,
                (error) => {
                  if (error) {
                    console.log(error);
                    callback("0%", "Error!");
                    return;
                  }
                  callback("50%", "Aktualizace klienta");
                  exec(`(cd /root/KLIND-OS-Client && npm install)`, (error) => {
                    if (error) {
                      console.log(error);
                      callback("0%", "Error!");
                      return;
                    }
                    callback("60%", "Aktualizace klienta");
                    exec(
                      `(cd /root/KLIND-OS-Client && npm run build)`,
                      (error) => {
                        if (error) {
                          console.log(error);
                          callback("0%", "Error!");
                          return;
                        }
                        callback("80%", "Aktualizace klienta");
                        exec(`rm -rf /root/client.AppImage`, (error) => {
                          if (error) {
                            console.log(error);
                            callback("0%", "Error!");
                            return;
                          }
                          callback("83%", "Aktualizace klienta");
                          exec(
                            `cp /root/KLIND-OS-Client/dist/*.AppImage /root/client.AppImage`,
                            (error) => {
                              if (error) {
                                console.log(error);
                                callback("0%", "Error!");
                                return;
                              }
                              callback("86%", "Aktualizace klienta");
                              exec(`rm -rf /root/KLIND-OS-Client`, (error) => {
                                if (error) {
                                  console.log(error);
                                  callback("0%", "Error!");
                                  return;
                                }
                                callback("90%", "Aktualizace window manager");
                                exec(`xmonad --recompile`, (error) => {
                                  if (error) {
                                    console.log(error);
                                    callback("0%", "Error!");
                                    return;
                                  }
                                  callback(
                                    "93%",
                                    "Aktualizace NodeJS knihoven",
                                  );
                                  exec(
                                    `(cd ~/packages && npm update)`,
                                    (error) => {
                                      if (error) {
                                        console.log(error);
                                        callback("0%", "Error!");
                                        return;
                                      }
                                      callback(true);
                                    },
                                  );
                                });
                              });
                            },
                          );
                        });
                      },
                    );
                  });
                },
              );
            },
          );
        });
      });
    });
  }
}

module.exports = Updates;
