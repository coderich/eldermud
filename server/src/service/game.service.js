import { EventEmitter } from 'events';
import Chance from 'chance';
import { remove } from 'lodash';
import { Subject, interval } from 'rxjs';
import { tap, share, publish } from 'rxjs/operators';
import { getData, setData } from './data.service';
import { toRoom, emit } from './socket.service';

let attackQueue = {};
const chance = new Chance();

const titleCase = name => name.charAt(0).toUpperCase() + name.slice(1);

export const eventEmitter = new EventEmitter();
export const numToArray = num => Array.from(Array(num));

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

const resolveCombat = async (units, queue) => {
  if (queue.length) {
    const { sourceId, targetId, attack } = queue.shift(); // Next in line
    const [source, target] = [units.find(u => u.id === sourceId), units.find(u => u.id === targetId)];

    if (source.room !== target.room) return;

    const total = roll(attack.acc);
    const hit = total >= target.ac;

    if (hit) {
      const damage = roll(attack.dmg);
      emit(source.id, 'message', { type: 'error', value: `You hit ${target.hitName} for ${damage} damage!` });
      emit(target.id, 'message', { type: 'error', value: `${titleCase(source.hitName)} hits you for for ${damage} damage!` });
      toRoom(source.room, 'message', { type: 'error', value: `${titleCase(source.hitName)} hits ${target.hitName} for ${damage} damage!` }, { omit: [source.id, target.id] });

      target.hp -= damage;

      if (target.hp <= 0) {
        remove(queue, el => el.sourceId === targetId || el.targetId === targetId);
      }
    } else {
      emit(source.id, 'message', { type: 'cool', value: `You swing at ${target.hitName}, but miss!!` });
      emit(target.id, 'message', { type: 'cool', value: `${titleCase(source.hitName)} swings at you, but misses!` });
      toRoom(source.room, 'message', { type: 'cool', value: `${titleCase(source.hitName)} swings at ${target.hitName}, but misses!` }, { omit: [source.id, target.id] });
    }

    resolveCombat(units, queue);
  } else {
    await Promise.all(units.map((unit) => {
      if (unit.hp <= 0) return unit.death();
      unit.emit('message', { type: 'status', value: { hp: unit.hp } });
      return setData(unit.id, 'hp', unit.hp);
    }));
    resolveLoop.next('resolveLoop');
  }
};

export const attackLoop = interval(4000).pipe(
  tap(async () => {
    const queue = Object.entries(attackQueue).reduce((prev, [sourceId, props]) => {
      return prev.concat({ sourceId, ...props });
    }, []).sort((a, b) => b.initiative - a.initiative);
    attackQueue = {};
    const units = await getAllUnitsInCombat(queue);
    resolveCombat(units, queue);
  }),
  share(),
  publish(),
); attackLoop.connect();
