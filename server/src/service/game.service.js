import { EventEmitter } from 'events';
import Chance from 'chance';
import { remove } from 'lodash';
import { Subject, interval } from 'rxjs';
import { tap, share, publish } from 'rxjs/operators';
import { getData, setData } from './data.service';
import { toRoom, emit } from './socket.service';
import { titleCase, numToArray } from './util.service';

let attackQueue = {};
const chance = new Chance();

export const eventEmitter = new EventEmitter();

export const roll = (dice) => {
  if (typeof dice !== 'string') return dice;

  const input = dice.match(/\S+/g).join('');
  const [, rolls, sides, op = '+', mod = 0] = input.match(/(\d+)d(\d+)([+|-|\\*|\\/]?)(\d*)/);

  const value = numToArray(Number.parseInt(rolls, 10)).reduce((prev, curr) => {
    return prev + chance.integer({ min: 1, max: sides });
  }, 0);

  return eval(`${value} ${op} ${mod}`); // eslint-disable-line
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
    unit.emit('message', { type: 'info', value: '*Combat Off*' });
    if (unit.isUser && target.isUser) target.emit('message', { type: 'info', value: `${unit.name} breaks combat.` });
  }
};

export const getAttack = id => attackQueue[id];
export const resolveLoop = new Subject().pipe(share());

const getAllUnitsInCombat = (queue) => {
  return Promise.all(
    Array.from(queue.reduce((set, { sourceId, targetId }) => {
      set.add(sourceId);
      set.add(targetId);
      return set;
    }, new Set())).map(id => getData(id)),
  );
};

const resolveCombat = async (units, queue, resolveQueue) => {
  if (queue.length) {
    const { sourceId, targetId, attack } = queue.shift(); // Next in line
    const [source, target] = [units.find(u => u.id === sourceId), units.find(u => u.id === targetId)];

    if (source.room === target.room) {
      const { cost = 0 } = attack;

      if (source.exp >= cost) {
        source.exp -= cost;
        const total = roll(attack.acc);
        const hit = total >= target.ac;
        const combatRoom = await getData(source.room);

        if (hit) {
          const damage = roll(attack.dmg);
          emit(source.id, 'message', { type: 'error', value: `You hit ${target.hitName} for ${damage} damage!` });
          emit(target.id, 'message', { type: 'error', value: `${titleCase(source.hitName)} hits you for for ${damage} damage!` });
          toRoom(combatRoom, 'message', { type: 'error', value: `${titleCase(source.hitName)} hits ${target.hitName} for ${damage} damage!` }, { omit: [source.id, target.id] });

          target.hp -= damage;
          if (attack.proc) attack.proc(source, target, damage);

          if (target.hp <= 0) {
            remove(queue, el => el.sourceId === targetId || el.targetId === targetId);
          }
        } else {
          emit(source.id, 'message', { type: 'cool', value: `You swing at ${target.hitName}, but miss!!` });
          emit(target.id, 'message', { type: 'cool', value: `${titleCase(source.hitName)} swings at you, but misses!` });
          toRoom(combatRoom, 'message', { type: 'cool', value: `${titleCase(source.hitName)} swings at ${target.hitName}, but misses!` }, { omit: [source.id, target.id] });
        }
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

  if (insta.length === 0) {
    Object.entries(attackQueue).forEach(([key, value]) => {
      if (value.targetId === targetId) delete attackQueue[key];
    });
  }
};

export const attackLoop = interval(4000).pipe(
  tap(async () => {
    const queue = getAttackQueue(attackQueue);
    attackQueue = {};
    const units = await getAllUnitsInCombat(queue);
    await resolveCombat(units, queue, [...queue]);
    resolveLoop.next('resolveLoop');
  }),
  share(),
  publish(),
); attackLoop.connect();

export const healthLoop = interval(12000).pipe(
  share(),
  publish(),
); healthLoop.connect();
