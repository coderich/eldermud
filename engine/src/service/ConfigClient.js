const FS = require('fs');
const Path = require('path');
const Config = require('@coderich/config');

const appRootPath = Path.join(__dirname, '..', '..');

module.exports = class ConfigClient extends Config {
  constructor() {
    super({}, {
      in: (a, ...arr) => arr.includes(a),
    });
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
        const id = $paths[$paths.length - 1];
        const type = $paths[$paths.length - 2];
        const root = $paths[$paths.length - 3];
        const ns = [type, root, id].filter(Boolean).join('.');
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
        room.mapId = (i * 1000) + j + 1;
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
