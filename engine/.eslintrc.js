const { getEslintConfig } = require('@coderich/dev');

const eslintConfig = getEslintConfig();

eslintConfig.globals = {
  Config: 'readonly',
  Redis: 'readonly',
};

module.exports = eslintConfig;
