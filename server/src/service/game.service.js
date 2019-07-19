import Chance from 'chance';
import { remove } from 'lodash';
import { Subject, interval } from 'rxjs';
import { tap, share, publish } from 'rxjs/operators';
import { getData, setData } from './data.service';

let attackQueue = {};
const chance = new Chance();

export const roll = (dice) => {
  if (typeof dice !== 'string') return dice;

  const input = dice.match(/\S+/g).join('');
  const [, rolls, sides, op = '+', mod = 0] = input.match(/(\d+)d(\d+)([+|-|\\*|\\/]?)(\d*)/);

  const value = Array.from(Array(Number.parseInt(rolls, 10))).reduce((prev, curr) => {
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
    const total = roll(attack.acc);
    const hit = total >= target.ac;

    if (hit) {
      const damage = roll(attack.dmg);
      source.emit('message', { type: 'error', value: `You hit the ${target.name} for ${damage} damage!` });
      source.broadcastToRoom(source.room, 'message', { type: 'error', value: `${source.name} hits the ${target.name} for ${damage} damage!` });
      target.hp -= damage;
      if (target.hp <= 0) {
        remove(queue, el => el.sourceId === targetId || el.targetId === targetId);
      }
    } else {
      source.emit('message', { type: 'info', value: `You swing at the ${target.name}, but miss!` });
      source.broadcastToRoom(source.room, 'message', { type: 'info', value: `${source.name} swings at the ${target.name}, but misses!` });
    }

    resolveCombat(units, queue);
  } else {
    await Promise.all(units.map((unit) => {
      if (unit.hp <= 0) return unit.death();
      return setData(unit.id, 'hp', unit.hp);
    }));
    resolveLoop.next('resolveLoop');
  }
};

export const attackLoop = interval(4000).pipe(
  tap(async () => {
    const queue = Object.entries(attackQueue).reduce((prev, [sourceId, props]) => {
      return prev.concat({ sourceId, ...props });
    }, []).sort((a, b) => a.initiative - b.initiative);
    attackQueue = {};
    const units = await getAllUnitsInCombat(queue);
    resolveCombat(units, queue);
  }),
  share(),
  publish(),
); attackLoop.connect();
