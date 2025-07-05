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
    actor.send('text', APP.styleText('engaged', `*Following ${target.name}*`));
    target.$party.forEach(el => el !== actor && el.send('text', `${APP.styleText(actor.type, actor.name)} has joined your party`));

    // Keep track following listeners so you can unfollow/leave
    actor.$follow = ({ promise, data }) => {
      actor.streams.action.emit('add');
      actor.follow(promise, data);
    };

    const leave = () => actor.perform('leave');
    const stray = ({ promise }) => !promise.$follow && leave();
    const unable = ({ promise }) => promise.$follow && promise.reason !== '$source' && leave();
    const notice = ({ data }) => actor.send('text', `--- Following ${APP.styleText(target.type, target.name)} ${APP.direction[data]} ---`);

    actor.once('pre:death', leave);
    actor.once('post:logout', leave);
    actor.on('abort:move', unable); // Are you personally unable to follow?
    actor.prependListener('start:move', stray); // Did you stray off on your own?
    target.prependOnceListener('pre:death', leave);
    target.prependOnceListener('post:logout', leave);

    // Follow
    target.on('pre:move', actor.$follow);
    target.prependListener('post:move', notice);

    // Unfollow
    actor.once('post:leave', () => {
      actor.offFunction(leave, stray, unable, notice);
      target.offFunction(leave, stray, unable, notice);
    });
  },
]);
