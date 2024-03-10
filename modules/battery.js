const { exec } = require("child_process");
const { promisify } = require("util");

const execPromise = promisify(exec);
class Battery {
  static async getBattery() {
    const content = await execPromise("acpi");
    const { stdout, stderr } = content;

    if (stderr.trim() == "No support for device type: power_supply") {
      return {number: 0, status: "Unknown", percentage: "100%", remaining: "infinite", battery: false}
    }


    const lines = stdout.split("\n");
    const parts = lines[0].split(", ");
    const batteryNumber = parts[0].split(":")[0].split(" ")[1];
    const batteryStatus = parts[0].split(": ")[1];
    const batteryPercentage = parts[1];
    const batteryRemaining = parts[2];
    return {
      number: batteryNumber,
      status: batteryStatus,
      percentage: batteryPercentage,
      remaining: batteryRemaining,
      battery: true
    };
  }
}

module.exports = Battery;
