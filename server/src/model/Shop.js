import Model from '../core/Model';

export default class Shop extends Model {
  async createItem(templateData) {
    const now = new Date().getTime();
    const id = `item.${this.id}.${now}`;
    const template = templateData.id;
    return this.setData(id, Object.assign({}, templateData, { id, template, state: {} }));
  }

  async Items() {
    return Promise.all(this.items.map(item => this.getData(item)));
  }
}
