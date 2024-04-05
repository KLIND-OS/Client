const { exec } = require("child_process");
const { promisify } = require("util");
const execPromise = promisify(exec);

class TaskManager {
  static async getProcessorInfo() {
    const data = await execPromise(
      `top -bn1 | grep "Cpu(s)" | sed "s/.*, *\\([0-9.]*\\)%* id.*/\\1/" | awk '{print 100 - $1}'`,
    );
    const stdout = data.stdout.trim();
    const percentage = parseFloat(stdout);
    const nameData = await execPromise(
      `grep "model name" /proc/cpuinfo | head -n1 | awk -F ": " '{print $2}'`,
    );
    const processorName = nameData.stdout.trim();

    return {
      name: processorName,
      usage: percentage,
    };
  }

  static async getRamInfo() {
    const memTotalData = await execPromise(
      `grep "MemTotal" /proc/meminfo | awk '{print $2}'`,
    );
    const memFreeData = await execPromise(
      `grep "MemFree" /proc/meminfo | awk '{print $2}'`,
    );
    const memFree = parseInt(memFreeData.stdout.trim());
    const memTotal = parseInt(memTotalData.stdout.trim());
    const memUsed = memTotal - memFree;

    return {
      total: memTotal,
      free: memFree,
      used: memUsed,
    };
  }

  static async getSystemProcesses() {
    const processesData = await execPromise(`ps -e`);
    const processesOutput = processesData.stdout.trim();

    const list = processesOutput.split("\n");
    list.shift();

    const data = list.map((el) => {
      return {
        pid: el.trim().split(" ")[0].trim(),
        name: el.trim().split(" ")[el.trim().split(" ").length - 1].trim(),
      };
    });

    return data;
  }

  static async killProcess(pid) {
    await execPromise(`kill ${pid}`);
  }
}

module.exports = TaskManager;
