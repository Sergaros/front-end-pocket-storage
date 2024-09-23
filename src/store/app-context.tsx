import { createContext, useReducer } from 'react';
import {
  APP_ACTION_TYPE,
  AppContextType,
  IAppContextACtion,
} from './app-context.type';
import { IPocket } from '../components/content/pockets/Pocket.types';
import { IItem } from '../components/content/items/item.types';

export const AppContext = createContext<AppContextType>({
  pocketFilter: '',
  currentPocket: null,
  pockets: [],
  items: [],
  currentItems: [],

  /* eslint-disable */
  addPocket: (_pocket: IPocket) => {},
  renamePocket: (_id: string, _name: string) => {},
  deletePocket: (_id: string) => {},
  setPockets: (_pockets: IPocket[]) => {},
  setPocketFilter: (_filter: string) => {},
  setCurrentPocket: (_pocket: IPocket | null) => {},
  setItems: (_items: IItem[]) => {},
  setCurrentItems: (_items: IItem[]) => {},
  addItem: (_item: IItem) => {},
  deleteItem: (_id: string) => {},
  updateItem: (_id: string, _data: IItem) => {},
  /* eslint-enable */
});

function AppReducer(state: any, action: IAppContextACtion) {
  const updatedState = { ...state };
  if (action.type === APP_ACTION_TYPE.ADD_POCKET) {
    updatedState.pockets = [action.payload, ...updatedState.pockets];
  } else if (action.type === APP_ACTION_TYPE.SET_POCKETS) {
    updatedState.pockets = [...action.payload];
    updatedState.currentItems = [];
    updatedState.items = [];
  } else if (action.type === APP_ACTION_TYPE.SET_CURRENT_POCKET) {
    updatedState.currentPocket = action.payload;
    updatedState.currentItems = [];
    updatedState.items = [];
  } else if (action.type === APP_ACTION_TYPE.RENAME_POCKET) {
    const item: IItem = updatedState.pockets.find(
      (item: IItem) => item.id === action.payload.id,
    );
    item.name = action.payload.name;
  } else if (action.type === APP_ACTION_TYPE.REMOVE_POCKET) {
    updatedState.pockets = updatedState.pockets.filter(
      (item: IItem) => item.id !== action.payload.id,
    );
  } else if (action.type === APP_ACTION_TYPE.SET_POCKET_FILTER) {
    updatedState.pocketFilter = action.payload.filter;
  } else if (action.type === APP_ACTION_TYPE.SET_ITEMS) {
    updatedState.items = [...action.payload];
  } else if (action.type === APP_ACTION_TYPE.SET_CURRENT_ITEMS) {
    updatedState.currentItems = [...action.payload];
  } else if (action.type === APP_ACTION_TYPE.ADD_ITEM) {
    updatedState.items = [action.payload, ...updatedState.items];
  } else if (action.type === APP_ACTION_TYPE.UPDATE_ITEM) {
    const itemIndex: number = updatedState.items.findIndex(
      (item: IItem) => item.id === action.payload.id,
    );
    if (itemIndex !== -1) {
      updatedState.items[itemIndex] = {
        ...updatedState.items[itemIndex],
        ...action.payload.data,
      };
    } else {
      console.error('Error: UPDATE_ITEM failed.');
    }
  } else if (action.type === APP_ACTION_TYPE.REMOVE_ITEM) {
    updatedState.items = updatedState.items.filter(
      (item: IItem) => item.id !== action.payload.id,
    );
  } else {
    console.error(`Error: Auth Store, undefined action type '${action.type}'`);
  }

  return updatedState;
}

export default function AppProvider(props: any) {
  const [appState, appDispatch] = useReducer(AppReducer, {
    currentPocket: null,
    pockets: [],
    pocketFilter: '',
  });

  function addPocket(pocket: IPocket) {
    appDispatch({
      type: APP_ACTION_TYPE.ADD_POCKET,
      payload: pocket,
    });
  }

  function setPockets(pockets: IPocket[]) {
    appDispatch({
      type: APP_ACTION_TYPE.SET_POCKETS,
      payload: pockets,
    });
  }

  function renamePocket(id: string, name: string) {
    appDispatch({
      type: APP_ACTION_TYPE.RENAME_POCKET,
      payload: {
        id,
        name,
      },
    });
  }

  function deletePocket(id: string) {
    appDispatch({
      type: APP_ACTION_TYPE.REMOVE_POCKET,
      payload: {
        id,
      },
    });
  }

  function setPocketFilter(filter: string) {
    appDispatch({
      type: APP_ACTION_TYPE.SET_POCKET_FILTER,
      payload: {
        filter,
      },
    });
  }

  function setCurrentPocket(pocket: IPocket | null) {
    appDispatch({
      type: APP_ACTION_TYPE.SET_CURRENT_POCKET,
      payload: pocket,
    });
  }

  function setItems(items: IItem[]) {
    appDispatch({
      type: APP_ACTION_TYPE.SET_ITEMS,
      payload: items,
    });
  }

  function setCurrentItems(items: IItem[]) {
    appDispatch({
      type: APP_ACTION_TYPE.SET_CURRENT_ITEMS,
      payload: items,
    });
  }

  function addItem(item: IItem) {
    appDispatch({
      type: APP_ACTION_TYPE.ADD_ITEM,
      payload: item,
    });
  }

  function updateItem(id: string, data: IItem) {
    appDispatch({
      type: APP_ACTION_TYPE.UPDATE_ITEM,
      payload: {
        id,
        data,
      },
    });
  }

  function deleteItem(id: string) {
    appDispatch({
      type: APP_ACTION_TYPE.REMOVE_ITEM,
      payload: {
        id,
      },
    });
  }

  const ctxValue = {
    ...appState,
    addPocket,
    setPockets,
    renamePocket,
    deletePocket,
    setPocketFilter,
    setCurrentPocket,
    setItems,
    setCurrentItems,
    addItem,
    updateItem,
    deleteItem,
  };

  return (
    <AppContext.Provider value={ctxValue}>{props.children}</AppContext.Provider>
  );
}
