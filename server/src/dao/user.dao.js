const data = require('../../data/realm');

exports.findById = async (id) => {
  return data.users[id];
};
