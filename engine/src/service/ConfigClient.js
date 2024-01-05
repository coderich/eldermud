const FS = require('fs');
const Path = require('path');
const Chance = require('chance').Chance();
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
      if (stat?.isDirectory()) this.mergeConfig(filepath, $paths);
      else if (!name.startsWith('.')) this.set($paths.join('.'), Config.parseFile(filepath));
    });
  }

  static #decorate(config) {
    //
    Object.entries(config.get()).forEach(([type, models]) => {
      if (!['app', 'player'].includes(type)) {
        Object.entries(models).forEach(([key, value]) => {
          const ns = `${type}.${key}`;
          config.set(`${ns}.id`, key);
          config.set(`${ns}.type`, type);
          config.set(`${ns}.toString`, () => ns);
        });
      }
    });

    Object.entries(config.get('map')).forEach(([key, map], i) => {
      Object.entries(map.doors).forEach(([id, door], j) => {
        config.set(`map.${key}.doors.${id}.id`, id);
        config.set(`map.${key}.doors.${id}.type`, 'door');
        config.set(`map.${key}.doors.${id}.toString`, () => `map.${key}.doors.${id}`);
      });

      Object.entries(map.rooms).forEach(([id, room], j) => {
        config.set(`map.${key}.rooms.${id}.id`, id);
        config.set(`map.${key}.rooms.${id}.mapId`, (i * 1000) + j + 1);
        config.set(`map.${key}.rooms.${id}.type`, 'room');
        config.set(`map.${key}.rooms.${id}.description`, Chance.paragraph());
        config.set(`map.${key}.rooms.${id}.items`, new Set());
        config.set(`map.${key}.rooms.${id}.units`, new Set());
        config.set(`map.${key}.rooms.${id}.toString`, () => `map.${key}.rooms.${id}`);
      });
    });
  }
};
