import React from 'react';
import './Main.css';
import Products from '../Products/Products'
import { Provider } from 'react-redux';
import store from '../../store';

const Main = () => {
  return (
    <Provider store={store}>
      <div className="container">
        <div className='main'>
          <Products />
        </div>
      </div>
    </Provider>
  );
}

export default Main;