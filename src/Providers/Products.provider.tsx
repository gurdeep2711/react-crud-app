import React, { PureComponent } from "react"
import { PRODUCTS_LIST, Product } from "../Models/General";

interface Data {
  productList: [Product],
  addEditProduct?: any,
  deleteProduct?: any,
  sortDateWise?: any,
  sortNameWise?: any,
  searchByKeyword?: any
}

export const ProductContext = React.createContext({} as Data);

class SingleProduct {
  name: string;
  price: number;
  date: any;
  constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
    this.date = Date.now()
  }
}

export default class ProductProvider extends PureComponent {
  state = {
    productList: PRODUCTS_LIST
  }
  oldProductList = [...this.state.productList];

  addEditProduct(product: { name: string, price: number, date: number }): void {
    const list = [...this.state.productList];
    const index = list.findIndex((_product: Product) => _product.date === product.date);
    if (index === -1) {
      const newProduct = new SingleProduct(product.name, product.price);
      list.push(newProduct);
    } else {
      list[index] = product;
    }
    this.setState({
      productList: list
    }, () => {
      this.oldProductList = this.state.productList
    });
  }

  deleteProduct(product: Product): void {
    const list = [...this.state.productList];
    const index = list.findIndex((_product: Product) => _product.date === product.date);
    list.splice(index, 1);
    this.setState({
      productList: list
    }, () => {
      this.oldProductList = this.state.productList
    })
  }

  sort(type: string, isSorted: boolean): void {
    const list = [...this.state.productList];
    if (type === 'date') {
      if (isSorted) {
        list.sort((a, b) => a.date - b.date);
      } else {
        list.sort((a, b) => b.date - a.date);
      }
    } else {
      if (isSorted) {
        list.sort((a, b) => (a.name < b.name) ? 1 : -1);
      } else {
        list.sort((a, b) => (a.name > b.name) ? 1 : -1);
      }
    }
    this.setState({ productList: list, });
  }


  searchByKeyword(keyword: string): void {
    if (!keyword) {
      this.setState({
        productList: this.oldProductList
      });
      return;
    }
    const query = keyword.toLowerCase();
    const list = Object.assign([], this.state.productList).filter(
      (item: any) => item.name.toLowerCase().indexOf(query) > -1
    );
    this.setState({ productList: list })
  }

  render() {
    return (
      <ProductContext.Provider value={{
        productList: this.state.productList,
        addEditProduct: (product: Product) => this.addEditProduct(product),
        deleteProduct: (product: Product) => this.deleteProduct(product),
        sortNameWise: (isSorted: boolean) => this.sort('name', isSorted),
        sortDateWise: (isSorted: boolean) => this.sort('date', isSorted),
        searchByKeyword: (keyword: string) => this.searchByKeyword(keyword)
      }}>
        {this.props.children}
      </ProductContext.Provider>
    )
  }
}

