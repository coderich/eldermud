module.exports = {
  name: 'Necropolis of the Forsaken',
  description: 'The Necropolis of the Forsaken is a somber realm where neophyte necromancers come to commune with the spirits and learn the dark arts. Its cryptic structures and esoteric shops are entwined with an ancient curse, and its air carries whispers of those long departed. Enter and master the secrets of life and death.',
  rooms: {
    entrancePlaza: {
      name: 'Entrance Plaza',
      terrain: 'cobbled ground',
      description: "An ominous gateway adorned with gargoyle statues marks your entry into the Necropolis. The cobbled ground is worn and cracked, evidence of the countless initiates who've walked this path before. Four long pathways diverge from here, leading to various areas within this domain of the dead.",
      exits: {
        n: '${self:map.necropolis.rooms.echoingCorridor}',
        s: '${self:map.necropolis.rooms.cursedGrounds}',
        e: '${self:map.necropolis.rooms.fallenMonumentsPath}',
        w: '${self:map.necropolis.rooms.twistedRootsPath}',
      },
    },
    echoingCorridor: {
      name: 'Echoing Corridor',
      terrain: 'stone-tiled hall',
      description: "A long corridor that amplifies even the softest of whispers into ghostly echoes. The walls are lined with ensorcelled tapestries depicting the necropolis's history. It bends towards the north significantly at its midpoint.",
      exits: {
        s: '${self:map.necropolis.rooms.entrancePlaza}',
        n: '${self:map.necropolis.rooms.shadowSanctum}',
      },
    },
    shadowSanctum: {
      name: 'Shadow Sanctum',
      terrain: 'dark chamber',
      description: 'A secretive chamber filled with ancient tomes and mysterious artifacts necessary for the study of necromancy. Here, initiates can purchase or trade for the enchanted items required for their dark craft.',
      exits: {
        s: '${self:map.necropolis.rooms.echoingCorridor}',
      },
      shop: '${self:map.necropolis.shops.shadowGoods}',
    },
    cursedGrounds: {
      name: 'Cursed Grounds',
      terrain: 'rotting earth',
      description: 'The path leads you through desecrated graves and overgrown vegetation. A heavy mist hangs in the air, and the soil beneath your feet emanates a sense of dread. It continues to the south before curving towards the west.',
      exits: {
        n: '${self:map.necropolis.rooms.entrancePlaza}',
        sw: '${self:map.necropolis.rooms.lichLair}',
      },
    },
    lichLair: {
      name: "Lich's Lair",
      terrain: 'decayed chamber',
      description: 'This decrepit chamber is the dwelling of a powerful Lich who sells forbidden knowledge and spells. The atmosphere is laden with dark magic, which hums with ominous energy. Flickering candles reveal shelves lined with scrolls and sinister relics.',
      exits: {
        ne: '${self:map.necropolis.rooms.cursedGrounds}',
      },
      shop: '${self:map.necropolis.shops.darkArtsDepot}',
    },
    fallenMonumentsPath: {
      name: 'Fallen Monuments Path',
      terrain: 'neglected path',
      description: 'A neglected path meanders by crumbling statues and fallen heroes of past necromantic battles. The path splits here, with a fork leading to a somber grove on the east and an overgrown trail to the southeast.',
      exits: {
        w: '${self:map.necropolis.rooms.entrancePlaza}',
        e: '${self:map.necropolis.rooms.skeletalGrove}',
        se: '${self:map.necropolis.rooms.ghoulGarden}',
      },
    },
    skeletalGrove: {
      name: 'Skeletal Grove',
      terrain: 'barren grove',
      description: 'Once a lush retreat, now a barren grove scattered with skeletal trees and bones. An air of silence prevails, only broken by the clinking of the shopkeeper arranging skeletal components and fossils offered for sale.',
      exits: {
        w: '${self:map.necropolis.rooms.fallenMonumentsPath}',
      },
      shop: '${self:map.necropolis.shops.boneBoutique}',
    },
    ghoulGarden: {
      name: "Ghoul's Garden",
      terrain: 'enchanted garden',
      description: 'An enchanting yet eerie garden filled with rare and deadly flora. Each plant radiates an unnatural aura, and the shop here trades in toxic brews and potions made from these peculiar blossoms.',
      exits: {
        nw: '${self:map.necropolis.rooms.fallenMonumentsPath}',
      },
      shop: '${self:map.necropolis.shops.poisonParlour}',
    },
    twistedRootsPath: {
      name: 'Twisted Roots Path',
      terrain: 'root-entangled path',
      description: 'A pathway where the roots of dead trees claw at the earth, as if trying to drag down the living. Mists swirl around the path which forks to the south, leading to a shadowy alcove, and northwest towards a quiet pond.',
      exits: {
        e: '${self:map.necropolis.rooms.entrancePlaza}',
        s: '${self:map.necropolis.rooms.undeadAlcove}',
        nw: '${self:map.necropolis.rooms.silencePond}',
      },
    },
    undeadAlcove: {
      name: 'Undead Alcove',
      terrain: 'hidden alcove',
      description: 'A hidden alcove that serves as a marketplace for the undead and their associates. Muffled groans and clinking chains are the ambience here, where items tailored for the undead are bought and sold under dim light.',
      exits: {
        n: '${self:map.necropolis.rooms.twistedRootsPath}',
      },
      shop: '${self:map.necropolis.shops.graveGoods}',
    },
    silencePond: {
      name: 'Pond of Silence',
      terrain: 'silent waters',
      description: 'A still pond reflecting the moonlight, no matter the time of day. It is at this serene, yet somber location that pathways from the necropolis converge. One path leads to an abandoned chapel, while another takes you towards a darkened observatory.',
      exits: {
        se: '${self:map.necropolis.rooms.twistedRootsPath}',
        n: '${self:map.necropolis.rooms.forgottenChapel}',
        ne: '${self:map.necropolis.rooms.obsidianObservatory}',
      },
    },
    forgottenChapel: {
      name: 'Forgotten Chapel',
      terrain: 'forgotten chapel',
      description: 'An abandoned chapel with eerie, stained-glass windows depicting various aspects of necromantic lore. It now serves as a clandestine shop where sacred items and relics with a dark past are traded.',
      exits: {
        s: '${self:map.necropolis.rooms.silencePond}',
      },
      shop: '${self:map.necropolis.shops.relicRendezvous}',
    },
    obsidianObservatory: {
      name: 'Obsidian Observatory',
      terrain: 'dark observatory',
      description: 'An ancient observatory whose walls are carved from obsidian. It is said that the stars viewed from here reveal the secrets of necromantic fate. The observatory doubles as a shop for arcane navigational tools and star charts.',
      exits: {
        sw: '${self:map.necropolis.rooms.silencePond}',
      },
      shop: '${self:map.necropolis.shops.celestialCuriosities}',
    },
  },
  shops: {
    shadowGoods: {
      name: 'Shadow Goods',
      description: 'A dimly lit emporium featuring a collection of precious yet dark artifacts, each holding the power to harness the shadows for various necromantic practices.',
    },
    darkArtsDepot: {
      name: 'Dark Arts Depot',
      description: 'A haven for the most daring, this store offers a vast array of spellbooks, potions, and magical reagents that delve into the darkest corners of necromancy.',
    },
    boneBoutique: {
      name: 'Bone Boutique',
      description: 'A specialized establishment that deals in bonecraft, from polished skulls to ornate femurs, catering to those who seek to command the skeletal remains of the dead.',
    },
    poisonParlour: {
      name: 'Poison Parlour',
      description: 'Within this garden of nocturnal flora, a shop promises brews and concoctions that entwine deadly poisons with enchantments for the cunning necromancer.',
    },
    graveGoods: {
      name: 'Grave Goods',
      description: 'Merchant to the deceased, this alcove offers wares specifically designed for the undead, from ethereal chains to spectral cloaks.',
    },
    relicRendezvous: {
      name: 'Relic Rendezvous',
      description: 'This hallowed yet desecrated chapel now serves as a marketplace for relics of forbidden worship and sacrilegious items that carry a faint echo of past transgressions.',
    },
    celestialCuriosities: {
      name: 'Celestial Curiosities',
      description: 'Astronomical instruments and arcane celestial charts line the shelves of this mysterious observatory, assisting necromancers in their pursuit to divine the future and manipulate fate.',
    },
  },
};
