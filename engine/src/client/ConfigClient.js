const Path = require('path');
const Config = require('@coderich/config');

const appRootPath = Path.join(__dirname, '..', '..');

module.exports = class ConfigClient extends Config {
  constructor(...args) {
    super(...args);

    // Load initial config
    this.merge(Config.parseFile(`${appRootPath}/app.config.yml`));

    // Resolve environment (env)
    this.resolve({ env: process.env });

    // // Override with env file
    // this.merge(Config.parseFile(`${appRootPath}/app.config.env.yml`)[this.get('env')]);

    // Final override from environment variables
    this.merge(Config.parseEnv());
  }
};
