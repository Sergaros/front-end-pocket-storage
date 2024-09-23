import { IPermission, IUserRole, TreeData } from '../items/item.types';

export interface IModalConfirmation {
  title: string;
  message: string;
  isOpen: boolean;
  onConfirm(): void;
  onCancel(): void;
}

export interface IModalCopy {
  title: string;
  inputName?: string;
  isOpen: boolean;
  onConfirm(dirName: string): void;
  onCancel(): void;
  directories: TreeData[];
}

export interface IModalName {
  title: string;
  name?: string;
  inputName?: string;
  nameValidateUrl: string;
  isOpen: boolean;
  onConfirm(name: string): void;
  onCancel(): void;
}

export interface IModalItemPermissions {
  title: string;
  isOpen: boolean;
  permissions?: IUserRole[];
  onConfirm(permissions: IPermission[]): void;
  onCancel(): void;
}
