import React, { PureComponent, useState } from 'react';
import './Products.css';
import { Product } from '../../Models/General';
import { connect } from 'react-redux';
import ACTIONS from '../../actions'

interface ProductsProps {
  productList: [Product],
  addItem: Function,
  delItem: Function,
  editItem: Function,
  sortList: Function
}

class Products extends PureComponent<ProductsProps> {
  state = {
    selectedProduct: {} as Product,
    productList: this.props.productList,
    showPopup: false,
    selectType: 'new',
    isDateSort: false,
    isNameSort: false,
    isSearching: false
  }

  static getDerivedStateFromProps(props: any, state: any) {
    if (!state.isSearching) {
      return {
        productList: props.productList
      }
    }
    return state.productList
  }

  onProductClick(product: Product): void {
    if (this.state.selectedProduct.name === product.name) return;
    this.setState({ selectedProduct: product });
  }

  onClosePopup(data: any): void {
    if (data === null) {
      this.setState({ showPopup: false });
      return;
    }
    if (this.state.selectType === 'edit') {
      this.props.editItem(data);
    } else {
      this.props.addItem(data);
    }
    this.setState({ showPopup: false, selectedProduct: {}, selectType: 'new' });
  }

  searchByKeyword(keyword: string): void {
    const query = keyword.toLowerCase();
    if (!keyword) {
      this.setState({
        productList: this.props.productList,
        isSearching: false
      })
      return;
    } else {
      this.setState({ isSearching: true });
    }
    const list = Object.assign([], this.props.productList).filter(
      (item: any) => item.name.toLowerCase().indexOf(query) > -1
    );
    this.setState({
      productList: list
    })
  }

  render() {
    return (
      <>
        {
          this.state.showPopup ? (
            <Popup selectType={this.state.selectType}
              selectedProduct={this.state.selectedProduct}
              onClosePopup={(data: any) => this.onClosePopup(data)} />
          ) : null
        }

        <h1>Products:</h1>
        <div className="btn-container end" style={{ margin: '10px 0' }}>
          <input style={{ margin: '0 40px 0 0' }} type="string" placeholder="Search" name="search" onChange={(e) => {
            this.searchByKeyword(e.target.value);
          }} autoFocus />
          <button style={{ marginRight: 10 }} onClick={() => this.setState({ showPopup: true })}>Add New</button>
          {
            !this.state.productList.length ? null : (
              <>
                <button style={{ marginRight: 10 }} disabled={!this.state.selectedProduct.date ? true : false} onClick={() => {
                  this.props.delItem(this.state.selectedProduct)
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
                  this.props.sortList({ sortType: 'name', isSorted: this.state.isNameSort });
                  this.setState({ isNameSort: !this.state.isNameSort });
                }}>Name</div>
                <div className="table-cell">Price</div>
                <div className="table-cell" onClick={() => {
                  this.props.sortList({ sortType: 'date', isSorted: this.state.isDateSort });
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
    );
  };
}

const mapStateToProps = (state: any) => {
  return {
    productList: state.productList
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    addItem: (item: any) => dispatch(ACTIONS(item).ADD_ITEM),
    delItem: (item: any) => dispatch(ACTIONS(item).DEL_ITEM),
    editItem: (item: any) => dispatch(ACTIONS(item).EDIT_ITEM),
    sortList: (item: any) => dispatch(ACTIONS(item).SORT_LIST)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Products);

const Popup = (props: any) => {
  const [data, setData] = useState({
    name: props.selectType === 'edit' ? props.selectedProduct.name : '',
    price: props.selectType === 'edit' ? props.selectedProduct.price : 0,
    date: props.selectType === 'edit' ? props.selectedProduct.date : Date.now(),
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