const FS = require('fs');
const Path = require('path');
const Util = require('@coderich/util');
const merge = require('lodash.merge');
const { Command } = require('commander');

const program = new Command();

program.name('db').description('Stage Data');

program.command('stage').action(() => {
  const files = [];
  const sourceDir = `${__dirname}/output`;
  const destination = `${__dirname}/../src/database.json`;
  const database = JSON.parse(FS.readFileSync(destination));

  // Assemble new database
  FS.readdirSync(sourceDir).forEach((filename) => {
    const filepath = `${sourceDir}/${filename}`;
    const config = JSON.parse(FS.readFileSync(filepath));
    merge(database, Util.flatten(config, { safe: true }));
    files.push(filepath);
  });

  // Write database
  FS.writeFileSync(destination, JSON.stringify(Util.unflatten(database), (key, value) => {
    if (value != null) return value;
    return undefined;
  }, 2));
});

program.command('commit').action(() => {
  const database = `${__dirname}/../src/database.json`;
  const outputDir = `${__dirname}/output`;
  const dataDir = `${__dirname}/../src/data`;

  const data = Util.flatten(JSON.parse(FS.readFileSync(database)), { depth: 1 });
  Object.entries(data).forEach(([key, value]) => {
    const [folder, filename] = key.split('.');
    const filepath = Path.resolve(`${dataDir}/${folder}/${filename}.js`);
    FS.writeFileSync(filepath, `module.exports = ${JSON.stringify(value, null, 2)};\n`);
  });

  // Cleanup output files
  FS.readdirSync(outputDir).forEach((filename) => {
    const filepath = `${outputDir}/${filename}`;
    FS.unlinkSync(filepath);
  });

  // Reset database
  FS.writeFileSync(database, JSON.stringify({}, null, 2));
});

//
program.parseAsync(process.argv);
