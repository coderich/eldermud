import { EventEmitter } from 'events';
import { remove } from 'lodash';
import { Subject, interval } from 'rxjs';
import { tap, share, publish, retry, delayWhen } from 'rxjs/operators';
import { getData, setData, incData, pushData } from './data.service';
import { toRoom, emit } from './socket.service';
import { roll, titleCase, randomElement } from './util.service';

let attackQueue = {};

export { roll };

export const eventEmitter = new EventEmitter();

export const isValidTarget = (source, target) => {
  if (source.id !== target.id) return true;
  return false;
};

export const isValidRoomTarget = async (source) => {
  const room = await source.Room();
  const units = await Promise.all(room.units.map(id => getData(id)));

  for (let i = 0; i < units.length; i++) {
    if (isValidTarget(source, units[i])) return true;
  }

  return false;
};

export const addAttack = (sourceId, targetId, attack) => {
  attackQueue[sourceId] = {
    targetId,
    attack,
    initiative: roll('10d100'),
  };
};

export const breakAttack = async (id) => {
  const attack = attackQueue[id];

  if (attack) {
    delete attackQueue[id];
    const [unit, target] = await Promise.all([getData(id), getData(attack.targetId)]);
    unit.emit('message', { type: 'maroon', value: '*Combat Off*' });
    if (unit.isUser && target && target.isUser) target.emit('message', { type: 'info', value: `${unit.name} breaks combat.` });
  }
};

export const getAttack = id => attackQueue[id];
export const resolveLoop = new Subject().pipe(share());

const getAllUnitsInCombat = async (queue) => {
  const set = new Set();

  await Promise.all(queue.map(async ({ sourceId, targetId }) => {
    set.add(sourceId);
    const source = await getData(sourceId);
    const room = await source.Room();
    room.units.forEach(id => set.add(id));
  }));

  return (await Promise.all(Array.from(set).map(id => getData(id)))).filter(u => u);
};

const describer = async (source, target, attack, others, damage) => {
  const combatRoom = await getData(source.room);

  if (damage) {
    const verb = randomElement(attack.hits);
    emit(source.id, 'message', { type: 'error', value: `You ${verb} ${target.hitName} for ${damage} damage!` });
    emit(target.id, 'message', { type: 'error', value: `${titleCase(source.hitName)} ${verb}s you for ${damage} damage!` });
    toRoom(combatRoom, 'message', { type: 'error', value: `${titleCase(source.hitName)} ${verb}s ${target.hitName} for ${damage} damage!` }, { omit: [source.id, target.id] });
  } else {
    const verb = randomElement(attack.misses);
    emit(source.id, 'message', { type: 'cool', value: `You ${verb} at ${target.hitName}!` });
    emit(target.id, 'message', { type: 'cool', value: `${titleCase(source.hitName)} ${verb}s at you!` });
    toRoom(combatRoom, 'message', { type: 'cool', value: `${titleCase(source.hitName)} ${verb}s at ${target.hitName}!` }, { omit: [source.id, target.id] });
  }
};

const resolveCombat = async (units, queue, resolveQueue) => {
  if (queue.length) {
    const { sourceId, targetId, attack } = queue.shift(); // Next in line
    const [source, target] = [units.find(u => u.id === sourceId), units.find(u => u.id === targetId)];
    const others = units.filter(u => u.room === source.room && u.id !== source.id);
    attack.describer = attack.describer || describer;

    if (targetId === 'room') {
      const { cost = 0 } = attack;
      remove(resolveQueue, el => (el.sourceId === sourceId && el.targetId === targetId));

      if (!cost || source.ma >= cost) {
        if (others.length) {
          source.ma -= cost;
          const dmg = roll(attack.dmg);
          await attack.describer(source, targetId, attack, others, dmg);

          others.forEach((unit) => {
            const obj = { sourceId, targetId: unit.id, attack: { cost: 0, dmg, acc: 20, describer: () => {} } };
            queue.unshift(obj);
            resolveQueue.unshift(obj);
          });
        }
      } else {
        source.emit('message', { type: 'info', value: 'Insufficient mana.' });
      }

      return resolveCombat(units, queue, resolveQueue);
    }

    if (source && target && source.room === target.room) {
      const { cost = 0 } = attack;

      if (!cost || source.ma >= cost) {
        if (attack.pre) await attack.pre(source, target, attack, others);

        let damage = 0;
        source.ma -= cost;
        const total = roll(attack.acc);
        const hit = total >= target.ac;

        if (hit) {
          damage = roll(attack.dmg);
          target.hp -= damage;
        }

        await attack.describer(source, target, attack, others, damage);
        if (attack.post) await attack.post(source, target, attack, others, damage);
        if (target.hp <= 0) remove(queue, el => el.sourceId === targetId || el.targetId === targetId);
      } else {
        source.emit('message', { type: 'info', value: 'Insufficient mana.' });
      }
    } else {
      remove(queue, el => (el.sourceId === sourceId && el.targetId === targetId) || (el.sourceId === targetId && el.targetId === sourceId));
    }

    return resolveCombat(units, queue, resolveQueue);
  }

  // Bury the dead
  await Promise.all(units.filter(u => u.hp <= 0).map(async (unit) => {
    const involved = resolveQueue.filter(q => q.targetId === unit.id).map(q => units.find(u => u.id === q.sourceId)).filter(u => u && u.hp > 0);
    return unit.death(involved);
  }));

  // Award the brave
  return Promise.all(units.filter(u => u.hp > 0).map(async (unit) => {
    await Promise.all([
      setData(unit.id, 'hp', unit.hp),
      setData(unit.id, 'ma', unit.ma),
      setData(unit.id, 'exp', unit.exp),
      unit.heartbeat(),
    ]);
    return unit.status();
  }));
};

const getAttackQueue = (queue) => {
  return Object.entries(queue).reduce((prev, [sourceId, props]) => {
    return prev.concat({ sourceId, ...props });
  }, []).sort((a, b) => b.initiative - a.initiative);
};

export const instaAttack = async (sourceId, targetId, attack) => {
  const insta = [{ sourceId, targetId, attack }];
  const queue = getAttackQueue(Object.assign({}, attackQueue, { [sourceId]: { targetId, attack } }));
  const units = await getAllUnitsInCombat(queue);
  await resolveCombat(units, insta, queue);
  // if (insta.length === 0) {
  //   Object.entries(attackQueue).forEach(([key, value]) => {
  //     if (value.targetId === targetId) delete attackQueue[key];
  //   });
  // }
};

export const tick = interval(1000).pipe(
  share(),
  publish(),
); tick.connect();

let attackLoopCounter = 0;
export const attackLoop = interval(0).pipe(
  delayWhen(() => tick),
  tap(() => {
    if (++attackLoopCounter < 5) throw new Error('not yet');
    attackLoopCounter = 0;
  }),
  tap(async () => {
    const queue = getAttackQueue(attackQueue);
    attackQueue = {};
    const units = await getAllUnitsInCombat(queue);
    await resolveCombat(units, queue, [...queue]);
    resolveLoop.next('resolveLoop');
  }),
  retry(),
  share(),
  publish(),
); attackLoop.connect();

let healthLoopCounter = 0;
export const healthLoop = interval(0).pipe(
  delayWhen(() => tick),
  tap(() => {
    if (++healthLoopCounter < 15) throw new Error('not yet');
    healthLoopCounter = 0;
  }),
  retry(),
  share(),
  publish(),
); healthLoop.connect();

export const createItem = (templateData) => {
  const now = new Date().getTime();
  const id = `item.${templateData.id}.${now}`;
  const template = templateData.id;
  return setData(id, Object.assign({}, templateData, { id, template, state: {} }));
};

export const resolveInteraction = (room, npc, user, cmd, input) => {
  const { triggers = [] } = npc;
  const words = input.trim().toLowerCase().split(' ').map(w => w.trim());

  triggers.filter((trigger) => {
    const { cmd: tcmd, keywords } = trigger;
    if (tcmd !== cmd) return false;
    if (keywords && !words.some(word => keywords.indexOf(word) > -1)) return false;
    return true;
  }).forEach((trigger) => {
    const { id, effects = [] } = trigger;
    const historyId = `${npc.id}:${id}`;
    const historyCount = user.history[historyId] || 0;

    // Save update to history
    setData(user.id, 'history', Object.assign(user.history, { [historyId]: historyCount + 1 }));

    // Perform effects
    effects.forEach((effect) => {
      const { type, limit = Infinity } = effect;
      const [action, target] = type.split(':');

      if (historyCount < limit) {
        switch (action) {
          case 'info': {
            user.emit('message', { type: 'info', value: effect.info });
            break;
          }
          case 'html': {
            user.emit('message', { type: 'html', value: effect.html });
            break;
          }
          case 'increase': {
            const rolled = roll(effect.roll);
            incData(user.id, target, rolled);
            user.status();
            break;
          }
          case 'decrease': {
            const rolled = roll(effect.roll);
            incData(user.id, target, -rolled);
            user.status();
            break;
          }
          case 'give': {
            getData(target).then(data => createItem(data).then(item => pushData(user.id, 'items', item.id)));
            break;
          }
          default: {
            break;
          }
        }
      }
    });
  });
};
