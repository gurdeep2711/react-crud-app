import { createStore } from 'redux';
import { PRODUCTS_LIST } from '../Models/General';
import actions from '../reducers';

const defaultState = {
  productList: PRODUCTS_LIST
}

const store = createStore(actions, defaultState);

export default store;
