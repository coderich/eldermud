/* Copyright (c) 2023 GozioInc. All Rights Reserved. */

const Path = require('path');
const { autoMock } = require('@coderich/dev');

module.exports = async () => {
  autoMock(Path.join(__dirname));
};
