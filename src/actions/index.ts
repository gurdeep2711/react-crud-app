const ACTIONS = (item: any) => {
  return {
    ADD_ITEM: { type: 'ADD_ITEM', item },
    DEL_ITEM: { type: 'DEL_ITEM', item },
    EDIT_ITEM: { type: 'EDIT_ITEM', item },
    SORT_LIST: { type: 'SORT_LIST', item }
  }
}

export default ACTIONS;