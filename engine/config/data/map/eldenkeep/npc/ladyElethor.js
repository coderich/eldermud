module.exports = {
  name: 'Lady Elethor',
  depiction: 'A dignified and commanding presence, Lady Elethor is often seen adorned in regal gowns fashioned from midnight blue silks and velvets, accented by motifs that hint at the mystical powers she wields. Her eyes hold the wisdom of the ages, glowing with an inner luminance that suggests her connection to the arcane. Dark raven locks cascade down her shoulders, framing her pale, almost ethereal, features.',
  depiction2: `
    Lady Elethor is a regal figure, wearing an elegant gown interwoven with enchantments of protection.
    Her gaze is piercing, and her presence commands respect.
    A crown of twisted black iron and gleaming gemstones rests heavily upon her brow.
  `,
  description: `
    As the ruler of Eldenfort, Lady Elethor bears the weight of her ancestors' legacy.
    She is a guardian of ancient secrets and forbidden lore, yet her reign has been marked by a troubled peace.
    She commands both respect and fear, as rumors of her mastery over the dark arts swirl among her subjects.
    Beneath her calm and collected exterior, however, lies a tormented soul seeking to protect her city from the calamities foretold in prophecies of old.
  `,
  description2: `
    The ruler of Eldenfort, Lady Elethor exudes both grace and might.
    Amidst court intrigue and the growing threat of the undead, she remains a pillar of strength for her people.
    She is well-versed in both statecraft and the mystic arts, a necessity given the dark forces that encroach upon her lands.
  `,
  backstory: `
    A descendant of the enigmatic travelers who founded Eldenfort, Lady Elethor was raised within the confines of Elden Keep, tutored in the arcane arts and the weighty responsibility of knowledge.
    Her ascension to power was marked by a series of mysterious occurrences, as if the ancient relics and tomes acknowledged her rightful place upon the throne of whispers.
  `,
  backstory2: `
    Once a scholar of ancient and forbidden knowledge, Lady Elethor was thrust into the role of leadership after a succession crisis.
    Under her reign, Eldenfort has seen a time of relative peace, but recent necromantic activity threatens to unravel the world she has strived to protect.
  `,
  room: '${self:map.eldenkeep.rooms.ladyElethorChambers}',
  quests: [
    '${self:quest.ghastlyWhispers}',
    '${self:quest.echosOfTheAncients}',
  ],
  str: 13,
  dex: 11,
  int: 10,
  wis: 9,
  con: 12,
  cha: 8,
  exp: 1,
  lvl: 1,
};
