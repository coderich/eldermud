const FS = require('fs');
const Path = require('path');
const Chance = require('chance').Chance();
const Config = require('@coderich/config');

const appRootPath = Path.join(__dirname, '..', '..');

module.exports = class ConfigClient extends Config {
  constructor() {
    super({}, {
      eq: (a, b) => Boolean(a === b),
      in: (a, ...arr) => arr.includes(a),
    });
    // this.mergeConfig(dir);
    this.merge(Config.parseFile(`${appRootPath}/app.config.yml`));
    this.merge(Config.parseFile(`${appRootPath}/app.secrets.yml`));
    this.merge(Config.parseEnv({ pick: ['app__redis__url'] }));
  }

  mergeConfig(dir, paths = []) {
    FS.readdirSync(dir).forEach((filename) => {
      const { name } = Path.parse(filename);
      const filepath = `${dir}/${filename}`;
      const stat = FS.statSync(filepath);
      const $paths = name === 'index' ? paths : paths.concat(name);

      if (stat?.isDirectory()) {
        this.mergeConfig(filepath, $paths);
      } else if (!name.startsWith('.')) {
        const ns = $paths.join('.');
        const id = $paths[$paths.length - 1];
        const type = $paths[$paths.length - 2];
        this.merge({ [ns]: Config.parseFile(filepath) });
        this.set(`${ns}.id`, id);
        this.set(`${ns}.type`, type);
        this.set(`${ns}.toString`, () => ns);
      }
    });

    return this;
  }

  decorate() {
    const config = this;

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
        if (!room.items) config.set(`map.${key}.rooms.${id}.items`, new Set());
        if (!room.units) config.set(`map.${key}.rooms.${id}.units`, new Set());
        config.set(`map.${key}.rooms.${id}.toString`, () => `map.${key}.rooms.${id}`);
      });
    });

    return this;
  }
};
