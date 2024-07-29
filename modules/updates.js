const { exec } = require("child_process");
const util = require("util");

const execAsync = util.promisify(exec);

class Updates {
  static async update(callback) {
    if (await LowLevelApi.SuperLowLevel.isDev()) {
      return alert(
        "Chceš se zabít!!? NIKDY NESPOUŠTĚJ AKTUALIZACI PŘI DEVELOPMENTU!!!",
      );
    }

    LowLevelApi.Branch.getSelected(async (branch) => {
      try {
        callback("0%");
        await execAsync(`pacman -Suy --noconfirm`);
        callback("20%");

        await execAsync(`rm -rf /root/klindos-server/data`);
        callback("25%");

        await execAsync(
          `git clone --branch ${branch} --depth 1 https://github.com/KLIND-OS/Server /root/klindos-server/data`,
        );
        callback("45%");

        await execAsync(
          `git clone --branch ${branch} --depth 1 https://github.com/KLIND-OS/Client /root/KLIND-OS-Client`,
        );
        callback("50%");

        await execAsync(`(cd /root/KLIND-OS-Client && npm install)`);
        callback("60%");

        await execAsync(`(cd /root/KLIND-OS-Client && npm run build)`);
        callback("80%");

        await execAsync(`rm -rf /root/client.AppImage`);
        callback("83%");

        await execAsync(
          `cp /root/KLIND-OS-Client/dist/*.AppImage /root/client.AppImage`,
        );
        callback("86%");

        await execAsync(`rm -rf /root/KLIND-OS-Client`);
        callback("90%");

        await execAsync(`xmonad --recompile`);

        callback(true);
      } catch (error) {
        console.log(error);
        callback("0%", "Error!");
      }
    });
  }
}

module.exports = Updates;
