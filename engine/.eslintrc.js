const { getEslintConfig } = require('@coderich/dev');

const eslintConfig = getEslintConfig();

Object.assign(eslintConfig.rules, {
  'no-template-curly-in-string': 'off',
});

eslintConfig.settings['import/core-modules'].push('commander');

eslintConfig.globals = {
  SYSTEM: 'readonly',
  CONFIG: 'readonly',
  REDIS: 'readonly',
  APP: 'readonly',
};

module.exports = eslintConfig;
