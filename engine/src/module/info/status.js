const { Action } = require('@coderich/gameflow');

Action.define('status', [
  async (_, { actor }) => {
    const status = await actor.mGet('hp', 'mhp', 'ma', 'mma', 'exp', 'posture');
    status.posture += 'ing';
    actor.send('status', status);
    // actor.send(
    //   'status',
    //   'Health:',
    //   status.hp,
    //   '/',
    //   APP.styleText('status.mhp', status.mhp),
    //   '----',
    //   'Mana:',
    //   status.ma,
    //   '/',
    //   APP.styleText('status.mma', status.mma),
    // );
  },
]);

// -- status:echo(
//     -- 'Health: <span style="color:green">' .. data.hp .. ' / ' .. data.mhp .. '</span>'
//     -- .. sep
//     -- .. 'Mana: <span style="color:SkyBlue">' .. data.ma .. ' / ' .. data.mma .. '</span>'
//     -- .. sep
//     -- .. 'Remnants: <span style="color:LightSeaGreen">' .. data.exp .. '</span>'
//     -- .. sep
//     -- .. 'Posture: <span style="color:magenta">' .. data.posture .. '</span>'
//   -- );
