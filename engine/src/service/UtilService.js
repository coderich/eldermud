const FS = require('fs');
const Path = require('path');

exports.requireDir = (dir) => {
  const data = {};
  dir = Path.resolve(dir);

  FS.readdirSync(dir).forEach((filename) => {
    const { name } = Path.parse(filename);
    const path = `${dir}/${filename}`;
    const stat = FS.statSync(path);

    if (stat && stat.isDirectory()) {
      data[name] = exports.requireDir(path);
    } else if (path.includes('.js')) {
      data[name] = require(path); // eslint-disable-line import/no-dynamic-require, global-require
    }
  });

  return data;
};
