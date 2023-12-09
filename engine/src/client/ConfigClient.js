const FS = require('fs');
const Path = require('path');
const Config = require('@coderich/config');

const appRootPath = Path.join(__dirname, '..', '..');

module.exports = class ConfigClient extends Config {
  constructor(dir) {
    super();
    this.mergeConfig(dir);
    this.merge(Config.parseFile(`${appRootPath}/app.config.yml`));
    ConfigClient.#decorate(this);
  }

  mergeConfig(dir, paths = []) {
    FS.readdirSync(dir).forEach((filename) => {
      const { name } = Path.parse(filename);
      const filepath = `${dir}/${filename}`;
      const stat = FS.statSync(filepath);
      const $paths = paths.concat(name);
      const path = $paths.join('.');
      if (stat?.isDirectory()) this.mergeConfig(filepath, $paths);
      else this.set(path, Config.parseFile(filepath));
    });
  }

  static #decorate(config) {
    Object.entries(config.get('map')).forEach(([key, map]) => {
      Object.entries(map.rooms).forEach(([id, room]) => {
        config.set(`map.${key}.rooms.${id}.id`, id);
        config.set(`map.${key}.rooms.${id}.type`, 'room');
        config.set(`map.${key}.rooms.${id}.items`, new Set());
        config.set(`map.${key}.rooms.${id}.units`, new Set());
      });
    });
  }
};
