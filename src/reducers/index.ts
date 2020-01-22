function actions(state: any, action: any) {
  switch (action.type) {
    case 'PRODUCT_LIST':
      return state
    case 'ADD_ITEM':
      return {
        productList: state.productList.concat(action.item)
      };
    case 'DEL_ITEM':
      return {
        productList: state.productList.filter((item: any) => item.date !== action.item.date)
      };
    case 'EDIT_ITEM':
      const list = [...state.productList];
      const index = state.productList.findIndex((_product: any) => _product.date === action.item.date);
      if (index !== -1) {
        list[index] = action.item;
      }
      return {
        productList: list
      };
    case 'SORT_LIST':
      return sort([...state.productList], action.item.sortType, action.item.isSorted);
    default:
      return state
  }
}

export default actions;

function sort(data: any, type: string, isSorted: boolean): {} {
  const list = data;
  if (type === 'date') {
    if (isSorted) {
      list.sort((a: any, b: any) => a.date - b.date);
    } else {
      list.sort((a: any, b: any) => b.date - a.date);
    }
  } else {
    if (isSorted) {
      list.sort((a: any, b: any) => (a.name < b.name) ? 1 : -1);
    } else {
      list.sort((a: any, b: any) => (a.name > b.name) ? 1 : -1);
    }
  }
  return { productList: list };
}