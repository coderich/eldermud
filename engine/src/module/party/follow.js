const { Action } = require('@coderich/gameflow');

Action.define('follow', [
  async ({ target }, { actor, abort }) => {
    if (!target) abort('You dont see that here!');
    if (actor.$party.size > 1) abort('You are already in a party!');
    if (!target.$invited.has(actor)) abort('You must first be invited!');
  },
  ({ target }, { actor }) => {
    // Manage party
    actor.$party = target.$party;
    target.$party.add(actor);
    target.$invited.delete(actor);
    actor.$invited.delete(target);
    actor.$partyRank = 1; // 1 | 2 | 3
    actor.$following = target;

    // Notifications
    actor.writeln(APP.styleText('engaged', `*Following ${target.name}*`));
    target.$party.forEach(el => el !== actor && el.writeln(`${APP.styleText(actor.type, actor.name)} has joined your party`));

    // Keep track following listeners so you can unfollow/leave
    const follow = ({ promise, data }) => {
      actor.streams.action.emit('add');
      actor.follow(promise, data);
    };
    const leave = () => actor.perform('leave');
    const stray = ({ followPromise }) => !followPromise && leave();
    const unable = ({ promise, followPromise }) => followPromise && promise.reason !== '$source' && leave();
    const notice = ({ data }) => actor.writeln(`--- Following ${APP.styleText(target.type, target.name)} ${APP.direction[data.code]} ---`);

    actor.once('pre:death', leave);
    actor.once('pre:exit', leave);
    actor.on('abort:move', unable); // Are you personally unable to follow?
    actor.prependListener('start:move', stray); // Did you stray off on your own?
    target.prependOnceListener('pre:death', leave);
    target.prependOnceListener('pre:exit', leave);

    // Follow
    target.on('pre:move', follow);
    target.on('start:move', notice);

    // Unfollow
    actor.once('post:leave', () => {
      actor.offFunction(leave, stray, unable, notice, follow);
      target.offFunction(leave, stray, unable, notice, follow);
    });
  },
]);
