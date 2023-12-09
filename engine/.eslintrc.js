const { getEslintConfig } = require('@coderich/dev');

const eslintConfig = getEslintConfig();

Object.assign(eslintConfig.rules, {
  'no-template-curly-in-string': 'off',
});

eslintConfig.globals = {
  Config: 'readonly',
  Redis: 'readonly',
};

module.exports = eslintConfig;
