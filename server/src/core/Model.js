import { Model } from '@coderich/hotrod';
import { roll } from '../service/game.service';

export default class extends Model {
  constructor(props) {
    super();
    this.roll = roll;
    this.defineProperties({ ...props }, { writable: true, enumerable: true });
  }

  async initialize() {
    return this;
  }

  async resolveTarget(domain, target) {
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
    return items[index];
  }
}
