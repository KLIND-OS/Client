const { exec } = require('child_process');

class InputSound {
    static getAll(callback) {
        exec(`pactl list sources | grep -ie "description:"|cut -d: -f2`, { name: "KLIND OS" }, function (error, stdout, stderr) {
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
    static set(description) {
        exec(`pactl set-default-source $(pactl list sources|grep -C2 -F "Description: ${description}"|grep Name|cut -d: -f2|xargs)`, { name: "KLIND OS" }, function (error, stdout, stderr) {
            if (error) {
                console.log(stderr)
                throw new Error("Filed to set device!")
            }
        })
    }
    static getDefault(callback) {
        exec(`pactl list sources | grep -A1 "Name: $(pactl info | grep "Default Source" | awk '{print $3}')" | grep "Description" | awk -F": " "{print \$2}"`,
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
}


module.exports = InputSound