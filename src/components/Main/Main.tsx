import React from 'react';
import './Main.css';
import ProductProvider, { ProductContext } from '../../Providers/Products.provider';

import Products from '../Products/Products'

const Main = () => {
  return (
    <ProductProvider>
      <ProductContext.Consumer>
        {({ productList }) => {
          return (
            <div className="container">
              <div className='main'>
                <Products list={productList} />
              </div>
            </div>
          )
        }}
      </ProductContext.Consumer >
    </ProductProvider >
  );
}

export default Main;