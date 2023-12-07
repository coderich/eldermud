const { getEslintConfig } = require('@coderich/dev');

const eslintConfig = getEslintConfig();

eslintConfig.globals = {
  Config: 'readonly',
  DB: 'readonly',
};

module.exports = eslintConfig;
