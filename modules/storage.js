const path = require("path")
const os = require("os")

module.exports = (window, storage) => {
  window.tempDataInfo = "";
  storage.setDataPath(path.join(os.homedir(), "usrfiles"));
  window.storage = storage;
  const originalget = window.storage.get;
  window.storage.get = (key, options, callback) => {
    key = key.replaceAll("/", "$");
    return originalget(key, options, callback);
  };

  const originalGetMany = window.storage.getMany;
  window.storage.getMany = (keys, options, callback) => {
    keys = keys.map((path) => path.replaceAll("/", "$"));
    return originalGetMany(keys, options, callback);
  };

  const originalGetSync = window.storage.getSync;
  window.storage.getSync = (key, options) => {
    key = key.replaceAll("/", "$");
    return originalGetSync(key, options);
  };

  const originalHas = window.storage.has;
  window.storage.has = (key, options, callback) => {
    key = key.replaceAll("/", "$");
    return originalHas(key, options, callback);
  };

  const originalRemove = window.storage.remove;
  window.storage.remove = (key, options, callback) => {
    key = key.replaceAll("/", "$");
    return originalRemove(key, options, callback);
  };

  const originalSet = window.storage.set;
  window.storage.set = (key, json, options, callback, retries) => {
    key = key.replaceAll("/", "$");
    return originalSet(key, json, options, callback, retries);
  };

  const originalSetSync = window.storage.setSync;
  window.storage.setSync = (key, json, options) => {
    key = key.replaceAll("/", "$");
    return originalSetSync(key, json, options);
  };
};
