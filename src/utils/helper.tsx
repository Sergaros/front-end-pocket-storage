import { jwtDecode } from 'jwt-decode';

import { IItem, TreeData } from '../components/content/items/item.types';
import { ITEM_TYPE } from '../types/common.types';
import { IPocket } from '../components/content/pockets/Pocket.types';

const bitToString = (bitSize: number): string => {
  if (bitSize < 1048576) {
    return `${(bitSize * 0.0001).toFixed(2)} kb`;
  } else {
    return `${(bitSize * 1e-6).toFixed(2)} mb`;
  }
};

const dateToString = (date: string): string => {
  return new Date(date).toLocaleString('en-US');
};

const itemTitleToString = (item: IItem) => {
  let sizeLabel = '';
  let createdDate = '';
  let updatedDate = '';

  if (item.type === ITEM_TYPE.FILE) {
    sizeLabel = ` Size: ${bitToString(item.size)} `;
  }

  if (item.createdDate) {
    createdDate = `Created: ${dateToString(item.createdDate)} `;
  }

  if (item.updatedDate) {
    updatedDate = `Updated: ${dateToString(item.updatedDate)} `;
  }

  return (
    <>
      {item.name}{' '}
      <span
        style={{
          color: '#566573',
          backgroundColor: '#f0f0f0',
          fontSize: 10,
        }}
      >
        {' '}
        {createdDate}
        {updatedDate}
        {sizeLabel}
      </span>
    </>
  );
};

const buildItemTree = (arr: IItem[], isRoot: boolean = false): TreeData[] => {
  const map = new Map();
  const result: TreeData[] = [];

  arr.forEach((item) => {
    map.set(item.id, {
      title: itemTitleToString(item),
      key: item.id,
      value: item.id,
      data: item,
      isLeaf: item.type === ITEM_TYPE.FILE,
      children: [],
    });
  });

  arr.forEach((item) => {
    if (!item.parent) {
      result.push(map.get(item.id));
    } else {
      const parent = map.get(item.parent);
      if (parent) {
        parent.children.push(map.get(item.id));
      }
    }
  });

  result.forEach((item) => {
    if (item.children && item.children.length === 0) {
      delete item.children;
    }
  });

  return isRoot
    ? [
        {
          title: itemTitleToString({
            name: '\\ (Pocket Root)',
            id: '',
            size: 0,
            parent: '',
            type: ITEM_TYPE.DIRECTORY,
            permissions: [],
            createdDate: '',
            updatedDate: '',
          }),
          key: 'root',
          value: 'root',
          children: [...result],
        } as TreeData,
      ]
    : result;
};

const GetUserEmail = () => {
  const authHeader: string | null = sessionStorage.getItem('user_info');

  if (authHeader) {
    const { email }: { email: string } = jwtDecode(authHeader);
    return email;
  } else {
    return '';
  }
};

const GetValue = (entity: any, property: string, defValue: any = ''): any => {
  if (entity && entity[property]) {
    return entity[property];
  } else {
    return defValue;
  }
};

const GetPocketName = (pocket: IPocket | null) => {
  if (pocket && pocket.name) {
    return pocket.name;
  } else {
    return '';
  }
};

const GetParentId = (currentItems: IItem[]) => {
  if (currentItems.length === 1) {
    if (currentItems[0].type === ITEM_TYPE.DIRECTORY) {
      return currentItems[0].id;
    } else {
      return currentItems[0].parent;
    }
  } else {
    const types = currentItems.map((item) => item.type);

    if (
      types.includes(ITEM_TYPE.FILE) &&
      !types.includes(ITEM_TYPE.DIRECTORY)
    ) {
      const parentId = currentItems[0].parent;
      if (!parentId) {
        return null;
      }

      for (let i = 0; i < currentItems.length; i++) {
        if (currentItems[i].parent !== parentId) {
          return null;
        }
      }

      return parentId;
    } else {
      return null;
    }
  }
};

export {
  bitToString,
  dateToString,
  itemTitleToString,
  buildItemTree,
  GetUserEmail,
  GetPocketName,
  GetValue,
  GetParentId,
};
