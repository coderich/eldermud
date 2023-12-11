const { getEslintConfig } = require('@coderich/dev');

const eslintConfig = getEslintConfig();

Object.assign(eslintConfig.rules, {
  'no-template-curly-in-string': 'off',
});

eslintConfig.globals = {
  SYSTEM: 'readonly',
  CONFIG: 'readonly',
  REDIS: 'readonly',
};

module.exports = eslintConfig;
