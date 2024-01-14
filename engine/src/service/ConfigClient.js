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
      if (!['app', 'help', 'player'].includes(type)) {
        Object.entries(models).forEach(([key, value]) => {
          const ns = `${type}.${key}`;
          config.set(`${ns}.id`, key);
          config.set(`${ns}.type`, type);
          config.set(`${ns}.toString`, () => ns);
        });
      }

      // if (['npc', 'creature', 'player'].includes(type)) {
      //   Object.values(models).forEach((model) => {
      //     if (!model.ac) config.set(`${model}.ac`, 0);
      //     if (!model.dr) config.set(`${model}.dr`, 0);
      //     if (!model.acc) config.set(`${model}.acc`, 0);
      //     if (!model.crit) config.set(`${model}.crit`, 0);
      //     if (!model.dodge) config.set(`${model}.dodge`, 0);
      //     if (!model.ma) config.set(`${model}.ma`, 0);
      //     if (!model.maa) config.set(`${model}.mma`, 0);
      //   });
      // }
    });

    Object.entries(config.get('map')).forEach(([key, map], i) => {
      if (map.doors) {
        Object.entries(map.doors).forEach(([id, door], j) => {
          config.set(`map.${key}.doors.${id}.id`, id);
          config.set(`map.${key}.doors.${id}.type`, 'door');
          config.set(`map.${key}.doors.${id}.toString`, () => `map.${key}.doors.${id}`);
        });
      }

      Object.entries(map.rooms).forEach(([id, room], j) => {
        config.set(`map.${key}.rooms.${id}.id`, id);
        config.set(`map.${key}.rooms.${id}.mapId`, (i * 1000) + j + 1);
        config.set(`map.${key}.rooms.${id}.type`, 'room');
        if (!room.description) config.set(`map.${key}.rooms.${id}.description`, Chance.paragraph());
        config.set(`map.${key}.rooms.${id}.items`, new Set());
        config.set(`map.${key}.rooms.${id}.units`, new Set());
        config.set(`map.${key}.rooms.${id}.toString`, () => `map.${key}.rooms.${id}`);
      });
    });
  }
};
