module.exports = {
  name: 'signup',
  steps: [
    async (actor) => {
      const username = await actor.socket.query('query', 'username');
      console.log(username);
    },
  ],
};
