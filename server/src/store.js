import { createStore, Action, Selector, Reducer } from '@coderich/hotrod';

// Store
const store = createStore();

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
  reducers.push(new Reducer(actions[`add${tcm}`], selectors[`${lcm}s`]), {
    success: (models, { payload }) => {
      const { id } = payload;
      models[id] = payload;
    },
  });

  // Remove
  reducers.push(new Reducer(actions[`remove${tcm}`], selectors[`${lcm}s`]), {
    success: (models, { payload }) => {
      const { id } = payload;
      delete models[id];
    },
  });

  // Update
  reducers.push(new Reducer(actions[`update${tcm}`], selectors[`${lcm}s`]), {
    success: (models, { payload }) => {
      const { id } = payload;
      models[id] = payload;
    },
  });

  store.loadModule(lcm, { actions, selectors, reducers });
};

addStoreModel('room');
addStoreModel('user');

export default store;
