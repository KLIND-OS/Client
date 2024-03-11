const { exec } = require("child_process");
class Updates {
  static update(callback) {
    LowLevelApi.Branch.getSelected((branch) => {
      callback("0%", "Aktualizování systému");
      exec(`pacman -Suy --noconfirm`, (error) => {
        if (error) {
          callback("0%", "Error!");
          return;
        }
        callback("25%", "Aktualizace grafického rozhraní");
        exec(`rm -rf /root/klindos-server/data`, (error) => {
          if (error) {
            callback("0%", "Error!");
            return;
          }
          callback("30%", "Aktualizace grafického rozhraní");
          exec(
            `git clone --branch ${branch} --depth 1 https://github.com/JZITNIK-github/KLIND-OS-Server /root/klindos-server/data`,
            (error) => {
              if (error) {
                callback("0%", "Error!");
                return;
              }
              callback("50%", "Aktualizace klienta");
              exec(
                `git clone --branch ${branch} --depth 1 https://github.com/JZITNIK-github/KLIND-OS-Client /root/KLIND-OS-Client`,
                (error) => {
                  if (error) {
                    callback("0%", "Error!");
                    return;
                  }
                  callback("55%", "Aktualizace klienta");
                  exec(`(cd /root/KLIND-OS-Client && npm install)`, (error) => {
                    if (error) {
                      callback("0%", "Error!");
                      return;
                    }
                    callback("65%", "Aktualizace klienta");
                    exec(
                      `(cd /root/KLIND-OS-Client && npm run build)`,
                      (error) => {
                        if (error) {
                          callback("0%", "Error!");
                          return;
                        }
                        callback("85%", "Aktualizace klienta");
                        exec(`rm -rf /root/client.AppImage`, (error) => {
                          if (error) {
                            callback("0%", "Error!");
                            return;
                          }
                          callback("88%", "Aktualizace klienta");
                          exec(
                            `cp /root/KLIND-OS-Client/dist/*.AppImage /root/client.AppImage`,
                            (error) => {
                              if (error) {
                                callback("0%", "Error!");
                                return;
                              }
                              callback("91%", "Aktualizace klienta");
                              exec(`rm -rf /root/KLIND-OS-Client`, (error) => {
                                if (error) {
                                  callback("0%", "Error!");
                                  return;
                                }
                                callback("98%", "Aktualizace window manager");
                                exec(`xmonad --recompile`, (error) => {
                                  if (error) {
                                    callback("0%", "Error!");
                                    return;
                                  }
                                  callback(true);
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
