// src/store/store.js
import { createStore } from 'redux';

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('reduxState', serializedState);
  } catch (e) {
    console.error('Không thể lưu state vào localStorage', e);
  }
};

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.error('Không thể load state từ localStorage', e);
    return undefined;
  }
};

const persistedState = loadState();

const initialState = {
  name: '',
  token: '',
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        name: action.payload.name,
        token: action.payload.token
      };
    default:
      return state;
  }
}

const store = createStore(
  reducer,
  persistedState
);

store.subscribe(() => {
  saveState(store.getState());
});

export default store;