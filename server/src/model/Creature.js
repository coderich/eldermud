import Unit from './Unit';
import { addCreature } from '../service/creature.service';

export default class Creature extends Unit {
  constructor(...args) {
    super(...args);
    this.isCreature = true;
    addCreature(this);
  }
}
