const { Action } = require('@coderich/gameflow');

Action.define('look', [
  async ({ target, cmd }, { actor, abort }) => {
    if (!target) return abort('There is nothing to see there!');

    switch (target.type) {
      case 'room': {
        if (!cmd) {
          actor.broadcast(`${APP.styleText(actor.type, actor.name)} looks around the room`);
        } else {
          actor.broadcast(`${APP.styleText(actor.type, actor.name)} looks ${APP.direction[cmd.code]}`);
          target.units.forEach(unit => unit.writeln(`${APP.styleText(actor.type, actor.name)} peeks in from ${APP.theRDirection[cmd.code]}!`));
        }
        return actor.perform('room', target);
      }
      case 'npc': case 'player': case 'creature': {
        if (actor !== target) target.writeln(APP.styleText(actor.type, actor.name), 'looks you up and down');
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
          actor.writeln(`[${APP.styleText('room.name', target.name)}] (${wounded})`),
          actor.writeln(target.depiction),
        ]);
      }
      default: {
        await actor.writeln(`[${APP.styleText('room.name', target.name)}]`);
        return actor.writeln(target.depiction);
      }
    }
  },
]);
