import UserStream from '../core/UserStream';
import Being from './Being';

export default class User extends Being {
  constructor(...args) {
    super(...args);
    this.isUser = true;
    this.memory = [];
    this.stream$ = new UserStream(this);
  }

  process(data) {
    this.stream$.next(data);
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
