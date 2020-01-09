import React, { PureComponent, useState } from 'react';
import './Products.css';
import { Product } from '../../Models/General';
import { ProductContext } from '../../Providers/Products.provider';

interface ProductsProps {
  list: [Product]
}

export default class Products extends PureComponent<ProductsProps> {
  state = {
    selectedProduct: {} as Product,
    productList: this.props.list,
    showPopup: false,
    selectType: 'new',
    isDateSort: false,
    isNameSort: false
  }

  static getDerivedStateFromProps(props: any, state: any) {
    return {
      productList: props.list
    }
  }

  onProductClick(product: Product): void {
    this.setState({ selectedProduct: product })
  }

  render() {
    return (
      <ProductContext.Consumer>
        {
          ({ addEditProduct, deleteProduct, sortNameWise, sortDateWise, searchByKeyword }) => {
            return <>
              {
                this.state.showPopup ? (
                  <Popup selectType={this.state.selectType}
                    selectedProduct={this.state.selectedProduct}
                    onClosePopup={(data: any) => {
                      if (data === null) {
                        this.setState({ showPopup: false });
                        return;
                      }
                      addEditProduct(data);
                      this.setState({ showPopup: false, selectedProduct: {}, selectType: 'new' });
                    }} />
                ) : null
              }

              <h1>Products:</h1>
              <div className="btn-container end" style={{ margin: '10px 0' }}>
                <input style={{ margin: '0 40px 0 0' }} type="string" placeholder="Search" name="search" onChange={(e) => searchByKeyword(e.target.value)} autoFocus />
                <button style={{ marginRight: 10 }} onClick={() => this.setState({ showPopup: true })}>Add New</button>
                {
                  !this.state.productList.length ? null : (
                    <>
                      <button style={{ marginRight: 10 }} disabled={!this.state.selectedProduct.date ? true : false} onClick={() => {
                        deleteProduct(this.state.selectedProduct);
                        this.setState({ selectedProduct: {} });
                      }}>Delete</button>

                      <button disabled={!this.state.selectedProduct.date ? true : false} onClick={() => {
                        this.setState({ showPopup: true, selectType: 'edit' });
                      }}>Edit</button>
                    </>
                  )
                }
              </div>
              <div className='table'>
                {
                  this.state.productList.length ? (
                    <div className='table-header'>
                      <div className="table-cell" style={{ maxWidth: '80px' }}>S NO.</div>
                      <div className="table-cell" onClick={() => {
                        sortNameWise(this.state.isNameSort);
                        this.setState({ isNameSort: !this.state.isNameSort });
                      }}>Name</div>
                      <div className="table-cell">Price</div>
                      <div className="table-cell" onClick={() => {
                        sortDateWise(this.state.isDateSort);
                        this.setState({ isDateSort: !this.state.isDateSort });
                      }}>Date</div>
                    </div>
                  ) : null
                }
                {
                  this.state.productList.length ? (
                    this.state.productList.map((product: Product, index: number) => {
                      return (
                        <div className={`table-body boder-bottom ${this.state.selectedProduct.date === product.date ? `topic-selected` : ''}`}
                          key={product.date} onClick={() => this.onProductClick(product)}>
                          <div className="table-cell" style={{ maxWidth: '80px' }}> {index + 1}. </div>
                          <div className="table-cell"> {product.name} </div>
                          <div className="table-cell"> {product.price} </div>
                          <div className="table-cell"> {DateFormatter(product.date)} </div>
                        </div>
                      )
                    })
                  ) : <div className='table-body boder-bottom no-data'>No Data!</div>
                }
              </div>
            </>
          }
        }
      </ProductContext.Consumer>
    );
  };
}

const Popup = (props: any) => {
  const [data, setData] = useState({
    name: props.selectType === 'edit' ? props.selectedProduct.name : '',
    price: props.selectType === 'edit' ? props.selectedProduct.price : 0,
    date: props.selectType === 'edit' ? props.selectedProduct.date : null,
  });

  function onChangeHandler(e: any) {
    const { name, value } = e.target
    setData({ ...data, [name]: name === 'name' ? value : +value });
  }

  return (
    <div className="popup-container">
      <div className="popup-main">
        <input type="string" defaultValue={data.name} placeholder="Enter Product Name" name="name" onChange={onChangeHandler} autoFocus />
        <input type="number" defaultValue={data.price} placeholder="Enter Product Price" name="price" onChange={onChangeHandler} />
        <div className="btn-container end">
          <button disabled={!data.name ? true : false} style={{ marginRight: '10px' }}
            onClick={() => props.onClosePopup(data)}>Save</button>
          <button onClick={() => props.onClosePopup(null)}>Close</button>
        </div>
      </div>
    </div>
  )
}

const DateFormatter = (date: number) => {
  const newDate = new Date(date);
  return `${newDate.getDate()}-${newDate.getMonth() + 1}-${newDate.getFullYear()} (${newDate.getHours() + 1}:${newDate.getMinutes()}:${newDate.getSeconds()})`;
}