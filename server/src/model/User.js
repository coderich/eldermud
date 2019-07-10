import Being from '../core/Being';
import Stream from '../core/Stream';

export default class User extends Being {
  constructor(...args) {
    super(...args);
    this.memory = [];
    this.stream$ = new Stream(this);
  }

  async Room() {
    return this.get('room', this.room);
  }

  async Items() {
    return Promise.all(this.items.map(item => this.get('item', item)));
  }

  async findItem(target, take = false) {
    let index;
    const items = await this.Items();

    // Try plain search
    index = items.findIndex(it => it.name.indexOf(target.toLowerCase()) === 0);

    // Try Tokenize
    if (index < 0) {
      index = items.findIndex((it) => {
        const tokens = it.name.toLowerCase().split(' ');
        return tokens.find(tok => tok.indexOf(target.toLowerCase()) === 0);
      });
    }

    if (index < 0) this.balk("You don't have that on you!");

    if (take) {
      this.items.splice(index, 1);
    }

    return items[index];
  }
}
