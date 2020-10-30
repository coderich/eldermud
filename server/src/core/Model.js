import { Model } from '@coderich/hotrod';
import { roll } from '../service/game.service';
import { titleCase } from '../service/util.service';

export default class extends Model {
  constructor(props) {
    super();
    this.roll = roll;
    this.defineProperties({ ...props }, { writable: true, enumerable: true });
  }

  async initialize() {
    return this;
  }

  async resolveTarget(domain, target, options = {}) {
    let index;
    let items = await this[titleCase(domain)]();

    // Omit candidates from matching
    if (options.omit) items = items.filter(it => options.omit.indexOf(it.id) === -1);

    // Try plain search
    index = items.findIndex(it => it.name.toLowerCase().indexOf(target.toLowerCase()) === 0);

    // Try Tokenize
    if (index < 0) {
      const words = target.toLowerCase().split(' ');

      index = items.findIndex((it) => {
        const tokens = it.name.toLowerCase().split(' ');

        const info = words.reduce((prev, word) => {
          const { i, found } = prev;
          const j = tokens.slice(i).findIndex(tok => tok.indexOf(word) === 0);
          if (found !== false) return j > -1 ? { found: true, i: j } : { found: false };
          return prev;
        }, { i: 0, found: null });

        return Boolean(info.found);
      });
    }

    if (index < 0) return false;
    return items[index];
  }
}
