const data = require('../../data/realm');

exports.findById = async (id) => {
  return data.rooms[id];
};
