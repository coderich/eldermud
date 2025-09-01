module.exports = {
  name: 'Rubble',
  label: 'pile of rubble',
  description: 'A pile of rubble.',
  check: async ({ actor, abort }) => {
    const inv = await REDIS.sMembers(`${actor}.inventory`).then(items => items.map(item => item.substring(0, item.lastIndexOf('.'))));
    if (!inv.includes('item.rope')) abort('You are unable to scale the rubble!');
    else actor.writeln('You scale the rubble with your rope & grapple.');
  },
};
