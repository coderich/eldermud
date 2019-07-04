import { Model } from '@coderich/hotrod';

export default class extends Model {
  constructor(props, helpers) {
    super({ enumerable: true });
    this.defineProperties({ ...helpers, ...props }, { writable: true, enumerable: true });
  }
}
