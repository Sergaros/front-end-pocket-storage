export enum RIGHTS {
  VIEWER,
  EDITOR,
  OWNER,
}

export interface IPermissions {
  isPrivate: boolean;
  users: {
    user: string;
    role: RIGHTS;
  }[];
}

export enum ITEM_TYPE {
  FILE,
  DIRECTORY,
}
