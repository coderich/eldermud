import { createStore, Action, Selector, Reducer } from '@coderich/hotrod';
import * as Models from './core/Models';
import db from './data';

const store = createStore(undefined, {
  users: {},
  rooms: {},
});

const set = async (model, id, data) => {
  const lcm = model.toLowerCase();
  db[`${lcm}.${id}`] = data;
};

const del = async (model, id) => {
  const lcm = model.toLowerCase();
  delete db[`${lcm}.${id}`];
};

const get = async (model, id, initialData = {}) => {
  const lcm = model.toLowerCase();
  const tcm = model.charAt(0).toUpperCase() + model.slice(1);

  // Attempt to get data from store
  const { actions, selectors } = store.info();
  const storeData = selectors[lcm].get(id);
  if (storeData) return storeData;

  // Attempt to get data from database
  const dbData = db[`${lcm}.${id}`];

  if (dbData || initialData) {
    const data = new Models[tcm](lcm, Object.assign({}, dbData, initialData), { get, set, del, store });
    actions[`add${tcm}`].dispatch(data);
    return data;
  }

  return undefined;
};

const addStoreModel = (model) => {
  const tcm = model.charAt(0).toUpperCase() + model.slice(1);
  const lcm = model.toLowerCase();
  const [actions, selectors, reducers] = [{}, {}, []];

  actions[`add${tcm}`] = new Action(`add${tcm}`);
  actions[`remove${tcm}`] = new Action(`remove${tcm}`);
  actions[`update${tcm}`] = new Action(`update${tcm}`);

  selectors[`${lcm}s`] = new Selector(`${lcm}s`).default({});
  selectors[lcm] = new Selector(selectors[`${lcm}s`]).map((models, i) => models[i]);

  // Add
  reducers.push(new Reducer(actions[`add${tcm}`], selectors[`${lcm}s`], {
    success: (models, { payload }) => {
      const { id } = payload;
      models[id] = payload;
    },
  }));

  // Remove
  reducers.push(new Reducer(actions[`remove${tcm}`], selectors[`${lcm}s`], {
    success: (models, { payload }) => {
      const { id } = payload;
      delete models[id];
    },
  }));

  // Update
  reducers.push(new Reducer(actions[`update${tcm}`], selectors[`${lcm}s`], {
    success: (models, { payload }) => {
      const { id } = payload;
      models[id] = Object.assign({}, models[id], payload);
    },
  }));

  // Module
  const mod = { actions, selectors, reducers };
  store.loadModule(lcm, mod);
  return mod;
};

export default { get, set, del, addStoreModel, store };
