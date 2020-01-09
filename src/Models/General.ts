export const PRODUCTS_LIST = [
  {
    name: 'shirt',
    price: 100,
    date: 1578588586334
  },
  {
    name: 'pant',
    price: 200,
    date: 1578588610799
  }
] as any;

export interface Product {
  name: string,
  price: number,
  date: number
}