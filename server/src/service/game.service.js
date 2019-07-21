import { EventEmitter } from 'events';
import Chance from 'chance';
import { remove } from 'lodash';
import { Subject, interval } from 'rxjs';
import { tap, share, delay, publish } from 'rxjs/operators';
import { getData, setData } from './data.service';

let attackQueue = {};
const chance = new Chance();

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
  if (attackQueue[id]) {
    delete attackQueue[id];
    const unit = await getData(id);
    unit.emit('message', { type: 'info', value: '*Combat Off*' });
  }
};

export const getAttack = id => attackQueue[id];
export const alertLoop = new Subject().pipe(share());
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

      if (source.isUser) {
        source.emit('message', { type: 'error', value: `You hit the ${target.name} for ${damage} damage!` });
        source.broadcastToRoom(source.room, 'message', { type: 'error', value: `${source.name} hits the ${target.name} for ${damage} damage!` });
      }

      if (target.isUser) {
        target.emit('message', { type: 'error', value: `The ${source.name} hits you for ${damage} damage!` });
        target.broadcastToRoom(target.room, 'message', { type: 'error', value: `The ${source.name} hits ${target.name} for ${damage} damage!` });
      }

      target.hp -= damage;

      if (target.hp <= 0) {
        remove(queue, el => el.sourceId === targetId || el.targetId === targetId);
      }
    } else {
      if (source.isUser) {
        source.emit('message', { type: 'info', value: `You swing at the ${target.name}, but miss!` });
        source.broadcastToRoom(source.room, 'message', { type: 'info', value: `${source.name} swings at the ${target.name}, but misses!` });
      }

      if (target.isUser) {
        target.emit('message', { type: 'info', value: `The ${source.name} swings at you, but misses!` });
        target.broadcastToRoom(target.room, 'message', { type: 'info', value: `The ${source.name} swings at ${target.name}, but misses!` });
      }
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
    alertLoop.next('alert');
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
