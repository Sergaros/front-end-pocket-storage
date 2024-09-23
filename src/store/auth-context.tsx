import { createContext, useReducer } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {
  IAuthAction,
  IAuthContext,
  AUTH_ACTION_TYPE,
} from './auth-context.types';

export const AuthContext = createContext<IAuthContext>({
  isLogin: false,
  Login: () => {},
  Logout: () => {},
});

function AuthReducer(state: any, action: IAuthAction) {
  const updatedState = { ...state };
  if (action.type === AUTH_ACTION_TYPE.LOGIN) {
    updatedState.isLogin = true;
  } else if (action.type === AUTH_ACTION_TYPE.LOGOUT) {
    updatedState.isLogin = false;
  } else {
    console.error(`Error: Auth Store, undefined action type '${action.type}'`);
  }

  return updatedState;
}

export default function AuthProvider(props: any) {
  const authHeader: string | null = sessionStorage.getItem('user_info');
  let time = -1;

  if (authHeader) {
    const { exp } = jwtDecode(authHeader);

    time = exp ? exp * 1000 - Date.now() : -1;
  }

  if (time > 0) {
    axios.defaults.headers.common['authorization'] = authHeader;
  }

  const [authState, authDispatch] = useReducer(AuthReducer, {
    isLogin: time > 0,
  });

  function handleLogin() {
    authDispatch({
      type: AUTH_ACTION_TYPE.LOGIN,
    });
  }

  function handleLogout() {
    authDispatch({
      type: AUTH_ACTION_TYPE.LOGOUT,
    });
  }

  const ctxValue = {
    isLogin: authState.isLogin,
    Login: handleLogin,
    Logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={ctxValue}>
      {props.children}
    </AuthContext.Provider>
  );
}
