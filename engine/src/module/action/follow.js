const { Action } = require('@coderich/gameflow');

Action.define('follow', [
  async ({ target }, { actor, abort }) => {
    if (!target) abort('You dont see that here!');
    if (!target.$invited.has(actor)) abort('You must first be invited!');
  },
  ({ target }, { actor }) => {
    // Notifications
    actor.send('text', APP.styleText('engaged', `*Following ${target.name}*`));
    target.send('text', `${actor.name} is now following you.`);

    // Keep track following listeners so you can unfollow/leave
    actor.$following = target;
    actor.$follow = ({ promise, data }) => actor.follow(promise, data);

    const leave = () => actor.perform('leave');
    const stray = ({ promise }) => !promise.$follow && leave();
    const unable = ({ promise }) => promise.$follow && promise.reason !== '$source' && leave();
    const notice = ({ data }) => actor.send('text', `Following ${target.name} ${APP.direction[data]}...`);

    actor.on('post:move', stray); // Did you stray off on your own?
    actor.on('abort:move', unable); // Are you personally unable to follow?
    target.once('post:death', leave);
    target.once('post:logout', leave);

    // Follow
    target.on('pre:move', actor.$follow);
    target.on('post:move', notice);

    // Unfollow
    actor.once('post:leave', () => {
      actor.off('post:move', stray);
      actor.off('abort:move', unable);
      target.off('post:move', notice);
    });
  },
]);
