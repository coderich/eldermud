const FS = require('fs');
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

  // // Cleanup files
  // files.forEach(file => FS.unlinkSync(file));
});

//
program.parseAsync(process.argv);
