import { ITEM_TYPE, RIGHTS } from '../../../types/common.types';

export interface IPermission {
  id?: string;
  userEmail: string;
  role: RIGHTS;
}

export interface IItem {
  id: string;
  name: string;
  size: number;
  parent: string;
  type: ITEM_TYPE;
  permissions: IPermission[];
  createdDate: string;
  updatedDate: string;
}

export interface TreeData {
  title: string | JSX.Element;
  key: string;
  value: string;
  data: IItem;
  isLeaf: boolean;
  children?: TreeData[];
}

export interface IUserRole {
  user: string;
  role: RIGHTS;
}
