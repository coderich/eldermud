const FS = require('fs');
const Path = require('path');

const srvPath = Path.resolve(__dirname, '..', '..', '..', 'mudlet');

module.exports = {
  '/mudlet/ui/{version}/{pkgName}': (req, res) => {
    const pkg = FS.readFileSync(Path.join(srvPath, 'eldermud.mpackage'));
    res.writeHead(200, { 'content-type': 'application/zip' });
    res.end(pkg);
  },
  '/mudlet/map/{version}': (req, res) => {
    res.writeHead(200);
    res.end(req.params.version);
  },
};
