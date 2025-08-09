const { Action } = require('@coderich/gameflow');

Action.define('look', [
  async ({ target, cmd }, { actor, abort }) => {
    if (!target) return abort('There is nothing to see there!');

    switch (target.type) {
      case 'room': {
        if (!cmd) {
          actor.broadcast('text', `${APP.styleText(actor.type, actor.name)} looks around the room`);
        } else {
          actor.broadcast('text', `${APP.styleText(actor.type, actor.name)} looks ${APP.direction[cmd.code]}`);
          actor.perimeter('text', `${APP.styleText(actor.type, actor.name)} peeks in from ${APP.theRDirection[cmd.code]}!`);
        }
        return actor.perform('room', target);
      }
      case 'npc': case 'player': case 'creature': {
        if (actor !== target) target.send('text', APP.styleText(actor.type, actor.name), 'looks you up and down');
        const { hp, mhp } = await target.mGet('hp', 'mhp');
        const wounded = [
          'very critically wounded',
          'critically wounded',
          'severely wounded',
          'heavily wounded',
          'moderately wounded',
          'slightly wounded',
          'unwounded',
        ][Math.floor(((hp / mhp) * 100) / 15)];
        return Promise.all([
          actor.send('text', `[${APP.styleText('room.name', target.name)}] (${wounded})`),
          actor.send('text', target.depiction),
          // actor !== target ? actor.send('text', `${target.name} appears to be ${wounded}.`) : Promise.resolve(),
        ]);
      }
      default: {
        await actor.send('text', `[${APP.styleText('room.name', target.name)}]`);
        return actor.send('text', target.depiction);
      }
    }
  },
]);
