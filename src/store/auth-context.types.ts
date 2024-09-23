export enum AUTH_ACTION_TYPE {
  LOGIN,
  LOGOUT,
}

export interface IAuthContext {
  isLogin: boolean;
  Login(): void;
  Logout(): void;
}

export interface IAuthAction {
  type: AUTH_ACTION_TYPE;
}
