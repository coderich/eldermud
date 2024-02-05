module.exports = {
  name: 'Chapel of Serenity',
  description: "On the second floor of the chapel, the atmosphere is that of hallowed reverence, with light filtering through grand stained glass windows depicting scenes of benevolence and sacrifice. This floor is reserved for contemplation and study, where the chapel's spiritual leaders prepare their sermons and maintain the ancient texts and relics.",
  rooms: {
    entrance: {
      name: 'Chapel Main Hall',
      type: 'pathway',
      terrain: 'stone',
      description: "Rows of pews face a magnificent stained glass window, casting colorful patterns on the cold stone floor. The silence is profound, broken only by the occasional turning of a page from the Chaplain's scriptures. To the east, a long, narrow aisle beckons visitors deeper into this place of quiet reflection.",
      exits: {
        e: '${self:map.eldenfortChapel.rooms.aisle}',
        d: '${self:map.eldenfort.rooms.chapelEntrance}',
      },
    },
    aisle: {
      name: 'Aisle of Whispers',
      type: 'pathway',
      terrain: 'carpeted',
      description: 'A carpeted aisle extends eastward, flanked by towering bookshelves filled with aged texts and illuminated manuscripts. Soft whispers echo from the walls, as if the very air carries the weight of centuries of prayer and contemplation. At the end of the pathway, a small altar stands before another stained glass window.',
      exits: {
        w: '${self:map.eldenfortChapel.rooms.entrance}',
        e: '${self:map.eldenfortChapel.rooms.altar}',
      },
    },
    altar: {
      name: 'Altar of Reflection',
      type: 'poi',
      terrain: 'marble',
      description: 'A marble altar, adorned with silver and candlelight, offers a space for reflection and meditation. The stunning stained glass window behind it depicts the founder of the chapel in vibrant hues. An ornately carved wooden door to the north hints at a private chamber reserved for the Chaplain.',
      paths: {
        n: '${self:map.eldenfortChapel.doors.sanctuary}',
      },
      exits: {
        w: '${self:map.eldenfortChapel.rooms.aisle}',
        n: '${self:map.eldenfortChapel.rooms.chaplainsChamber}',
      },
    },
    chaplainsChamber: {
      name: "Chaplain's Chamber",
      type: 'poi',
      terrain: 'wooden',
      description: "The Chaplain's private chamber is a haven of solitude, filled with relics of the chapel's history, a modest desk for sermon preparation, and a small, personal altar. A tall, narrow window provides a sliver of natural light, while shelves of books and artifacts speak of a lifetime devoted to the divine.",
      paths: {
        s: '${self:map.eldenfortChapel.doors.sanctuary}',
      },
      exits: {
        s: '${self:map.eldenfortChapel.rooms.altar}',
      },
    },
  },
  doors: {
    sanctuary: {
      name: 'Sanctuary Door',
      label: '${self:map.eldenfortChapel.doors.sanctuary.status} door',
      opaque: '@{in:${self:map.eldenfortChapel.doors.sanctuary.status}, closed, locked}',
      depiction: 'This door, intricately carved with religious motifs and symbols, stands tall and imposing. Its design showcases the skill of a master craftsman, with intricate patterns woven into the grain of the wood. The door is adorned with a large brass handle and a small, circular window that allows a glimpse into the dimly lit interior. Despite its grandeur, it speaks of a place of solitude and reflection, reserved for the Chaplain\'s personal devotions and spiritual guidance.',
      status: 'locked',
      durability: 100,
      picklock: 100,
      key: '${self:item.key.eldenfortChapel}',
    },
  },
};
