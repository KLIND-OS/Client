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
        callback("0%", "Aktualizování systému");
        await execAsync(`pacman -Suy --noconfirm`);
        callback("20%", "Aktualizace grafického rozhraní");

        await execAsync(`rm -rf /root/klindos-server/data`);
        callback("25%", "Aktualizace grafického rozhraní");

        await execAsync(
          `git clone --branch ${branch} --depth 1 https://github.com/KLIND-OS/Server /root/klindos-server/data`,
        );
        callback("45%", "Aktualizace klienta");

        await execAsync(
          `git clone --branch ${branch} --depth 1 https://github.com/KLIND-OS/Client /root/KLIND-OS-Client`,
        );
        callback("50%", "Aktualizace klienta");

        await execAsync(`(cd /root/KLIND-OS-Client && npm install)`);
        callback("60%", "Aktualizace klienta");

        await execAsync(`(cd /root/KLIND-OS-Client && npm run build)`);
        callback("80%", "Aktualizace klienta");

        await execAsync(`rm -rf /root/client.AppImage`);
        callback("83%", "Aktualizace klienta");

        await execAsync(
          `cp /root/KLIND-OS-Client/dist/*.AppImage /root/client.AppImage`,
        );
        callback("86%", "Aktualizace klienta");

        await execAsync(`rm -rf /root/KLIND-OS-Client`);
        callback("90%", "Aktualizace window manager");

        await execAsync(`xmonad --recompile`);
        callback("93%", "Aktualizace NodeJS knihoven");

        await execAsync(`(cd ~/packages && npm update)`);
        callback(true);
      } catch (error) {
        console.log(error);
        callback("0%", "Error!");
      }
    });
  }
}

module.exports = Updates;
