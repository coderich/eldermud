module.exports = {
  name: 'Tutorial',
  description: '',
  backstory: '',
  storyline: '',
  triggers: [
    {
      on: 'meet:npc.sisterCaldra',
      if: [
        { actor: 'quest.tutorial' },
      ],
      do: [
        { text: "You... you're awake? Saints preserve us! I thought the fever took you for sure." },
        { query: '' },
        { text: 'No memory? Not unusual. The Plague eats more than flesh — it devours identity.' },
        { set: '' },
      ],
    },
    // {
    //   on: 'ask:sisterCaldra.memoryShard',
    //   if: [
    //     {},
    //   ],
    //   text: [
    //     "There is a chamber... a place where echoes of the dead cling to what was.",
    //     "The Warding Chamber. You’ll find it beyond the morgue. Touch a shard. Let it show you who you might've been."
    //   ],
    //   flag: 'tutorial.memoryShardSuggested',
    //   next: 'choose:sisterCaldra.guidance',
    // },
    {
      on: 'choose:sisterCaldra.guidance',
      choices: [
        {
          prompt: 'I don’t trust visions. What else can I do?',
          response: [
            "Then trust me. You won't last long out there without knowing who you are.",
          ],
        },
        {
          prompt: 'Will I ever remember who I truly was?',
          response: [
            'Maybe. But sometimes... who you become matters more.',
          ],
        },
        {
          prompt: 'Thank you. I’ll go to the chamber now.',
          response: [
            "Good. And when you're done, return to me. We'll see what can be salvaged.",
          ],
          setFlag: 'tutorial.memoryShardAccepted',
        },
      ],
    },
  ],
};
