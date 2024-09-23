export interface IPocket {
  id: string;
  name: string;
  createdDate: string;
  updatedDate: string;
}

export interface IPocketAction {
  Icon: any;
  tooltip: string;
  ukey?: string;
  handler(): void;
}

export interface IPocketNameForm {
  title: string;
  name: string;
  isOpen: boolean;
  onConfirm(name: string): void;
  onCancel(): void;
}
