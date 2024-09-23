import { IItem } from '../components/content/items/item.types';
import { IPocket } from '../components/content/pockets/Pocket.types';

export enum APP_ACTION_TYPE {
  ADD_POCKET,
  SET_POCKETS,
  SET_CURRENT_POCKET,
  RENAME_POCKET,
  REMOVE_POCKET,
  SET_POCKET_FILTER,
  SET_ITEMS,
  SET_CURRENT_ITEMS,
  ADD_ITEM,
  UPDATE_ITEM,
  REMOVE_ITEM,
}

export enum ITEM_ACTION {
  DOWNLOAD,
  RENAME,
  EDIT,
  DELETE,
  UPLOAD,
}

export interface IAppContextACtion {
  type: APP_ACTION_TYPE;

  payload: any;
}

export type AppContextType = {
  pocketFilter: string;
  currentPocket: IPocket | null;
  pockets: IPocket[];
  items: IItem[];
  currentItems: IItem[];
  addPocket: (pocket: IPocket) => void;
  renamePocket: (id: string, name: string) => void;
  deletePocket: (id: string) => void;
  setPockets: (pockets: IPocket[]) => void;
  setPocketFilter: (filter: string) => void;
  setCurrentPocket: (pocket: IPocket | null) => void;
  setItems: (items: IItem[]) => void;
  setCurrentItems: (items: IItem[]) => void;
  addItem: (item: IItem) => void;
  updateItem: (id: string, data: IItem) => void;
  deleteItem: (id: string) => void;
};
