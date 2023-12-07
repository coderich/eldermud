const { Action } = require('@coderich/gameflow');
const server = require('./src/server');
const UtilService = require('./src/service/UtilService');

(async () => {
  if (require.main === module) {
    UtilService.requireDir(`${__dirname}/src/action`);
    await Action.bootstrap();
    server.start();
  }
})();
