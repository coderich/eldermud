import AbortActionError from '../error/AbortActionError';
import AbortStreamError from '../error/AbortStreamError';
import { addCreature } from '../service/creature.service';
import Unit from './Unit';

export default class Creature extends Unit {
  constructor(...args) {
    super(...args);
    this.isCreature = true;
    this.abortAction = (msg) => { throw new AbortActionError(msg); };
    this.abortStream = (msg) => { throw new AbortStreamError(msg); };
    addCreature(this.id);
  }
}
