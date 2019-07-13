import { Model } from '@coderich/hotrod';
import Chance from 'chance';
import { emit } from '../service/event.service';
import Describer from './Describer';
import AbortActionError from './AbortActionError';

export default class extends Model {
  constructor(props) {
    super({ enumerable: true });
    this.balk = (msg) => { throw new AbortActionError(msg); };
    this.timeout = ms => new Promise(res => setTimeout(res, ms));
    this.defineProperties({ ...props }, { writable: true, enumerable: true });
    this.describer = new Describer(this.dao, this.id);
    this.chance = new Chance();
    this.emit = emit;
  }

  async describe(type, obj) {
    return { type, value: await this.describer.describe(type, obj) };
  }

  async resolveTarget(domain, target, take = false) {
    let index;
    const tcm = domain.charAt(0).toUpperCase() + domain.slice(1);
    const items = await this[tcm]();

    // Try plain search
    index = items.findIndex(it => it.name.indexOf(target.toLowerCase()) === 0);

    // Try Tokenize
    if (index < 0) {
      index = items.findIndex((it) => {
        const tokens = it.name.toLowerCase().split(' ');
        return tokens.find(tok => tok.indexOf(target.toLowerCase()) === 0);
      });
    }

    if (index < 0) return false;
    if (take) this.items.splice(index, 1);
    return items[index];
  }

  roll(dice) {
    const input = dice.match(/\S+/g).join('');
    const [, rolls, sides, op = '+', mod = 0] = input.match(/(\d+)d(\d+)([+|-|\\*|\\/]?)(\d*)/);

    const roll = Array.from(Array(Number.parseInt(rolls, 10))).reduce((prev, curr) => {
      return prev + this.chance.integer({ min: 1, max: sides });
    }, 0);

    return eval(`${roll} ${op} ${mod}`); // eslint-disable-line
  }
}
