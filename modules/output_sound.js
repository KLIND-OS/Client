const { exec } = require('child_process');

class ___lowlevelapi_volume_devices {
    static getAll(callback) {
        exec(`pactl list sinks | grep -ie "description:"|cut -d: -f2`, { name: "KLIND OS" }, function (error, stdout, stderr) {
            if (error) {
                throw new Error("Filed to get all devices!")
            }
            else {
                var all = stdout.split("\n")
                var ret = []
                for (const string of all) {
                    if (string.trim() == "") continue
                    ret.push(string.trim())
                }
                callback(ret)
            }
        })
    }
    static getDefault(callback) {
        exec(`pactl list sinks | grep -A1 "Name: $(pactl info | grep "Default Sink" | awk '{print $3}')" | grep "Description" | awk -F": " "{print \$2}"`,
        { name: "KLIND OS" },
        function (error, stdout, stderr) {
            if (error) {
                throw new Error("Filed to set device!")
            }
            else {
                callback(stdout.replace("Description: ", "").trim())
            }
        })
    }
    static set(description) {
        exec(`pactl set-default-sink $(pactl list sinks|grep -C2 -F "Description: ${description}"|grep Name|cut -d: -f2|xargs)`,
        { name: "KLIND OS" },
        function (error, stdout, stderr) {
            if (error) {
                throw new Error("Filed to set device!")
            }
        })
    }
}

class Volume {
    static getVolume(callback) {
        exec("pamixer --get-volume", { name: 'KLIND OS' }, function (error, stdout, stderr) {
            if (error) {
                throw new Error("Failed to get volume!")
            } else {
                callback(parseInt(stdout))
            }
        });
    }
    static up() {
        exec("pamixer -u")
        exec("pamixer -i 5")
    }
    static down() {
        exec("pamixer -u")
        exec("pamixer -d 5")
    }
    static change(volume) {
        exec(`pamixer --set-volume ${volume}`)
    }
    static Devices = ___lowlevelapi_volume_devices
}

module.exports = Volume