const FS = require('fs');
const Path = require('path');
const Config = require('@coderich/config');

const appRootPath = Path.join(__dirname, '..', '..');

module.exports = class ConfigClient extends Config {
  constructor() {
    super({}, {
      in: (a, ...arr) => arr.includes(a),
      concat: (a, ...b) => a.split(',').concat(b),
    });
    this.merge(Config.parseFile(`${appRootPath}/app.config.yml`));
    this.merge(Config.parseFile(`${appRootPath}/app.secrets.yml`));
    this.merge(Config.parseEnv({ pick: ['app__redis__url'] }));
  }

  get(key, ...rest) {
    if (key == null) return super.get(null, ...rest);
    return super.get(key, ...rest);
  }

  /**
   * Folders that begin with "_" are ignored and used for organizational purposes only
   * Folders that begin with "*" indicate the root/type so that you can co-locate data (mostly used inside of maps)
   */
  mergeConfig(dir, paths = []) {
    FS.readdirSync(dir).forEach((filename) => {
      const { name } = Path.parse(filename);
      const filepath = `${dir}/${filename}`;
      const stat = FS.statSync(filepath);
      const $paths = name === 'index' ? paths : paths.concat(name);

      if (stat?.isDirectory()) {
        this.mergeConfig(filepath, $paths);
      } else if (!name.startsWith('.')) {
        const rootIndex = Math.max($paths.findIndex(p => p.startsWith('@')), 0);
        const id = $paths.at(-1);
        const type = $paths.at(rootIndex).replace('@', '');
        const ns = $paths.slice(rootIndex).filter(p => !p.startsWith('_')).join('.').replaceAll('@', '');
        this.merge({ [ns]: Config.parseFile(filepath) });
        this.set(`${ns}.id`, id);
        this.set(`${ns}.type`, type);
        this.set(`${ns}.toString`, () => ns);
        this.set(`${ns}.__proto`, 'action');
      }
    });

    return this;
  }

  decorate() {
    Object.entries(this.get('map')).forEach(([key, map], i) => {
      if (map.doors) {
        Object.entries(map.doors).forEach(([id, door], j) => {
          door.id = id;
          door.type = 'door';
          door.toString = () => `map.${key}.doors.${id}`;
          door.__proto = 'action';
        });
      }

      Object.entries(map.rooms).forEach(([id, room], j) => {
        room.id = id;
        room.uid = (i * 1000) + j + 1;
        room.map = `${map}`;
        room.type = 'room';
        room.name = `${map.name}, ${room.name}`;
        room.items = new Set(room.items);
        room.units = new Set(room.units);
        room.toString = () => `map.${key}.rooms.${id}`;
        room.__proto = 'action';
      });
    });

    return this;
  }
};
