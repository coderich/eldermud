import { Model } from '@coderich/hotrod';

export default class extends Model {
  constructor(props, helpers) {
    super();
    this.assignProperties(Object.assign({}, props, helpers));
  }
}
